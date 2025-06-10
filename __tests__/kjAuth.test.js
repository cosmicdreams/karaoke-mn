jest.mock('@simplewebauthn/server', () => ({
  generateRegistrationOptions: jest.fn(() => ({ challenge: 'reg-challenge' })),
  verifyRegistrationResponse: jest.fn(() => Promise.resolve({
    verified: true,
    registrationInfo: {
      credentialPublicKey: 'pk',
      credentialID: Buffer.from('dev'),
      counter: 0,
    },
  })),
  generateAuthenticationOptions: jest.fn(() => ({ challenge: 'auth-challenge' })),
  verifyAuthenticationResponse: jest.fn(() => Promise.resolve({
    verified: true,
    authenticationInfo: { newCounter: 1 },
  })),
}));

const server = require('@simplewebauthn/server');
const { generateRegistration, verifyRegistration, generateAuth, verifyAuth } = require('../kjAuth');

describe('kjAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('registration and auth flow', async () => {
    const regOpts = generateRegistration();
    await verifyRegistration({});

    expect(server.generateRegistrationOptions).toHaveBeenCalled();
    expect(server.verifyRegistrationResponse).toHaveBeenCalledWith(expect.objectContaining({
      expectedChallenge: regOpts.challenge,
    }));

    const authOpts = generateAuth();
    expect(server.generateAuthenticationOptions).toHaveBeenCalledWith(expect.objectContaining({
      allowCredentials: [expect.objectContaining({ id: expect.any(Buffer) })],
    }));
    const rawId = server.generateAuthenticationOptions.mock.calls[0][0].allowCredentials[0].id.toString('base64url');
    await verifyAuth({ rawId });

    expect(server.verifyAuthenticationResponse).toHaveBeenCalledWith(expect.objectContaining({
      expectedChallenge: authOpts.challenge,
      authenticator: expect.any(Object),
    }));
  });
});
