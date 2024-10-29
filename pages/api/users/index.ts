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

  const collectionRef = await db.collection(USERS_COLLECTION).get();
  const data = collectionRef.docs.map((doc) => doc.data());
  if (!(userData.user.permissions as string[]).includes('super_admin')) {
    return res.json(
      data.map((data) => ({
        ...data,
        user: {
          ...data.user,
          firstName: 'Anonymous',
          lastName: '',
        },
      })),
    );
  } else {
    return res.json(data);
  }
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
