import { NextApiRequest, NextApiResponse } from 'next';
import { userIsAuthorized } from '../../../lib/authorization/check-authorization';
import initializeApi from '../../../lib/admin/init';
import { firestore } from 'firebase-admin';

initializeApi();
const db = firestore();
const MAX_ASSIGN_ATTEMPT = 10;

type FirebaseDocumentRefType = FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;

async function getUserDocRef(
  userId: string,
): Promise<{ userDocRef: FirebaseDocumentRefType; userData: any } | null> {
  const snapshot = await db.collection('/registrations').doc(userId).get();
  if (snapshot && snapshot.exists) {
    return {
      userDocRef: snapshot.ref,
      userData: snapshot.data(),
    };
  }
  return null;
}

async function assignNewCheckInNumberToUser(
  userDocRef: FirebaseDocumentRefType,
  optInMethod: string,
  contactInfo: string,
): Promise<number> {
  const snapshot = await db.collection('/miscellaneous').doc('lateCheckInManager').get();
  if (snapshot && snapshot.exists) {
    const { nextAvailableNumber } = snapshot.data();

    // Attempt to assign id to user constant number of times. If unsuccessful, throw error and ask user to try again.
    let assignSuccessful = false;
    for (let iter = 0; iter < MAX_ASSIGN_ATTEMPT; iter++) {
      try {
        await userDocRef.update({
          waitListInfo: {
            waitlistNumber: nextAvailableNumber,
            notificationMethod: optInMethod,
            contactInfo,
          },
        });
        assignSuccessful = true;
        break;
      } catch (error) {
        console.error(error);
        continue;
      }
    }
    if (!assignSuccessful) {
      throw new Error('Unsuccessfully assigned check-in number to user...');
    }
    await snapshot.ref.update({
      nextAvailableNumber: nextAvailableNumber + 1,
    });
    return nextAvailableNumber;
  } else {
    // First assignable number will be 1.
    await snapshot.ref.set(
      {
        nextAvailableNumber: 2,
        allowedCheckInUpperBound: 0,
      },
      { merge: true },
    );
    await userDocRef.update({
      waitListInfo: {
        waitlistNumber: 1,
        notificationMethod: optInMethod,
        contactInfo,
      },
    });
    return 2;
  }
}

function alreadyHasCheckInNumber(userData: Registration) {
  return Object.hasOwn(userData, 'waitlistInfo');
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { headers } = req;
  const userToken = headers['authorization'];
  const isAuthorized = await userIsAuthorized(userToken, ['admin', 'super_admin']);
  if (!isAuthorized) {
    return res.status(403).json({
      statusCode: 403,
      msg: 'Request is not authorized to perform admin functionality',
    });
  }
  try {
    const fetchUserDocRefResult = await getUserDocRef(req.body.userId);
    if (!fetchUserDocRefResult) {
      return res.status(400).json({
        statusCode: 400,
        msg: 'User not found...',
      });
    }
    const { userDocRef, userData } = fetchUserDocRefResult;
    if (alreadyHasCheckInNumber(userData)) {
      return res.status(400).json({
        statusCode: 400,
        msg: 'User already had check-in number...',
      });
    }
    const checkInNumber = await assignNewCheckInNumberToUser(
      userDocRef,
      req.body.optInMethod,
      req.body.contactInfo,
    );
    return res.status(200).json({
      statusCode: 200,
      msg: `User's check in number is ${checkInNumber}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      msg: 'Unexpected error...',
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
      return res.status(404).json({ msg: 'Route not found' });
    }
  }
}
