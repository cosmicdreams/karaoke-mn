import { LitElement, html } from 'lit';

function b64ToBuf(b64url) {
  const pad = '='.repeat((4 - (b64url.length % 4)) % 4);
  const base64 = (b64url + pad).replace(/-/g, '+').replace(/_/g, '/');
  const str = atob(base64);
  return Uint8Array.from(str, (c) => c.charCodeAt(0));
}

function bufToB64(buf) {
  const bin = String.fromCharCode(...new Uint8Array(buf));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeOpts(opts) {
  if (!opts) return opts;
  const out = { ...opts };
  if (out.challenge) out.challenge = b64ToBuf(out.challenge);
  if (out.user && out.user.id) out.user.id = b64ToBuf(out.user.id);
  if (Array.isArray(out.allowCredentials)) {
    out.allowCredentials = out.allowCredentials.map((c) => ({
      ...c,
      id: b64ToBuf(c.id),
    }));
  }
  if (Array.isArray(out.excludeCredentials)) {
    out.excludeCredentials = out.excludeCredentials.map((c) => ({
      ...c,
      id: b64ToBuf(c.id),
    }));
  }
  return out;
}

function credToJSON(cred) {
  if (cred instanceof ArrayBuffer) {
    return bufToB64(cred);
  } else if (Array.isArray(cred)) {
    return cred.map(credToJSON);
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
      const optsRaw = await fetch('/auth/register/options').then((r) =>
        r.json(),
      );
      const opts = decodeOpts(optsRaw);
      const cred = await navigator.credentials.create({ publicKey: opts });
      const res = await fetch('/auth/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credToJSON(cred)),
      }).then((r) => r.json());
      if (res.verified) {
        this.loggedIn = true;
        this.dispatchEvent(
          new CustomEvent('login', { bubbles: true, composed: true }),
        );
      }
    } catch (err) {
      alert(err.message);
    }
  }

  async _login() {
    try {
      const optsRaw = await fetch('/auth/login/options').then((r) => r.json());
      const opts = decodeOpts(optsRaw);
      const cred = await navigator.credentials.get({ publicKey: opts });
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
