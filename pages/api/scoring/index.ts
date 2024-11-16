import initializeApi from '@/lib/admin/init';
import { extractUserDataFromToken } from '@/lib/authorization/check-authorization';
import { firestore } from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';

initializeApi();
const db = firestore();
// TODO: change this to acceptreject
const SCORING_COLLECTION = '/scoring';
const REGISTRATION_COLLECTION = '/registrations';

export interface ScoringDataType {
  adminId: string;
  hackerId: string;
  score: number;
  note: string;
  isSuperVote?: boolean;
}

const SCORING_NO = 1;
const SCORING_MAYBE_NO = 2;
const SCORING_MAYBE_YES = 3;
const SCORING_YES = 4;

async function checkAppShouldEnterCommonPool(hackerId: string, isInATeam: boolean) {
  const hackerApplication = await db.collection(REGISTRATION_COLLECTION).doc(hackerId).get();
  // NOTE: if app already had `inCommonPool` flag, there's no reason to move it to common pool again
  if (!!hackerApplication.data().inCommonPool) {
    return false;
  }
  const scoring = await db
    .collection(SCORING_COLLECTION)
    .where('hackerId', '==', hackerId)
    .where('appIsAssigned', '==', true)
    .get();
  if (scoring.docs.length > 2) {
    // NOTE: if this happens, something is very wrong here :)
    console.error('App is assigned to 2 more than 2 officers.');
  }
  const hasMaybeVerdict = scoring.docs.some(
    (doc) => doc.data().score === SCORING_MAYBE_YES || doc.data().score === SCORING_MAYBE_NO,
  );
  if (hasMaybeVerdict) return true;
  // NOTE: appScore can only be either -2, 0, or 2
  const appScore = scoring.docs.reduce((acc, curr) => {
    const currentScore = curr.data().score;
    if (currentScore === SCORING_NO) return acc - 1;
    if (currentScore !== SCORING_YES) {
      console.error('got a different score. something is wrong :)');
    }
    return acc + 1;
  }, 0);
  if (scoring.docs.length === 2 && appScore < 0) {
    // NOTE: if appScore is negative and 2 assigned officers already reviewed app, then user will go to common pool if whole team is rejected
    return isInATeam;
  }
  return appScore === 0;
}

async function moveAppToCommonPool(hackerId: string) {
  await db.collection(REGISTRATION_COLLECTION).doc(hackerId).set(
    {
      inCommonPool: true,
    },
    {
      merge: true,
    },
  );
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { headers } = req;
  const userToken = headers['authorization'];
  const reviewerData = await extractUserDataFromToken(userToken);
  if (!reviewerData) {
    return res.status(403).json({
      msg: 'Request is not authorized to perform admin functionality',
    });
  }
  // check if adminId === reviewerData.id
  if ((req.body.scores as ScoringDataType[]).some((score) => score.adminId !== reviewerData.id)) {
    return res.status(403).json({
      msg: 'Request is not authorized to perform admin functionality',
    });
  }

  const isTeam = req.body.scores.length > 1;

  // NOTE: req.body will be of type { scores: ScoringDataType[] }
  try {
    await Promise.all(
      (req.body.scores as ScoringDataType[]).map(async (scoring) => {
        // check if hackerId is valid
        const hackerDoc = await db.collection(REGISTRATION_COLLECTION).doc(scoring.hackerId).get();
        if (!hackerDoc.exists) {
          // if hacker data does not exist, then do nothing
          return;
        }

        //  store scoring into database
        const appAssignee: string[] = hackerDoc.data().reviewer;
        if (!appAssignee || appAssignee.length === 0) {
          await db.collection(SCORING_COLLECTION).add({
            ...scoring,
            appIsAssigned: false,
          });
          return;
        }
        // checking whether organizer is reviewing an app assigned to them or an app from common pool
        const scoringRef = await db
          .collection(SCORING_COLLECTION)
          .where('adminId', '==', scoring.adminId)
          .where('hackerId', '==', scoring.hackerId)
          .get();
        if (!scoringRef.empty) {
          await scoringRef.docs[0].ref.update({
            score: scoring.score,
            isSuperVote: !!scoring.isSuperVote,
            note: scoring.note,
          });
        } else {
          const appIsAssigned = appAssignee.some((assigneeId) => assigneeId === scoring.adminId);
          await db.collection(SCORING_COLLECTION).add({
            ...scoring,
            appIsAssigned,
          });
        }
        if (scoring.isSuperVote) {
          // remove app from all pool
          await hackerDoc.ref.update({
            'user.permissions': [hackerDoc.data().user.permissions[0]],
          });
        } else {
          //  check if application should be moved into common pool.
          const appShouldBeMovedToCommonPool = await checkAppShouldEnterCommonPool(
            scoring.hackerId,
            isTeam,
          );
          if (appShouldBeMovedToCommonPool) {
            await moveAppToCommonPool(scoring.hackerId);
          }
        }
      }),
    );
    return res.status(200).json({
      msg: 'Score submitted successful',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: 'Internal server error',
    });
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case 'POST': {
      return handlePostRequest(req, res);
    }
    default: {
      return res.status(404).json({
        msg: 'Route not found',
      });
    }
  }
}
