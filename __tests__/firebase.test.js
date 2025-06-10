const admin = require('firebase-admin');

jest.mock('firebase-admin', () => {
  const firestore = jest.fn();
  return {
    apps: [],
    initializeApp: jest.fn(),
    credential: { cert: jest.fn(() => ({})) },
    firestore,
  };
});

describe('getFirestore', () => {
  beforeEach(() => {
    admin.apps.length = 0;
    admin.initializeApp.mockClear();
    admin.firestore.mockClear();
    delete require.cache[require.resolve('../firebase')];
    delete process.env.FIREBASE_PROJECT_ID;
  });

  test('returns null when no credentials or emulator', () => {
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    delete process.env.FIRESTORE_EMULATOR_HOST;

    const { getFirestore } = require('../firebase');
    const db = getFirestore();
    expect(db).toBeNull();
    expect(admin.initializeApp).not.toHaveBeenCalled();
  });

  test('initializes when emulator configured', () => {
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
    const fakeDb = {};
    admin.firestore.mockReturnValue(fakeDb);

    const { getFirestore } = require('../firebase');
    const db = getFirestore();
    expect(admin.initializeApp).toHaveBeenCalledWith({});
    expect(db).toBe(fakeDb);
  });
});
