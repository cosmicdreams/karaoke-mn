const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (admin.apps.length === 0) {
  admin.initializeApp();
}

exports.startSession = functions.https.onCall(async (data, context) => {
  const drupalUrl = process.env.DRUPAL_CONTENT_URL;
  if (!drupalUrl) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'DRUPAL_CONTENT_URL not configured'
    );
  }

  let prepared;
  try {
    const resp = await fetch(drupalUrl);
    if (!resp.ok) {
      throw new Error(`Drupal request failed: ${resp.status}`);
    }
    prepared = await resp.json();
  } catch (err) {
    console.error('Error fetching Drupal content:', err);
    throw new functions.https.HttpsError('unknown', 'Failed to fetch Drupal content');
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
