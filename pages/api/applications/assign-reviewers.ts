import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from 'firebase-admin';
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
    const applications = applicationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // shuffle the applications to avoid bias
    shuffle(applications);

    // get all organizers (collections: member)
    const organizersSnapshot = await db.collection(ORGANIZERS_COLLECTION).get();
    const organizers: Organizer[] = organizersSnapshot.docs.map((doc) => {
      const data = doc.data();

      // Ensure the data has the required properties, or handle missing properties accordingly
      return {
        id: doc.id, // The document ID
        name: data.name, // The name field from Firebase
        reviewCount: data.reviewCount || 0, // The reviewCount field from Firebase
      } as Organizer;
    });

    // create a min heap of organizers based on review count
    const organizerHeap = new MinHeap<Organizer>(
      (a, b) => a.reviewCount - b.reviewCount,
      organizers,
    );

    // do while there is a non-reviewed application, pick an organizer form top of min heap and assign it to them
    while (applications.length > 0) {
      const reviewer1 = organizerHeap.removeMin();
      const reviewer2 = organizerHeap.removeMin();
      const application = applications.pop();

      // update database for registration collection
      await db
        .collection(APPLICATIONS_COLLECTION)
        .doc(application.id)
        .update({
          reviewer: [reviewer1.id, reviewer2.id],
        });
      // increase review count for organizer
      reviewer1.reviewCount++;
      reviewer2.reviewCount++;
      // add organizer back to heap
      organizerHeap.insert(reviewer1);
      organizerHeap.insert(reviewer2);
    }

    const batch = db.batch();
    while (!organizerHeap.isEmpty()) {
      const organizer = organizerHeap.removeMin();
      const organizerRef = db.collection(ORGANIZERS_COLLECTION).doc(organizer.id);
      batch.update(organizerRef, { reviewCount: organizer.reviewCount });
    }
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

interface Organizer {
  id: string;
  name: string;
  reviewCount: number;
}

class MinHeap<T> {
  private heap: T[] = [];

  constructor(private compare: (a: T, b: T) => number, array?: T[]) {
    if (array) {
      this.heap = [...array];
      this.buildHeap();
    }
  }

  // Get the parent index of a given index
  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  // Get the left child index of a given index
  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  // Get the right child index of a given index
  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  // Swap two elements in the heap
  private swap(index1: number, index2: number): void {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }

  // Insert an element into the heap
  public insert(element: T): void {
    this.heap.push(element);
    this.heapifyUp();
  }

  // Move the last element up to maintain the heap property
  private heapifyUp(): void {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
        this.swap(index, parentIndex);
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  // Remove and return the smallest element from the heap
  public removeMin(): T | null {
    if (this.heap.length === 0) {
      return null;
    }
    if (this.heap.length === 1) {
      return this.heap.pop() || null;
    }

    const root = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown();

    return root;
  }

  // Move the root element down to maintain the heap property
  private heapifyDown(index = 0): void {
    let smallest = index;
    const length = this.heap.length;
    const left = this.getLeftChildIndex(index);
    const right = this.getRightChildIndex(index);

    if (left < length && this.compare(this.heap[left], this.heap[smallest]) < 0) {
      smallest = left;
    }

    if (right < length && this.compare(this.heap[right], this.heap[smallest]) < 0) {
      smallest = right;
    }

    if (smallest !== index) {
      this.swap(index, smallest);
      this.heapifyDown(smallest);
    }
  }

  // Method to build a heap from the initial array
  private buildHeap(): void {
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this.heapifyDown(i);
    }
  }

  // Peek at the smallest element without removing it
  public peek(): T | null {
    return this.heap[0] || null;
  }

  // Get the number of elements in the heap
  public size(): number {
    return this.heap.length;
  }

  // Check if the heap is empty
  public isEmpty(): boolean {
    return this.heap.length === 0;
  }
}
