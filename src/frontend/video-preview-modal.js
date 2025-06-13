import { LitElement, html, css } from 'lit';
import './modal-dialog.js';
import './youtube-player.js';

export class VideoPreviewModal extends LitElement {
  static properties = {
    videoId: { type: String },
    title: { type: String },
    open: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.videoId = '';
    this.title = '';
    this.open = false;
  }

  _close() {
    this.open = false;
  }

  static styles = css`
    button {
      margin-top: 0.5rem;
    }
  `;

  render() {
    return html`
      <modal-dialog ?open=${this.open} @click=${this._close}>
        <h2>${this.title}</h2>
        <youtube-player .videoId=${this.videoId}></youtube-player>
        <button @click=${this._close}>Close</button>
      </modal-dialog>
    `;
  }
}

customElements.define('video-preview-modal', VideoPreviewModal);
