import { NextApiRequest, NextApiResponse } from 'next';

import { auth, firestore } from 'firebase-admin';
import initializeApi from '../../../lib/admin/init';

initializeApi();

const PARTIAL_APPLICATIONS_COLLECTION = '/partial-registrations';
const db = firestore();

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { headers } = req;
  const userToken = headers['authorization'] as string;
  if (!userToken || userToken === '') {
    return res.json({
      registrationData: null,
    });
  }
  const userData = await auth().verifyIdToken(userToken);
  const snapshot = await db
    .collection(PARTIAL_APPLICATIONS_COLLECTION)
    .where('id', '==', userData.uid)
    .get();
  if (snapshot.empty) {
    return res.json({
      registrationData: null,
    });
  }
  return res.json({
    registrationData: snapshot.docs[0].data(),
  });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case 'GET': {
      return handleGetRequest(req, res);
    }
    default: {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}
