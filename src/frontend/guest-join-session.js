import { LitElement, html, css } from 'lit';
import './toast-notification.js';

export class GuestJoinSession extends LitElement {
  static properties = {
    code: { state: true },
    name: { state: true },
    message: { state: true },
  };

  constructor() {
    super();
    this.code = '';
    this.name = '';
    this.message = '';
  }

  connectedCallback() {
    super.connectedCallback();
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) this.code = code.toUpperCase();
  }

  _onCodeInput(e) {
    this.code = e.target.value.toUpperCase();
  }

  _onNameInput(e) {
    this.name = e.target.value;
  }

  _showToast(msg) {
    const toast = this.renderRoot?.getElementById('toast');
    if (toast) {
      toast.show(msg);
    }
  }

  async _join() {
    if (!this.code || !this.name) return;
    try {
      const key = 'karaoke-mn-id-' + this.code;
      const storedId = localStorage.getItem(key);
      const res = await fetch(
        '/sessions/' + encodeURIComponent(this.code) + '/join',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.name.trim(),
            deviceId: storedId || undefined,
          }),
        },
      );
      const data = await res.json();
        if (res.ok) {
          localStorage.setItem(key, data.deviceId);
          localStorage.setItem('karaoke-mn-deviceId', data.deviceId);
        this.message = `Joined session as ${this.name}`;
        this._showToast(this.message);
        this.dispatchEvent(
          new CustomEvent('session-joined', {
            detail: { ...data, code: this.code, name: this.name.trim() },
            bubbles: true,
            composed: true,
          }),
        );
      } else {
        this.message = data.error || 'Join failed';
        this._showToast(this.message);
      }
    } catch (err) {
      this.message = err.message;
      this._showToast(this.message);
    }
  }

  static styles = css`
    :host {
      display: block;
    }
    input {
      margin: 0.25rem;
      padding: 0.25rem;
    }
    button {
      margin: 0.25rem;
      padding: 0.5rem 1rem;
    }
    p {
      color: #f44336;
    }
  `;

  render() {
    return html`
      <form
        @submit=${(e) => {
          e.preventDefault();
          this._join();
        }}
      >
        <div>
          <label for="room-code">Room Code</label>
          <input
            id="room-code"
            placeholder="Room Code"
            .value=${this.code}
            @input=${this._onCodeInput}
            autocomplete="off"
            required
          />
        </div>
        <div>
          <label for="singer-name">Your Name</label>
          <input
            id="singer-name"
            placeholder="Your Name"
            .value=${this.name}
            @input=${this._onNameInput}
            autocomplete="off"
            required
            autofocus
          />
        </div>
        <button type="submit" aria-label="Join session">Join</button>
        ${this.message ? html`<p aria-live="polite">${this.message}</p>` : ''}
      </form>
      <toast-notification id="toast"></toast-notification>
    `;
  }
}

customElements.define('guest-join-session', GuestJoinSession);
