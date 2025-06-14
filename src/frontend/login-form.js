import { LitElement, html, css } from 'lit';
import { surfaceStyles } from '../shared/theme-utils.js';

function base64urlToUint8Array(base64url) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const paddingLength = (4 - base64.length % 4) % 4;
  const padded = base64 + '='.repeat(paddingLength);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
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
    return {
      id: cred.id,
      rawId: credToJSON(cred.rawId),
      response: {
        clientDataJSON: credToJSON(cred.response.clientDataJSON),
        attestationObject: cred.response.attestationObject ? credToJSON(cred.response.attestationObject) : undefined,
        authenticatorData: cred.response.authenticatorData ? credToJSON(cred.response.authenticatorData) : undefined,
        signature: cred.response.signature ? credToJSON(cred.response.signature) : undefined,
        userHandle: cred.response.userHandle ? credToJSON(cred.response.userHandle) : undefined,
      },
      type: cred.type,
    };
  } else if (cred && cred.constructor && cred.constructor.name === 'AuthenticatorAttestationResponse') {
    return {
      clientDataJSON: credToJSON(cred.clientDataJSON),
      attestationObject: credToJSON(cred.attestationObject),
    };
  } else if (cred && cred.constructor && cred.constructor.name === 'AuthenticatorAssertionResponse') {
    return {
      clientDataJSON: credToJSON(cred.clientDataJSON),
      authenticatorData: credToJSON(cred.authenticatorData),
      signature: credToJSON(cred.signature),
      userHandle: cred.userHandle ? credToJSON(cred.userHandle) : undefined,
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

export class LoginForm extends LitElement {
  static properties = {
    name: { state: true },
    error: { state: true },
  };

  constructor() {
    super();
    this.name = localStorage.getItem('stageName') || '';
    this.error = '';
  }

  _onInput(e) {
    this.name = e.target.value;
  }

  async _confirm() {
    this.error = '';
    if (!this.name.trim()) {
      this.error = 'Please enter a Stage Name';
      return;
    }
    localStorage.setItem('stageName', this.name.trim());
    try {
      const optsRaw = await fetch('/auth/register/options').then((r) => r.json());
      const opts = decodeOpts(optsRaw);
      const cred = await navigator.credentials.create({ publicKey: opts });
      const res = await fetch('/auth/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credToJSON(cred)),
      }).then((r) => r.json());
      if (!res.verified) {
        throw new Error('Registration failed');
      }
      this.dispatchEvent(
        new CustomEvent('login', { detail: { name: this.name.trim() }, bubbles: true, composed: true }),
      );
    } catch (err) {
      this.error = err.message;
    }
  }

  render() {
    return html`
      <div class="container">
        <h2>Welcome to Karaoke MN</h2>
        <form @submit=${(e) => { e.preventDefault(); this._confirm(); }}>
          <label for="stage">Stage Name</label>
          <input id="stage" .value=${this.name} @input=${this._onInput} placeholder="Stage Name" autofocus />
          <button type="submit">Confirm</button>
        </form>
        ${this.error ? html`<p class="error" aria-live="polite">${this.error}</p>` : ''}
      </div>
    `;
  }

  static styles = [
    surfaceStyles,
    css`
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: var(--bg-color);
        color: var(--text-color);
        padding: var(--spacing-md);
        box-sizing: border-box;
      }
      .container {
        background: var(--surface-color);
        padding: var(--spacing-lg);
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        text-align: center;
      }
      input {
        padding: var(--spacing-sm);
        margin-top: var(--spacing-sm);
        border-radius: 4px;
        border: 1px solid var(--surface-color);
        width: 100%;
        box-sizing: border-box;
      }
      button {
        margin-top: var(--spacing-md);
      }
      .error {
        color: #ff5252;
        margin-top: var(--spacing-sm);
      }

      @media (orientation: landscape) and (max-width: var(--breakpoint-phone)) {
        .container {
          width: 100%;
          border-radius: 0;
        }
      }
    `,
  ];
}

customElements.define('login-form', LoginForm);
