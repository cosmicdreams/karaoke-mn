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
  id: 'kj',
  username: 'KJ',
  devices: [],
  currentChallenge: null,
};

function getUser() {
  return kjUser;
}

function getUserDevice(rawId) {
  const idBuffer = Buffer.from(rawId, 'base64url');
  return kjUser.devices.find((dev) => dev.credentialID.equals(idBuffer));
}

export function generateRegistration() {
  const user = getUser();
  const opts = generateRegistrationOptions({
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

export function generateAuth() {
  const user = getUser();
  const opts = generateAuthenticationOptions({
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
