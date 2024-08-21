import { NextApiRequest, NextApiResponse } from 'next';

import { firestore } from 'firebase-admin';
import initializeApi from '../../../lib/admin/init';

initializeApi();

const APPLICATIONS_COLLECTION = '/registrations';
const db = firestore();

async function checkRegistrationAllowed() {
  const preferenceDoc = await db.collection('miscellaneous').doc('preferences').get();
  return preferenceDoc.data().allowRegistrations ?? false;
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const registrationAllowed = await checkRegistrationAllowed();
  if (!registrationAllowed) {
    return res.status(403).json({
      msg: 'Registration is no longer allowed',
    });
  }

  let body: Registration;
  try {
    body = JSON.parse(req.body);
  } catch (error) {
    console.error('Could not parse request JSON body');
    return res.status(400).json({
      type: 'invalid',
      message: '',
    });
  }

  await db.collection(APPLICATIONS_COLLECTION).doc(body.user.id).set(body);
  res.status(200).json({
    msg: 'Operation completed',
    registrationData: {
      ...body,
      user: {
        ...body.user,
        ...(body.currentRegistrationPage === 1000000000 ? { permissions: ['hacker'] } : {}),
      },
    },
  });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  if (method === 'PUT') {
    return handlePutRequest(req, res);
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
