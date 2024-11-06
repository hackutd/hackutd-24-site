import { firestore } from 'firebase-admin';
import { auth } from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import initializeApi from '../../../lib/admin/init';
import {
  extractUserDataFromToken,
  userIsAuthorized,
} from '../../../lib/authorization/check-authorization';

initializeApi();
const db = firestore();

const USERS_COLLECTION = '/registrations';
const MISC_COLLECTION = '/miscellaneous';
const SCORING_COLLECTION = '/scoring';
/**
 *
 * Represent how data of a User is stored in the backend
 *
 */
export interface UserData {
  id: string;
  scans?: string[];
  user: {
    firstName: string;
    lastName: string;
    permissions: string[];
  };
}

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}
/**
 *
 * API endpoint to fetch all users from the database
 *
 * @param req HTTP request object
 * @param res HTTP response object
 *
 *
 */
async function getAllUsers(req: NextApiRequest, res: NextApiResponse) {
  const { headers } = req;

  const userToken = headers['authorization'];
  const isAuthorized = await userIsAuthorized(userToken);

  if (!isAuthorized) {
    return res.status(403).json({
      msg: 'Request is not authorized to perform admin functionality.',
    });
  }

  const doc = await db.collection(MISC_COLLECTION).doc('allusers').get();

  return res.json(doc.data().users);
}

/**
 *
 * Function to groups users together into groups based on teammate information. If you understand how this function works, you're a genius :D
 *
 * @param userList List of user infos
 * @return list of groups, each represented as `Registration[]`
 *
 */
export function generateGroupsFromUserData(userList: Registration[]): Registration[][] {
  const groupLeader = new Map<string, string>();
  const groupSize = new Map<string, number>();

  userList.forEach((user) => {
    groupLeader.set(user.user.preferredEmail, user.user.preferredEmail);
    groupSize.set(user.user.preferredEmail, 1);
  });

  const findLeader = (userEmail: string) => {
    if (groupLeader.get(userEmail) === userEmail) return userEmail;
    groupLeader.set(userEmail, findLeader(groupLeader.get(userEmail)));
    return groupLeader.get(userEmail);
  };

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const mergeGroup = (firstUserEmail: string, secondUserEmail: string) => {
    const firstUserLeaderEmail = findLeader(firstUserEmail);
    const secondUserLeaderEmail = findLeader(secondUserEmail);
    if (firstUserLeaderEmail === secondUserLeaderEmail) return;
    const firstGroupSize = groupSize.get(firstUserLeaderEmail);
    const secondGroupSize = groupSize.get(secondUserLeaderEmail);
    if (firstGroupSize > secondGroupSize) {
      groupLeader.set(secondUserLeaderEmail, firstUserLeaderEmail);
      groupSize.set(firstUserLeaderEmail, firstGroupSize + secondGroupSize);
    } else {
      groupLeader.set(firstUserLeaderEmail, secondUserLeaderEmail);
      groupSize.set(secondUserLeaderEmail, firstGroupSize + secondGroupSize);
    }
  };

  userList.forEach((user) => {
    [user.teammate1, user.teammate2, user.teammate3]
      .filter((email) => validateEmail(email) && groupLeader.has(email))
      .forEach((teammateEmail) => {
        mergeGroup(user.user.preferredEmail, teammateEmail);
      });
  });

  const preliminaryGroups = new Map<string, Registration[]>();
  userList
    .filter((user) => findLeader(user.user.preferredEmail) === user.user.preferredEmail)
    .forEach((user) => {
      preliminaryGroups.set(user.user.preferredEmail, []);
    });
  userList.forEach((user) => {
    preliminaryGroups.get(findLeader(user.user.preferredEmail)).push(user);
  });

  const validGroup = (potentialGroup: Registration[]) => {
    if (potentialGroup.length !== 4) return false;
    const voteCounter = new Map<string, number>();
    potentialGroup.forEach((user) => {
      voteCounter.set(user.user.preferredEmail, 0);
    });
    potentialGroup.forEach((user) => {
      [user.teammate1, user.teammate2, user.teammate3]
        .filter((teammateEmail) => voteCounter.has(teammateEmail))
        .forEach((teammateEmail) =>
          voteCounter.set(teammateEmail, voteCounter.get(teammateEmail) + 1),
        );
    });
    let isValidGroup = true;
    voteCounter.forEach((value, _) => {
      if (value !== 3) isValidGroup = false;
    });
    return isValidGroup;
  };

  const ret: Registration[][] = [];

  preliminaryGroups.forEach((value, _) => {
    if (validGroup(value)) {
      ret.push(value);
    } else {
      value.forEach((user) => ret.push([user]));
    }
  });

  return ret;
}

async function checkDecisionIsReleased() {
  const systemManagerDoc = await db.collection('/miscellaneous').doc('preferences').get();
  return systemManagerDoc.data().applicationDecisions;
}

/**
 *
 * API endpoint to fetch all users from the database
 *
 * @param req HTTP request object
 * @param res HTTP response object
 *
 *
 */
async function getAllRegistrations(req: NextApiRequest, res: NextApiResponse) {
  const { headers } = req;

  const userToken = headers['authorization'];
  const userData = await extractUserDataFromToken(userToken);

  const isAuthorized =
    (userData.user.permissions as string[]).includes('super_admin') ||
    (userData.user.permissions as string[]).includes('admin');

  if (!isAuthorized) {
    return res.status(403).json({
      msg: 'Request is not authorized to perform admin functionality.',
    });
  }
  const decisionReleased = await checkDecisionIsReleased();
  const statusString = ['Rejected', 'Maybe No', 'Maybe Yes', 'Accepted'];
  let allApps = [];
  // if ((userData.user.permissions as string[]).includes('super_admin')) {
  //   const allAppsSnapshot = await db
  //     .collection(USERS_COLLECTION)
  //     .where('user.permissions', 'array-contains', 'hacker')
  //     .get();
  //   const alLFormattedApp = await Promise.all(
  //     allAppsSnapshot.docs.map(async (doc) => {
  //       const data = doc.data();
  //       delete data.reviewer; // Remove reviewer data from response
  //       delete data.github; // Remove github data from response
  //       delete data.linkedin; // Remove linkedin data from response
  //       delete data.resume; // Remove resume data from response
  //       delete data.phoneNumber; // Remove phone number data from response
  //       const scoringSnapshot = await db
  //         .collection(SCORING_COLLECTION)
  //         .where('hackerId', '==', doc.id)
  //         .get();
  //       const reviewerIds = scoringSnapshot.docs.map((doc) => doc.data().adminId);
  //       const organizerReview = scoringSnapshot.docs.find((d) => d.data().adminId === userData.id);
  //       const reviewerInfo =
  //         reviewerIds.length === 0
  //           ? []
  //           : await db
  //               .collection(USERS_COLLECTION)
  //               .where('id', 'in', reviewerIds)
  //               .select('id', 'user.firstName', 'user.lastName')
  //               .get();
  //       const reviewerMapping = new Map<string, string>();
  //       reviewerInfo.forEach((info) => {
  //         reviewerMapping.set(
  //           info.data().id,
  //           `${info.data().user.firstName} ${info.data().user.lastName}`,
  //         );
  //       });
  //       const appScore = scoringSnapshot.docs.reduce((acc, doc) => {
  //         if (doc.data().score === 4) return acc + 1;
  //         if (doc.data().score === 1) return acc - 1;
  //         return acc;
  //       }, 0);
  //       if (scoringSnapshot.empty || organizerReview === undefined) {
  //         return {
  //           ...data,
  //           status: decisionReleased ? (appScore >= 2 ? 'Accepted' : 'Rejected') : 'In Review',
  //         };
  //       }
  //       return {
  //         ...data,
  //         scoring: scoringSnapshot.docs.map((doc) => {
  //           const data = doc.data();
  //           return {
  //             score: data.score,
  //             note: data.note,
  //             reviewer: reviewerMapping.get(data.adminId),
  //           };
  //         }),
  //         status: decisionReleased
  //           ? appScore >= 2
  //             ? 'Accepted'
  //             : 'Rejected'
  //           : statusString[organizerReview.data().score - 1],
  //       };
  //     }),
  //   );
  //   allApps = generateGroupsFromUserData(alLFormattedApp as any[]);
  // }
  const assignedAppCollectionRef = await db
    .collection(USERS_COLLECTION)
    .where('reviewer', 'array-contains', userData.id)
    .get();
  const commonPoolCollectionRef = await db
    .collection(USERS_COLLECTION)
    .where('inCommonPool', '==', true)
    .get();
  const commonAppWithScores = await Promise.all(
    commonPoolCollectionRef.docs
      .filter((doc) => !doc.data().reviewer || !doc.data().reviewer.includes(userData.id))
      .map(async (doc) => {
        const data = doc.data();
        delete data.reviewer; // Remove reviewer data from response
        delete data.github; // Remove github data from response
        delete data.linkedin; // Remove linkedin data from response
        delete data.resume; // Remove resume data from response
        delete data.phoneNumber; // Remove phone number data from response
        const scoringSnapshot = await db
          .collection(SCORING_COLLECTION)
          .where('hackerId', '==', doc.id)
          .get();
        const reviewerIds = scoringSnapshot.docs.map((doc) => doc.data().adminId);
        const organizerReview = scoringSnapshot.docs.find((d) => d.data().adminId === userData.id);
        const reviewerInfo = await db
          .collection(USERS_COLLECTION)
          .where('id', 'in', reviewerIds)
          .select('id', 'user.firstName', 'user.lastName')
          .get();
        const reviewerMapping = new Map<string, string>();
        reviewerInfo.forEach((info) => {
          reviewerMapping.set(
            info.data().id,
            `${info.data().user.firstName} ${info.data().user.lastName}`,
          );
        });
        const appScore = scoringSnapshot.docs.reduce((acc, doc) => {
          if (doc.data().score === 4) return acc + 1;
          if (doc.data().score === 1) return acc - 1;
          return acc;
        }, 0);
        if (scoringSnapshot.empty || organizerReview === undefined) {
          return {
            ...data,
            status: decisionReleased ? (appScore >= 2 ? 'Accepted' : 'Rejected') : 'In Review',
          };
        }
        return {
          ...data,
          scoring: scoringSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              score: data.score,
              note: data.note,
              reviewer: reviewerMapping.get(data.adminId),
            };
          }),
          status: decisionReleased
            ? appScore >= 2
              ? 'Accepted'
              : 'Rejected'
            : statusString[organizerReview.data().score - 1],
        };
      }),
  );
  const data = [
    ...(await Promise.all(
      assignedAppCollectionRef.docs.map(async (doc) => {
        const data = doc.data();
        delete data.reviewer; // Remove reviewer data from response
        delete data.github; // Remove github data from response
        delete data.linkedin; // Remove linkedin data from response
        delete data.resume; // Remove resume data from response
        delete data.phoneNumber; // Remove phone number data from response
        const scoringSnapshot = await db
          .collection(SCORING_COLLECTION)
          .where('hackerId', '==', doc.id)
          .get();
        const organizerReview = scoringSnapshot.docs.find((d) => d.data().adminId === userData.id);
        if (!decisionReleased) {
          return {
            ...data,
            status: organizerReview ? statusString[organizerReview.data().score - 1] : 'In Review',
            scoring: organizerReview
              ? [
                  {
                    score: organizerReview.data().score,
                    note: organizerReview.data().note,
                    reviewer: `${userData.user.firstName} ${userData.user.lastName}`,
                  },
                ]
              : undefined,
          };
        }
        const reviewerIds = scoringSnapshot.docs.map((doc) => doc.data().adminId);
        const reviewerInfo = await db
          .collection(USERS_COLLECTION)
          .where('id', 'in', reviewerIds)
          .select('id', 'user.firstName', 'user.lastName')
          .get();
        const reviewerMapping = new Map<string, string>();
        reviewerInfo.forEach((info) => {
          reviewerMapping.set(
            info.data().id,
            `${info.data().user.firstName} ${info.data().user.lastName}`,
          );
        });
        const appScore = scoringSnapshot.docs.reduce((acc, doc) => {
          if (doc.data().score === 4) return acc + 1;
          if (doc.data().score === 1) return acc - 1;
          return acc;
        }, 0);
        return {
          ...data,
          scoring: scoringSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              score: data.score,
              note: data.note,
              reviewer: reviewerMapping.get(data.adminId),
            };
          }),
          status: appScore >= 2 ? 'Accepted' : 'Rejected',
        };
      }),
    )),
    ...commonAppWithScores,
  ];

  shuffle(data);
  // Hide sensitive data
  const hideSensitiveData = (data: Registration[]) => {
    return data.map((d) => ({
      ...d,
      user: {
        ...d.user,
        firstName: 'Anonymous',
        lastName: '',
        preferredEmail: '',
      },
    }));
  };

  const groups = (userData as UserData).user.permissions.includes('super_admin')
    ? generateGroupsFromUserData(data as Registration[])
    : generateGroupsFromUserData(hideSensitiveData(data as Registration[]));

  return res.json({
    groups,
    allApps,
  });
}

function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  return getAllRegistrations(req, res);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case 'GET': {
      return handleGetRequest(req, res);
    }
    default: {
      return res.status(404).json({
        msg: 'Route not found',
      });
    }
  }
}
