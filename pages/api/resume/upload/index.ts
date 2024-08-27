import { NextApiRequest, NextApiResponse } from 'next';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/auth';
import nc from 'next-connect';
import multer from 'multer';
import { storage } from 'firebase-admin';
import initializeApi from '@/lib/admin/init';

initializeApi();

interface NCNextApiRequest extends NextApiRequest {
  file: Express.Multer.File;
}

const handler = nc<NCNextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.log(err);
    res.status(500).json({
      msg: 'Server error',
    });
  },
  onNoMatch: (req, res, next) => {
    res.status(404).json({
      msg: 'Route not found',
    });
  },
});

async function getPartialProfileResumeRef(body: { fileName: string }) {
  const storageRef = firebase.storage().ref();
  const partialResumeRef = storageRef.child('resumes/pending');
  const fileRef = partialResumeRef.child(body.fileName);
  try {
    await fileRef.getDownloadURL();
    return fileRef;
  } catch (err) {
    if (err.code === 'storage/object-not-found') {
      return null;
    } else {
      console.error(err);
      throw err;
    }
  }
}

handler.use(multer().single('resume'));
handler.post(async (req, res) => {
  if (!req.file) res.end();
  if (firebase.apps.length <= 0)
    firebase.initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

  await firebase
    .auth()
    .signInWithEmailAndPassword(
      process.env.NEXT_PUBLIC_RESUME_UPLOAD_SERVICE_ACCOUNT,
      process.env.NEXT_PUBLIC_RESUME_UPLOAD_PASSWORD,
    );

  const storageRef = firebase.storage().ref();
  // NOTE: This case will happen if user wants to save resume as part of partially completed profile
  if (req.body.isPartialProfile === 'true') {
    const partialResumeRef = storageRef.child('resumes/pending');
    const fileRef = partialResumeRef.child(req.body.fileName);
    await fileRef.put(req.file.buffer);
    const fileUrl = await fileRef.getDownloadURL();
    return res.status(200).json({
      url: fileUrl,
    });
  }

  const partialProfileResumeRef = await getPartialProfileResumeRef(req.body);
  // NOTE: This case will happen if user already saved their resume but still managed to retain file object in react state when submit application (submit application & save resume in the same sitting)
  if (partialProfileResumeRef !== null) {
    const moveDestination = storage()
      .bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
      .file('resumes/' + req.body.studyLevel + '/' + req.body.major + '/' + req.body.fileName);

    const moveOptions = {
      preconditionOpts: {
        ifGenerationMatch: 0,
      },
    };

    // Move the file to different location
    await storage()
      .bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
      .file('resumes/pending/' + req.body.fileName)
      .move(moveDestination, moveOptions);

    const studyLevelRef = storageRef.child('resumes/' + req.body.studyLevel);
    const majorRef = studyLevelRef.child(req.body.major);
    const fileRef = majorRef.child(req.body.fileName);
    const url = await fileRef.getDownloadURL();
    return res.status(200).json({
      url,
    });
  }

  // NOTE: This section will be reached only if user submits resume without saving it prior
  const studyLevelRef = storageRef.child('resumes/' + req.body.studyLevel);
  const majorRef = studyLevelRef.child(req.body.major);
  const fileRef = majorRef.child(req.body.fileName);

  await fileRef.put(req.file.buffer);
  const fileUrl = await fileRef.getDownloadURL();
  res.status(200).json({
    url: fileUrl,
  });

  // NOTE: In case user saved resume as part of partial profile but failed to retain file in react state, /api/resume/move will be used instead
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default handler;
