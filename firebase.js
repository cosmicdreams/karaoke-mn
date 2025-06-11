import admin from 'firebase-admin';
import fs from 'fs';

function getFirestore() {
  if (admin.apps.length === 0) {
    const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const projectId = process.env.FIREBASE_PROJECT_ID;

    if (!credentialPath && !process.env.FIRESTORE_EMULATOR_HOST) {
      console.warn(
        'GOOGLE_APPLICATION_CREDENTIALS not set and no emulator configured; using in-memory store'
      );
      return null;
    }

    const options = {};
    if (credentialPath) {
      const creds = JSON.parse(fs.readFileSync(credentialPath, 'utf8'));
      options.credential = admin.credential.cert(creds);
    }
    if (projectId) {
      options.projectId = projectId;
    }

    admin.initializeApp(options);
  }

  if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.info('Using Firestore emulator at', process.env.FIRESTORE_EMULATOR_HOST);
  }

  return admin.firestore();
}

export { getFirestore };
