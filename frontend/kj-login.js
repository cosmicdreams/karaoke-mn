import { LitElement, html } from 'lit';

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
      const opts = await fetch('/auth/register/options').then((r) => r.json());
      const cred = await navigator.credentials.create({ publicKey: opts });
      const res = await fetch('/auth/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cred),
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
      const opts = await fetch('/auth/login/options').then((r) => r.json());
      const cred = await navigator.credentials.get({ publicKey: opts });
      const res = await fetch('/auth/login/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cred),
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
