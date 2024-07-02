import { firestore } from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import initializeApi from '../../lib/admin/init';
``;
initializeApi();
const db = firestore();

const PRIZES = '/prizes';

/**
 *
 * API endpoint to get data of prizes from backend for the prizes section in home page
 *
 * @param req HTTP request object
 * @param res HTTP response object
 *
 *
 */
async function getChallenges(req: NextApiRequest, res: NextApiResponse) {
  const snapshot = await db.collection(PRIZES).get();
  let data = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  data.sort((a, b) => a.rank - b.rank);
  res.json(data);
}

function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  return getChallenges(req, res);
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
