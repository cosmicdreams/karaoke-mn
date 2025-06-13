import { describe, test, beforeEach, expect, vi } from 'vitest';
vi.mock('@simplewebauthn/server', () => ({
  generateRegistrationOptions: vi.fn(() => ({ challenge: 'reg-challenge' })),
  verifyRegistrationResponse: vi.fn(() => Promise.resolve({
    verified: true,
    registrationInfo: {
      credential: {
        publicKey: 'pk',
        id: 'ZGV2',
        counter: 0,
      },
    },
  })),
  generateAuthenticationOptions: vi.fn(() => ({ challenge: 'auth-challenge' })),
  verifyAuthenticationResponse: vi.fn(() => Promise.resolve({
    verified: true,
    authenticationInfo: { newCounter: 1 },
  })),
}));

import * as server from '@simplewebauthn/server';
import { generateRegistration, verifyRegistration, generateAuth, verifyAuth } from '../kjAuth.js';

describe('kjAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('registration and auth flow', async () => {
    const regOpts = await generateRegistration();
    const regCred = { rawId: 'test' };
    await verifyRegistration(regCred);

    expect(server.generateRegistrationOptions).toHaveBeenCalled();
    expect(server.verifyRegistrationResponse).toHaveBeenCalledWith(expect.objectContaining({
      expectedChallenge: regOpts.challenge,
      response: regCred,
    }));

    const authOpts = await generateAuth();
    expect(server.generateAuthenticationOptions).toHaveBeenCalledWith(expect.objectContaining({
      allowCredentials: [expect.objectContaining({ id: expect.any(String) })],
    }));
    const rawId = server.generateAuthenticationOptions.mock.calls[0][0].allowCredentials[0].id;
    const authCred = { rawId };
    await verifyAuth(authCred);

    expect(server.verifyAuthenticationResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        expectedChallenge: authOpts.challenge,
        response: authCred,
        credential: expect.any(Object),
      }),
    );
  });
});
