import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { getFirestore } from './firebase.js';

const rpID = process.env.RP_ID || 'localhost';
const origin = process.env.ORIGIN || `http://${rpID}:3000`;
const rpName = 'Karaoke MN';

let db = null;

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

function bufferToB64Url(buf) {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function serializeDevice(dev) {
  return {
    credentialID: bufferToB64Url(dev.credentialID),
    publicKey:
      typeof dev.publicKey === 'string'
        ? dev.publicKey
        : bufferToB64Url(dev.publicKey),
    counter: dev.counter,
  };
}

function deserializeDevice(data) {
  return {
    credentialID: b64UrlToBuffer(data.credentialID),
    publicKey: data.publicKey,
    counter: data.counter,
  };
}

async function loadDevices() {
  if (!db) return;
  const doc = await db.collection('passkeyDevices').doc('kj').get();
  if (!doc.exists) return;
  const data = doc.data();
  if (data && Array.isArray(data.devices)) {
    kjUser.devices = data.devices.map(deserializeDevice);
  }
}

async function saveDevices() {
  if (!db) return;
  await db
    .collection('passkeyDevices')
    .doc('kj')
    .set({ devices: kjUser.devices.map(serializeDevice) });
}

export async function initAuth(firestore = getFirestore()) {
  db = firestore;
  await loadDevices();
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
    // Require user verification so registration succeeds in environments
    // where verification is expected during `verifyRegistration`
    authenticatorSelection: { userVerification: 'required' },
    excludeCredentials: user.devices.map((d) => ({ id: bufferToB64Url(d.credentialID), type: 'public-key' })),
  });
  user.currentChallenge = opts.challenge;
  return opts;
}

export async function verifyRegistration(credential) {
  const user = getUser();
  const verification = await verifyRegistrationResponse({
    response: credential,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
  });
  if (verification.verified && verification.registrationInfo) {
    console.log('registrationInfo:', JSON.stringify(verification.registrationInfo));
    const { credentialID, credentialPublicKey, counter, credential } = verification.registrationInfo;
    if (credential) {
      const { id, publicKey, counter: ctr } = credential;
      const credentialIDBuf = Buffer.isBuffer(id) ? id : b64UrlToBuffer(id);
      user.devices.push({
        credentialID: credentialIDBuf,
        publicKey,
        counter: ctr,
      });
    } else {
      const credentialIDBuf = Buffer.isBuffer(credentialID)
        ? credentialID
        : b64UrlToBuffer(credentialID);
      user.devices.push({
        credentialID: credentialIDBuf,
        publicKey: credentialPublicKey,
        counter,
      });
    }
    await saveDevices();
  }
  return verification.verified;
}

export async function generateAuth() {
  const user = getUser();
  console.log('devices before auth:', JSON.stringify(user.devices));
  const opts = await generateAuthenticationOptions({
    rpID,
    userVerification: 'preferred',
    allowCredentials: user.devices.map((d) => ({ id: bufferToB64Url(d.credentialID), type: 'public-key' })),
  });
  user.currentChallenge = opts.challenge;
  return opts;
}

export async function verifyAuth(credential) {
  const user = getUser();
  const device = getUserDevice(credential.rawId);
  console.log('auth device:', device);
  const verification = await verifyAuthenticationResponse({
    response: credential,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    credential: device,
  });
  if (verification.verified && verification.authenticationInfo && device) {
    device.counter = verification.authenticationInfo.newCounter;
    await saveDevices();
  }
  return verification.verified;
}
