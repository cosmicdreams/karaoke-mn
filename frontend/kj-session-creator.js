import { LitElement, html } from 'lit';

export class KJSessionCreator extends LitElement {
  static properties = {
    session: { state: true },
  };

  constructor() {
    super();
    this.session = null;
  }

  async _create() {
    const res = await fetch('/sessions', { method: 'POST' }).then((r) =>
      r.json(),
    );
    this.session = res;
    this.dispatchEvent(
      new CustomEvent('session-created', {
        detail: res,
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <div>
        ${this.session
          ? html`
              <p>Room Code: ${this.session.code}</p>
              <img src="${this.session.qrCode}" alt="QR Code" />
            `
          : html`<button @click=${this._create}>Start Session</button>`}
      </div>
    `;
  }
}

customElements.define('kj-session-creator', KJSessionCreator);
