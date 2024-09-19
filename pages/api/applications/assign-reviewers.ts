import { NextApiRequest, NextApiResponse } from 'next';
import { app, firestore } from 'firebase-admin';
import initializeApi from '../../../lib/admin/init';
import { userIsAuthorized } from '../../../lib/authorization/check-authorization';

initializeApi();

const db = firestore();

const APPLICATIONS_COLLECTION = '/registrations';
const ORGANIZERS_COLLECTION = '/member';

/**
 * Reference: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 *
 * @param array
 *
 */
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}

/**
 * Handles POST requests to /api/applications/assign-reviewers.
 *
 * Assigns reviewers to applications that do not have any reviewers assigned.
 *
 * @param req The HTTP request
 * @param res The HTTP response
 */
async function handleAssignReviewers(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Handle user authorization
  const {
    query: { token },
    headers,
  } = req;

  //
  // Check if request header contains token
  // TODO: Figure out how to handle the string | string[] mess.
  const userToken = (token as string) || (headers['authorization'] as string);
  // TODO: Extract from bearer token
  // Probably not safe
  const isAuthorized = await userIsAuthorized(userToken, ['super_admin']);

  // TODO: enable this section
  if (!isAuthorized) {
    return res.status(401).send({
      type: 'request-unauthorized',
      message: 'Request is not authorized to perform admin functionality.',
    });
  }

  try {
    //  get all non-reviewed applications, no reviewer properties (collections: registration,)
    // assumption made here: each time this api is called, it will assign 2 reviewers to all non-reviewed applications
    const applicationsSnapshot = await db
      .collection(APPLICATIONS_COLLECTION)
      .where('reviewer', '==', null)
      .get();

    // Convert the QuerySnapshot to an array of application objects
    const applications = applicationsSnapshot.docs.map((doc) => doc.data());
    // shuffle the applications to avoid bias
    shuffle(applications);

    // get all organizers (collections: member)
    const organizers = applications.filter((application) =>
      ['super_admin', 'admin'].some((allowedPermission) =>
        application.permission.includes(allowedPermission),
      ),
    );

    // sort organizers by review count ascending order
    organizers.sort((a, b) => a.reviewCount - b.reviewCount);

    // do while there is a non-reviewed application, pick an organizer form top of min heap and assign it to them
    while (applications.length > 0) {
      // if application registration has permission as organizer skipp loop
      // get organizer 0
      // get organizer 1
      const reviewer1 = organizers[0];
      const reviewer2 = organizers[1];
      const application = applications.pop();

      if (
        ['super_admin', 'admin'].some((allowedPermission) =>
          application.permission.includes(allowedPermission),
        )
      ) {
        continue;
      }

      // update database for registration collection
      await db
        .collection(APPLICATIONS_COLLECTION)
        .doc(application.id)
        .update({
          reviewer: [reviewer1.id, reviewer2.id],
        });
      // increase review count for organizer
      organizers[0].reviewCount++;
      organizers[1].reviewCount++;
      // resort organizer based on view count
      organizers.sort((a, b) => a.reviewCount - b.reviewCount);
    }

    const batch = db.batch();
    organizers.forEach((organizer) => {
      const organizerRef = db.collection(ORGANIZERS_COLLECTION).doc(organizer.id);
      batch.update(organizerRef, { reviewCount: organizer.reviewCount });
    });
    await batch.commit(); // Commit all updates in a single batch
  } catch (error) {
    console.error('Error when fetching applications', error);
    res.status(500).json({
      code: 'internal-error',
      message: 'Something went wrong when processing this request. Try again later.',
    });
  }
}

type ApplicationsResponse = {};

/**
 * Fetches application data.
 *
 * Corresponds to /api/applications route.
 */
export default async function handleApplications(
  req: NextApiRequest,
  res: NextApiResponse<ApplicationsResponse>,
) {
  const { method } = req;

  if (method === 'POST') {
    return handleAssignReviewers(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
