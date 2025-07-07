import { LitElement, html, css } from 'lit';
import './qr-code-display.js';

export class SessionInfoDisplay extends LitElement {
  static properties = {
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
        <p>Join: <a href="${this.joinUrl}" target="_blank" rel="noopener">${this.joinUrl}</a></p>
        ${this.qrCode && this.qrCode.startsWith('data:image')
          ? html`<img src="${this.qrCode}" alt="QR Code to join karaoke" />`
          : ''}
      </div>
    `;
  }
}

customElements.define('session-info-display', SessionInfoDisplay);
