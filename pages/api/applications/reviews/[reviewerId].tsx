/**
 *
 * Applications specific to a reviewer
 *
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { auth, firestore } from 'firebase-admin';
import initializeApi from '../../../../lib/admin/init';
import { userIsAuthorized } from '../../../../lib/authorization/check-authorization';

initializeApi();

const db = firestore();

const APPLICATIONS_COLLECTION = '/registrations';
const SCORING_COLLECTION = '/scoring';

/**
 * Handles GET requests to /api/application/reviews/[reviewerId].
 *
 * This returns the applications that requires review from the reviewer.
 *
 * @param req The HTTP request
 * @param res The HTTP response
 */
async function handleGetApplicationForReview(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Handle user authorization
  const {
    query: { token, reviewerId: id },
    headers,
  } = req;

  //
  // Check if request header contains token
  // TODO: Figure out how to handle the string | string[] mess.
  const userToken = (token as string) || (headers['authorization'] as string);

  // only permits action for admin and super admin
  const isAuthorized = await userIsAuthorized(userToken, ['admin', 'super_admin']);

  // TODO: Extract from bearer token
  // Probably not safe
  if (!isAuthorized) {
    return res.status(401).send({
      type: 'request-unauthorized',
      message: 'Request is not authorized to perform admin functionality.',
    });
  }

  const userID = id as string;

  try {
    const applicationsSnapshot = await db
      .collection(APPLICATIONS_COLLECTION)
      .where('reviewer', 'array-contains', userID)
      .get();

    if (applicationsSnapshot.empty) {
      return res.status(404).json({
        code: 'not-found',
        message: 'No applications found for the given reviewer.',
      });
    }

    const applications = await Promise.all(
      applicationsSnapshot.docs.map(async (doc) => {
        const data: Registration & { reviewer?: string } = {
          ...(doc.data() as Registration),
          id: doc.id,
        };

        // get score for application if already exist
        const scoringSnapshot = await db
          .collection(SCORING_COLLECTION)
          .where('hackerId', '==', doc.id)
          .where('adminId', '==', userID)
          .get();

        delete data.user; // Remove user data from response
        delete data.reviewer; // Remove reviewer data from response
        delete data.github; // Remove github data from response
        delete data.linkedin; // Remove linkedin data from response
        delete data.resume; // Remove resume data from response
        delete data.phoneNumber; // Remove phone number data from response

        if (scoringSnapshot.empty) {
          return data;
        } else {
          // return application data with score and note
          return {
            ...data,
            score: scoringSnapshot.docs[0].data().score,
            note: scoringSnapshot.docs[0].data().note,
          };
        }
      }),
    );

    return res.status(200).json(applications);
  } catch (error) {
    console.error('Error when fetching applications for reviews', error);
    res.status(500).json({
      code: 'internal-error',
      message: 'Something went wrong when processing this request. Try again later.',
    });
  }
  return;
}

/**
 * Get application for review
 *
 * Corresponds to /api/applications/reviews/[reviewerId] route;
 */
export default function handleApplications(req: NextApiRequest, res: NextApiResponse) {
  // Get /applications collection in Cloud Firestore
  // GET: Return applications for reviews based on reviewer
  const { method } = req;
  if (method === 'GET') {
    return handleGetApplicationForReview(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
