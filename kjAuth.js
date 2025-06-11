import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

const rpID = process.env.RP_ID || 'localhost';
const origin = process.env.ORIGIN || `http://${rpID}:3000`;
const rpName = 'Karaoke MN';

const kjUser = {
  // Use a binary ID per simplewebauthn requirements
  id: Buffer.from('kj'),
  username: 'KJ',
  devices: [],
  currentChallenge: null,
};

function getUser() {
  return kjUser;
}

function b64UrlToBuffer(b64url) {
  const pad = '='.repeat((4 - (b64url.length % 4)) % 4);
  const base64 = (b64url + pad).replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64');
}

function getUserDevice(rawId) {
  const idBuffer = b64UrlToBuffer(rawId);
  return kjUser.devices.find((dev) => dev.credentialID.equals(idBuffer));
}

export async function generateRegistration() {
  const user = getUser();
  const opts = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: user.id,
    userName: user.username,
    attestationType: 'none',
    authenticatorSelection: { userVerification: 'preferred' },
    excludeCredentials: user.devices.map((d) => ({ id: d.credentialID, type: 'public-key' })),
  });
  user.currentChallenge = opts.challenge;
  return opts;
}

export async function verifyRegistration(credential) {
  const user = getUser();
  const verification = await verifyRegistrationResponse({
    credential,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
  });
  if (verification.verified && verification.registrationInfo) {
    const { credentialPublicKey, credentialID, counter } = verification.registrationInfo;
    user.devices.push({ credentialID, publicKey: credentialPublicKey, counter });
  }
  return verification.verified;
}

export async function generateAuth() {
  const user = getUser();
  const opts = await generateAuthenticationOptions({
    rpID,
    userVerification: 'preferred',
    allowCredentials: user.devices.map((d) => ({ id: d.credentialID, type: 'public-key' })),
  });
  user.currentChallenge = opts.challenge;
  return opts;
}

export async function verifyAuth(credential) {
  const user = getUser();
  const device = getUserDevice(credential.rawId);
  const verification = await verifyAuthenticationResponse({
    credential,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: device,
  });
  if (verification.verified && verification.authenticationInfo && device) {
    device.counter = verification.authenticationInfo.newCounter;
  }
  return verification.verified;
}
