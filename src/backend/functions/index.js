import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const startSession = functions.https.onCall(async (data, context) => {
  let prepared = null;
  const drupalUrl = process.env.DRUPAL_CONTENT_URL;
  if (drupalUrl) {
    try {
      const resp = await fetch(drupalUrl);
      if (!resp.ok) {
        throw new Error(`Drupal request failed: ${resp.status}`);
      }
      prepared = await resp.json();
    } catch (err) {
      console.warn(
        'Could not fetch Drupal content in Cloud Function; continuing without it:',
        err.message
      );
    }
  } else {
    console.info(
      'DRUPAL_CONTENT_URL not configured; Cloud Function will run with no prepared content'
    );
  }

  const session = {
    kjId: context.auth?.uid || 'kj',
    status: 'active',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    nowPlaying: null,
    queue: [],
    singers: {},
    preparedContent: prepared,
  };

  const ref = await admin.firestore().collection('sessions').add(session);
  return { sessionId: ref.id };
});
