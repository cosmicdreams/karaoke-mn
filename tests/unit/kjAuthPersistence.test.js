import { describe, test, expect, vi } from 'vitest';
vi.mock('@simplewebauthn/server', () => ({
  generateRegistrationOptions: vi.fn(() => ({ challenge: 'reg' })),
  verifyRegistrationResponse: vi.fn(() => Promise.resolve({
    verified: true,
    registrationInfo: {
      credential: {
        id: 'aWQ',
        publicKey: 'pk',
        counter: 0,
      },
    },
  })),
  generateAuthenticationOptions: vi.fn(({ allowCredentials }) => ({ challenge: 'auth', allowCredentials })),
  verifyAuthenticationResponse: vi.fn(() => Promise.resolve({ verified: true, authenticationInfo: { newCounter: 1 } })),
}));

function createDb() {
  const store = {};
  return {
    collection: () => ({
      doc: (id) => ({
        async get() { return { exists: !!store[id], data: () => store[id] }; },
        async set(data) { store[id] = data; },
      }),
    }),
  };
}

describe('passkey persistence', () => {
  test('devices saved to firestore are loaded on init', async () => {
    const db = createDb();
    let mod = await import('../../kjAuth.js');
    await mod.initAuth(db);
    await mod.verifyRegistration({ rawId: 'cred' });

    // simulate server restart
    vi.resetModules();
    mod = await import('../../kjAuth.js');
    await mod.initAuth(db);
    const opts = await mod.generateAuth();
    expect(opts.allowCredentials.length).toBeGreaterThan(0);
  });
});
