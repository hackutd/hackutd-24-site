import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from 'firebase-admin';
import initializeApi from '../../../lib/admin/init';
import { userIsAuthorized } from '../../../lib/authorization/check-authorization';

initializeApi();

const db = firestore();

const APPLICATIONS_COLLECTION = '/registrations';
const MISC_COLLECTION = '/miscellaneous';
const AUTO_ACCEPT_ELIGIBLE_TEAM_SIZE = 4;

async function checkRegistrationAllowed() {
  const preferenceDoc = await db.collection('miscellaneous').doc('preferences').get();
  return preferenceDoc.data().allowRegistrations ?? false;
}

// Check if the team in which a user belongs to is eligible for auto accept
async function checkAutoAcceptEligibility(
  userData: Registration,
): Promise<{ eligible: boolean; teamMembers: FirebaseFirestore.DocumentReference[] }> {
  // Filter out empty emails
  const teammates: string[] = [userData.teammate1, userData.teammate2, userData.teammate3].filter(
    (email) => email && email !== '',
  );
  const teammateDocRef = [];

  // There are not enough members for auto acceptance
  if (teammates.length !== AUTO_ACCEPT_ELIGIBLE_TEAM_SIZE - 1)
    return { eligible: false, teamMembers: [] };
  const teammateCounter: Map<string, number> = new Map();
  await Promise.all(
    teammates.map(async (teammate) => {
      const snapshot = await db
        .collection(APPLICATIONS_COLLECTION)
        .where('user.preferredEmail', '==', teammate)
        .get();

      // Teammates may not have created account yet or wrong email
      if (snapshot.empty) return;

      // Get info provided by current teammate
      teammateDocRef.push(snapshot.docs[0].ref);
      const teammateDoc = snapshot.docs[0].data();

      [teammateDoc.teammate1, teammateDoc.teammate2, teammateDoc.teammate3].forEach(
        (friend: string | undefined) => {
          if (!friend || friend === '') return;
          if (!teammateCounter.has(friend)) teammateCounter.set(friend, 0);
          teammateCounter.set(friend, teammateCounter.get(friend) + 1);
        },
      );
    }),
  );

  // Team has more than 4 members
  if (teammateCounter.size > AUTO_ACCEPT_ELIGIBLE_TEAM_SIZE) {
    return { eligible: false, teamMembers: [] };
  }

  // Team is only eligible for auto accept if every team member is "vouched" by their other 3 members
  for (const [_, count] of Object.entries(teammateCounter)) {
    if (count !== AUTO_ACCEPT_ELIGIBLE_TEAM_SIZE - 1) return { eligible: false, teamMembers: [] };
  }
  return { eligible: true, teamMembers: teammateDocRef };
}

async function autoAcceptTeam(teamMembers: FirebaseFirestore.DocumentReference[]) {
  const userIds = teamMembers.map((member) => member.id);
  await Promise.all(
    userIds.map(async (userId) => {
      await db.collection('/acceptreject').doc(userId).set({
        adminId: 'admin',
        hackerId: userId,
        status: 'Accepted',
      });
    }),
  );
}

async function updateAllUsersDoc(userId: string, profile: any) {
  const docRef = db.collection(MISC_COLLECTION).doc('allusers');
  const userData = await docRef.get();
  await docRef.set({
    users: [
      ...userData.data().users,
      {
        id: profile.id,
        user: {
          firstName: profile.user.firstName,
          lastName: profile.user.lastName,
          permissions: profile.user.permissions,
        },
      },
    ],
  });
}

/**
 * Handles GET requests to /api/applications.
 *
 * This returns all applications the user is authorized to see.
 *
 * @param req The HTTP request
 * @param res The HTTP response
 */
async function handleGetApplications(req: NextApiRequest, res: NextApiResponse) {
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
  const isAuthorized = await userIsAuthorized(userToken, ['super_admin', 'admin']);

  if (!isAuthorized) {
    return res.status(401).send({
      type: 'request-unauthorized',
      message: 'Request is not authorized to perform admin functionality.',
    });
  }

  try {
    const snapshot = await db.collection(APPLICATIONS_COLLECTION).get();
    const applications: Registration[] = snapshot.docs.map((snap) => {
      // TODO: Verify the application is accurate and report if something is off
      return snap.data() as Registration;
    });
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error when fetching applications', error);
    res.status(500).json({
      code: 'internal-error',
      message: 'Something went wrong when processing this request. Try again later.',
    });
  }
}

/**
 * Handles POST requests to /api/applications.
 *
 * This creates a new application in the database using information given in the
 * request. If a user is not signed in, this route will return a 403
 * Unauthenticated error.
 *
 * @param req The HTTP request
 * @param res The HTTP response
 */
async function handlePostApplications(req: NextApiRequest, res: NextApiResponse) {
  const registrationAllowed = await checkRegistrationAllowed();
  if (!registrationAllowed) {
    return res.status(403).json({
      msg: 'Registration is no longer allowed',
    });
  }
  const {} = req.query;
  const applicationBody = req.body;

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
  let snapshot = await db
    .collection(APPLICATIONS_COLLECTION)
    .where('user.id', '==', body.user.id)
    .get();

  if (!snapshot.empty) {
    return res.status(400).json({
      msg: 'Profile already exists',
    });
  }
  const completedRegistrationInfo = {
    ...body,
    user: {
      ...body.user,
      permissions: ['hacker'],
    },
  };
  await db.collection(APPLICATIONS_COLLECTION).doc(body.user.id).set(completedRegistrationInfo);
  const { eligible, teamMembers } = await checkAutoAcceptEligibility(body);
  if (eligible) {
    snapshot = await db
      .collection(APPLICATIONS_COLLECTION)
      .where('user.id', '==', body.user.id)
      .get();
    await autoAcceptTeam([...teamMembers, snapshot.docs[0].ref]);
  }
  // await updateAllUsersDoc(body.user.id, body);
  res.status(200).json({
    msg: 'Operation completed',
    registrationData: completedRegistrationInfo,
  });
}

/**
 * Handles PUT requests to /api/applications.
 *
 * This updates an existing application in the database using the information
 * provided in the request. If a user is not signed in, this route will return a
 * 403 Unauthenticated error.
 *
 * @param req The HTTP request
 * @param res The HTTP response
 */
async function handlePutApplications(req: NextApiRequest, res: NextApiResponse) {
  const registrationAllowed = await checkRegistrationAllowed();
  if (!registrationAllowed) {
    return res.status(403).json({
      msg: 'Registration updates are no longer allowed',
    });
  }

  const applicationBody = req.body;

  let body: Registration;
  try {
    body = JSON.parse(req.body);
  } catch (error) {
    console.error('Could not parse request JSON body');
    return res.status(400).json({
      type: 'invalid',
      message: 'Invalid JSON body',
    });
  }

  const snapshot = await db
    .collection(APPLICATIONS_COLLECTION)
    .where('user.id', '==', body.user.id)
    .get();

  if (snapshot.empty) {
    return res.status(404).json({
      msg: 'Profile does not exist',
    });
  }

  // disable user to manually update teammate
  // TODO: could expand on this to allow admin to update teammate
  const completedRegistrationInfo = {
    ...body,
    teammate1: snapshot.docs[0].data().teammate1,
    teammate2: snapshot.docs[0].data().teammate2,
    teammate3: snapshot.docs[0].data().teammate3,
    user: {
      ...body.user,
      // update permissions according to original permission
      permissions: snapshot.docs[0].data().user.permissions,
    },
  };

  await db.collection(APPLICATIONS_COLLECTION).doc(body.user.id).update(completedRegistrationInfo);

  // temporarily disable this
  // const { eligible, teamMembers } = await checkAutoAcceptEligibility(body);
  // if (eligible) {
  //   const updatedSnapshot = await db
  //     .collection(APPLICATIONS_COLLECTION)
  //     .where('user.id', '==', body.user.id)
  //     .get();
  //   await autoAcceptTeam([...teamMembers, updatedSnapshot.docs[0].ref]);
  // }

  res.status(200).json({
    msg: 'Application updated successfully',
    updatedData: completedRegistrationInfo,
  });
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

  if (method === 'GET') {
    return handleGetApplications(req, res);
  } else if (method === 'POST') {
    return handlePostApplications(req, res);
  } else if (method == 'PUT') {
    return handlePutApplications(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
