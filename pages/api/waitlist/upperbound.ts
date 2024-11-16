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
    .where('waitListInfo.waitlistNumber', '>=', lowerBoundCheckInNumber)
    .where('waitListInfo.waitlistNumber', '<=', upperBoundCheckInNumber)
    .get();
  const twilioClient = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );
  const sendgridClient = require('@sendgrid/mail');
  sendgridClient.setApiKey(process.env.SENDGRID_APIKEY!);
  // TODO: change message into something works better
  const messageContent =
    'Hey there, we are ready to check you into HackUTD! Please come to ECSW so that we can kick start the process!!! If you do not come to ECSW within 5 minutes of this text, your waitlist slot will be given to the next person';
  try {
    await Promise.all(
      snapshot.docs.map((doc) => {
        if (doc.data().waitListInfo.notificationMethod === 'sms') {
          return twilioClient.messages.create({
            body: messageContent,

            // If a phone number does not have "+" prefix, phone number is US phone number
            to:
              ((doc.data().waitListInfo.contactInfo as string).charAt(0) === '+' ? '' : '+1') +
              doc.data().waitListInfo.contactInfo,
            from: process.env.TWILIO_PHONE_NUMBER,
          });
        } else {
          return sendgridClient.send({
            to: doc.data().waitListInfo.contactInfo,
            from: {
              email: process.env.HACKUTD_EMAIL,
              name: 'HackUTD',
            },
            subject: 'Ready for check-in!!!',
            text: messageContent,
          });
        }
      }),
    );
  } catch (err) {
    console.error('Error sending notification to users');
    console.error(err);
  }
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
