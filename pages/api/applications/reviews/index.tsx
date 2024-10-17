/**
 *
 * Applications in common pool
 *
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { auth, firestore } from 'firebase-admin';
import initializeApi from '../../../../lib/admin/init';
import {
  extractUserDataFromToken,
  userIsAuthorized,
} from '../../../../lib/authorization/check-authorization';

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
async function handleGetApplicationForReviewFromCommonPool(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // TODO: Handle user authorization
  const {
    query: { token },
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

  const userData = await extractUserDataFromToken(userToken);

  const userID = userData.user.id as string;

  try {
    const applicationsSnapshot = await db
      .collection(APPLICATIONS_COLLECTION)
      .where('inCommonPool', '==', true)
      .get();

    /**
     * currently we are fetching all applications from common pool including the one that contains the reviewer
     * firebase does not contain array-does-not-contain query, if there is any other way to do this, feel free to update this code
     */
    const applications = await Promise.all(
      applicationsSnapshot.docs.map(async (doc) => {
        const data: Registration & { reviewer?: string[] } = {
          ...(doc.data() as Registration),
          id: doc.id,
        };

        // if userId is in reviewer, skip this application
        if (data.reviewer.includes(userID)) {
          return;
        }

        // get scorings for application if already exist
        const scoringSnapshot = await db
          .collection(SCORING_COLLECTION)
          .where('hackerId', '==', doc.id)
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
            scoring: scoringSnapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                score: data.score,
                note: data.note,
              };
            }),
          };
        }
      }),
    );

    return res.status(200).json(applications);
  } catch (error) {
    console.error('Error when fetching applications from common pool', error);
    res.status(500).json({
      code: 'internal-error',
      message: 'Something went wrong when processing this request. Try again later.',
    });
  }
  return;
}

/**
 * Get application for review from common pool
 *
 * Corresponds to /api/applications/reviews route;
 */
export default function handleApplications(req: NextApiRequest, res: NextApiResponse) {
  // Get /applications collection in Cloud Firestore
  // GET: Return applications for reviews based on reviewer
  const { method } = req;
  if (method === 'GET') {
    return handleGetApplicationForReviewFromCommonPool(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
