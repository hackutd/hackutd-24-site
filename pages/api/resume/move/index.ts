import { storage } from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import initializeApi from '@/lib/admin/init';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/auth';

initializeApi();

function extractFilenameFromUrl(resumeUrl: string): string {
  let splittedPath = resumeUrl.split('/');
  splittedPath = splittedPath[splittedPath.length - 1].split('%2F');
  return splittedPath[splittedPath.length - 1].substring(
    0,
    splittedPath[splittedPath.length - 1].indexOf('?'),
  );
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  if (firebase.apps.length <= 0)
    firebase.initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

  const { major, studyLevel, resumeUrl } = req.body;
  const fileName = extractFilenameFromUrl(resumeUrl);
  const storageRef = firebase.storage().ref();

  const moveDestination = storage()
    .bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
    .file('resumes/' + studyLevel + '/' + major + '/' + fileName);

  const moveOptions = {
    preconditionOpts: {
      ifGenerationMatch: 0,
    },
  };

  // Move the file to different location
  await storage()
    .bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
    .file('resumes/pending/' + fileName)
    .move(moveDestination, moveOptions);

  const studyLevelRef = storageRef.child('resumes/' + studyLevel);
  const majorRef = studyLevelRef.child(major);
  const fileRef = majorRef.child(fileName);
  const url = await fileRef.getDownloadURL();
  return res.status(200).json({
    url,
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
