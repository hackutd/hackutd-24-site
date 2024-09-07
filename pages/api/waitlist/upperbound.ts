import { NextApiRequest, NextApiResponse } from 'next';
import { userIsAuthorized } from '../../../lib/authorization/check-authorization';
import initializeApi from '../../../lib/admin/init';
import { firestore } from 'firebase-admin';

initializeApi();
const db = firestore();

async function sendNotificationsToWalkIns(
  lowerBoundCheckInNumber: number,
  upperBoundCheckInNumber: number,
) {
  const snapshot = await db
    .collection('/registrations')
    .where('waitlistNumber', '>=', lowerBoundCheckInNumber)
    .where('waitlistNumber', '<=', upperBoundCheckInNumber)
    .get();
  snapshot.forEach((doc) => {
    const userPhoneNumber = doc.data().phoneNumber;
    // TODO: extract phone number and send SMS message to phone number
  });
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
    const snapshot = await db.collection('/miscellaneous').doc('lateCheckInManager').get();
    if (snapshot && snapshot.exists) {
      const previousUpperBound = snapshot.data()['allowedCheckInUpperBound'] as number;
      await sendNotificationsToWalkIns(previousUpperBound + 1, req.body.value);
      await snapshot.ref.update({
        allowedCheckInUpperBound: req.body.value,
      });
    } else {
      await snapshot.ref.set({
        allowedCheckInUpperBound: req.body.value,
        version: 1,
        nextAvailableNumber: 1,
      });
    }
    return res.status(200).json({
      statusCode: 200,
      msg: 'Sucessful',
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
