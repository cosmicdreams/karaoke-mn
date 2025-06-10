const admin = require('firebase-admin');

function getFirestore() {
  if (admin.apps.length === 0) {
    const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!credentialPath) {
      console.warn('GOOGLE_APPLICATION_CREDENTIALS not set; using in-memory store');
      return null;
    }
    admin.initializeApp({
      credential: admin.credential.cert(require(credentialPath))
    });
  }
  return admin.firestore();
}

module.exports = { getFirestore };
