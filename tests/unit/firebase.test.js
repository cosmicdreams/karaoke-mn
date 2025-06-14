import { describe, test, beforeEach, expect, vi } from 'vitest';
import admin from 'firebase-admin';

vi.mock('firebase-admin', () => {
  const firestore = vi.fn();
  const mock = {
    apps: [],
    initializeApp: vi.fn(),
    credential: { cert: vi.fn(() => ({})) },
    firestore,
  };
  return {
    ...mock,
    default: mock,
  };
});

describe('getFirestore', () => {
  beforeEach(() => {
    admin.apps.length = 0;
    admin.initializeApp.mockClear();
    admin.firestore.mockClear();
    delete process.env.FIREBASE_PROJECT_ID;
  });

  test('returns null when no credentials or emulator', async () => {
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    delete process.env.FIRESTORE_EMULATOR_HOST;
    const mod = await import('../../firebase.js');
    const db = mod.getFirestore();
    expect(db).toBeNull();
    expect(admin.initializeApp).not.toHaveBeenCalled();
  });

  test('initializes when emulator configured', async () => {
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
    const fakeDb = {};
    admin.firestore.mockReturnValue(fakeDb);
    const mod = await import('../../firebase.js');
    const db = mod.getFirestore();
    expect(admin.initializeApp).toHaveBeenCalledWith({});
    expect(db).toBe(fakeDb);
  });
});
