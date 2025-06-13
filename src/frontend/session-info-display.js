import { LitElement, html, css } from 'lit';
import './qr-code-display.js';

export class SessionInfoDisplay extends LitElement {
  static properties = {
    code: { type: String },
    qrCode: { type: String },
    joinUrl: { type: String },
  };

  static styles = css`
    :host {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.9rem;
      line-height: 1.2;
    }
    p {
      margin: 0.2rem 0;
    }
    img {
      margin-top: 0.25rem;
      width: 4rem;
      height: 4rem;
    }
  `;

  render() {
    return html`
      <div>
        <p>Room Code: ${this.code}</p>
        <p>Join URL: <a href="${this.joinUrl}" target="_blank" rel="noopener">${this.joinUrl}</a></p>
        ${this.qrCode ? html`<img src="${this.qrCode}" alt="QR Code" />` : ''}
      </div>
    `;
  }
}

customElements.define('session-info-display', SessionInfoDisplay);
