const { app, firestore } = require('firebase-admin');
const admin = require('firebase-admin');
const { generateGroupsFromUserData } = require('./pages/api/users')

/**
 *
 * Scheduling scripts for cron job in github actions
 *
 * Assign reviewers to applications
 *
 */

let apiInitialized = false;
//This path is a JSON object for the Firebase service account's private key
// let servAcc = require('../../private_keys/acmutd-hackportal-firebase-adminsdk-ev404-afcb7fdeb3.json');

/**
 * Initializes Firebase admin APIs using environment variables.
 */
function initializeFirebase() {
  if (admin.apps.length < 1) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.SERVICE_ACCOUNT_PROJECT_ID,
        clientEmail: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
        privateKey: process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }
}

/**
 * Initializes all services used to power API routes.
 *
 * Each API's route should must call this function before the handler takes
 * over. To add more services to the back-end API like database services or
 * other middleware, those services should be called in this function.
 */
function initializeApi() {
  if (apiInitialized) {
    return;
  }
  // Put API initializations here.
  initializeFirebase();

  apiInitialized = true;
}

initializeApi();

const db = firestore();
const REGISTRATION_COLLECTIONS = '/registration';

/**
 * Shuffle an array (Fisher-Yates shuffle).
 * Reference: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * @param array
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

async function assignReviewers() {
  try {
    // Get all non-reviewed applications
    const applicationsSnapshot = await db
      .collection(REGISTRATION_COLLECTIONS)
      .where('user.permissions', '==', ['hacker'])
      .get();

    // get all applications that need review and have role of hacker
    const applicationsNeededForReview: Registration[][] = generateGroupsFromUserData(applicationsSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      } as Registration;
    }));

    // Shuffle the applications to avoid bias
    shuffle(applicationsNeededForReview);

    // Get all organizers
    const organizersSnapshot = await db
      .collection(REGISTRATION_COLLECTIONS)
      .where('user.permissions', 'array-contains-any', ['super_admin', 'admin'])
      .get();
    const organizers = organizersSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        data: doc.data(),
        reviewCount: doc.data().reviewCount || 0,
      };
    });

    // Sort organizers by review count in ascending order
    organizers.sort((a, b) => a.reviewCount - b.reviewCount);

    // Assign reviewers
    while (applicationsNeededForReview.length > 0) {
      const reviewer1 = organizers[0];
      const reviewer2 = organizers[1];
      const applications = applicationsNeededForReview.pop();


      await Promise.all(applications.map(application => {
        // update database for registration collection
        return db
          .collection(REGISTRATION_COLLECTIONS)
          .doc(application.id)
          .update({
            reviewer: [reviewer1.id, reviewer2.id],
            user: {
              ...application.user,
              permissions: ['hacker', 'in_review'],
            },
          });

      }))

      // Increase review count for the organizers
      organizers[0].reviewCount++;
      organizers[1].reviewCount++;

      // Re-sort organizers by review count
      organizers.sort((a, b) => a.reviewCount - b.reviewCount);
    }

    // Batch update organizer review counts
    const batch = db.batch();
    organizers.forEach((organizer) => {
      const organizerRef = db.collection(REGISTRATION_COLLECTIONS).doc(organizer.id);
      batch.update(organizerRef, { reviewCount: organizer.reviewCount });
    });
    await batch.commit(); // Commit all updates in a single batch

    console.log('Reviewers assigned successfully');
  } catch (error) {
    console.error('Error assigning reviewers to applications', error);
  }
}

// Execute the assignment
assignReviewers();
