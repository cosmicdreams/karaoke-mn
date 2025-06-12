import { LitElement, html } from 'lit';

function base64urlToUint8Array(base64url) {
  // Convert base64url to base64
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding if needed
  const paddingLength = (4 - base64.length % 4) % 4;
  const padded = base64 + '='.repeat(paddingLength);
  // Convert to Uint8Array
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}

function bufToB64(buf) {
  const bin = String.fromCharCode(...new Uint8Array(buf));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeOpts(opts) {
  if (!opts) return opts;
  const out = { ...opts };
  if (out.challenge) out.challenge = base64urlToUint8Array(out.challenge);
  if (out.user && out.user.id) out.user.id = base64urlToUint8Array(out.user.id);
  if (Array.isArray(out.allowCredentials)) {
    out.allowCredentials = out.allowCredentials.map((c) => ({
      ...c,
      id: base64urlToUint8Array(c.id),
    }));
  }
  if (Array.isArray(out.excludeCredentials)) {
    out.excludeCredentials = out.excludeCredentials.map((c) => ({
      ...c,
      id: base64urlToUint8Array(c.id),
    }));
  }
  return out;
}

function credToJSON(cred) {
  if (cred instanceof ArrayBuffer) {
    return bufToB64(cred);
  } else if (Array.isArray(cred)) {
    return cred.map(credToJSON);
  } else if (cred && cred.constructor && cred.constructor.name === 'PublicKeyCredential') {
    // Serialize PublicKeyCredential for both registration and authentication
    return {
      id: cred.id,
      rawId: credToJSON(cred.rawId),
      response: {
        clientDataJSON: credToJSON(cred.response.clientDataJSON),
        attestationObject: cred.response.attestationObject
          ? credToJSON(cred.response.attestationObject)
          : undefined,
        authenticatorData: cred.response.authenticatorData
          ? credToJSON(cred.response.authenticatorData)
          : undefined,
        signature: cred.response.signature
          ? credToJSON(cred.response.signature)
          : undefined,
        userHandle: cred.response.userHandle
          ? credToJSON(cred.response.userHandle)
          : undefined,
      },
      type: cred.type,
    };
  } else if (cred && cred.constructor && cred.constructor.name === 'AuthenticatorAttestationResponse') {
    // Handle AuthenticatorAttestationResponse specifically
    return {
      clientDataJSON: credToJSON(cred.clientDataJSON),
      attestationObject: credToJSON(cred.attestationObject)
    };
  } else if (cred && cred.constructor && cred.constructor.name === 'AuthenticatorAssertionResponse') {
    // Handle AuthenticatorAssertionResponse specifically
    return {
      clientDataJSON: credToJSON(cred.clientDataJSON),
      authenticatorData: credToJSON(cred.authenticatorData),
      signature: credToJSON(cred.signature),
      userHandle: cred.userHandle ? credToJSON(cred.userHandle) : undefined
    };
  } else if (cred && typeof cred === 'object') {
    const obj = {};
    for (const [k, v] of Object.entries(cred)) {
      obj[k] = credToJSON(v);
    }
    return obj;
  }
  return cred;
}

export class KJLogin extends LitElement {
  static properties = {
    loggedIn: { state: true },
  };

  constructor() {
    super();
    this.loggedIn = false;
  }

  async _register() {
    try {
      console.log('Starting registration...');
      const optsRaw = await fetch('/auth/register/options').then((r) =>
        r.json(),
      );
      console.log('Got registration options:', optsRaw);
      const opts = decodeOpts(optsRaw);
      console.log('Decoded options:', opts);
      const cred = await navigator.credentials.create({ publicKey: opts });
      console.log('Created credential:', cred);
      const credJSON = credToJSON(cred);
      console.log('Credential JSON:', credJSON);
      const res = await fetch('/auth/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credJSON),
      }).then((r) => r.json());
      console.log('Verification response:', res);
      if (res.verified) {
        console.log('Registration verified successfully');
        this.loggedIn = true;
        this.dispatchEvent(
          new CustomEvent('login', { bubbles: true, composed: true }),
        );
      } else {
        console.log('Registration verification failed');
        alert('Registration failed: ' + (res.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert(err.message);
    }
  }

  async _login() {
    try {
      const optsRaw = await fetch('/auth/login/options').then((r) => r.json());
      const opts = decodeOpts(optsRaw);
      const cred = await navigator.credentials.get({ publicKey: opts });
      console.log('Assertion response type:', cred.response?.constructor?.name);
      const res = await fetch('/auth/login/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credToJSON(cred)),
      }).then((r) => r.json());
      if (res.verified) {
        this.loggedIn = true;
        this.dispatchEvent(
          new CustomEvent('login', { bubbles: true, composed: true }),
        );
      } else {
        alert('Authentication failed');
      }
    } catch (err) {
      alert(err.message);
    }
  }

  render() {
    return html`
      ${this.loggedIn
        ? html`<p>Logged in as KJ</p>`
        : html`
            <button @click=${this._register}>Register Passkey</button>
            <button @click=${this._login}>Login with Passkey</button>
          `}
    `;
  }
}

customElements.define('kj-login', KJLogin);
