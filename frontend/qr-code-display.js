import { LitElement, html } from 'lit';
import QRCode from 'qrcode';

export class QRCodeDisplay extends LitElement {
  static properties = {
    text: { type: String },
    dataUrl: { state: true },
  };

  constructor() {
    super();
    this.text = '';
    this.dataUrl = '';
  }

  updated(changed) {
    if (changed.has('text')) {
      QRCode.toDataURL(this.text || '')
        .then((url) => {
          this.dataUrl = url;
        })
        .catch(() => {
          this.dataUrl = '';
        });
    }
  }

  render() {
    return this.dataUrl ? html`<img src="${this.dataUrl}" alt="QR" />` : '';
  }
}

customElements.define('qr-code-display', QRCodeDisplay);
