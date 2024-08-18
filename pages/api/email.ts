import { firestore } from 'firebase-admin';
import initializeApi from '../../lib/admin/init';
import { NextApiRequest, NextApiResponse } from 'next';

initializeApi();
const db = firestore();

const MISCELLANEOUS_COLLECTION = '/miscellaneous';

async function addUserToEmailList(userEmail: string): Promise<void> {
  const emailList = await db.collection(MISCELLANEOUS_COLLECTION).doc('emails').get();
  const emails = emailList.data().email;
  await emailList.ref.update({
    email: [...emails, userEmail],
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const userEmail = req.body.userEmail;
  await addUserToEmailList(userEmail);
  return res.status(200).json({
    msg: 'success',
  });
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
