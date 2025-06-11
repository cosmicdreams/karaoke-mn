import { LitElement, html } from 'lit';
import './qr-code-display.js';

export class SessionInfoDisplay extends LitElement {
  static properties = {
    code: { type: String },
    qrCode: { type: String },
  };

  render() {
    return html`
      <div>
        <p>Room Code: ${this.code}</p>
        ${this.qrCode ? html`<img src="${this.qrCode}" alt="QR Code" />` : ''}
      </div>
    `;
  }
}

customElements.define('session-info-display', SessionInfoDisplay);
