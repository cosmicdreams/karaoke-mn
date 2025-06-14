import { LitElement, html, css } from 'lit';
import './popover-queue.js';
import './search-bar-with-status.js';
import './search-results-list.js';
import './video-preview-modal.js';
import './toast-notification.js';

export class GuestSongSearch extends LitElement {
  static properties = {
    results: { state: true },
    singer: { type: String },
    preview: { state: true },
  };

  constructor() {
    super();
    this.results = [];
    this.singer = '';
    this.preview = null;
  }

  _handleResults(e) {
    this.results = Array.isArray(e.detail) ? e.detail : [];
  }

  async _addSong(e) {
    const { videoId, title } = e.detail;
    if (!videoId || !this.singer) return;
    try {
      const res = await fetch('/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, singer: this.singer }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      this._showToast(`Added to queue: ${title}`);
    } catch (err) {
      this._showToast(`Failed to add song: ${err.message}`);
    }
  }

  async _previewSong(e) {
    const { videoId } = e.detail;
    if (!videoId) return;
    try {
      const res = await fetch(
        `/preview?videoId=${encodeURIComponent(videoId)}`,
      );
      if (res.ok) {
        const info = await res.json();
        this.preview = info;
      }
    } catch (err) {
      console.error(err);
    }
  }

  _saveSong(e) {
    this.dispatchEvent(
      new CustomEvent('save-song', {
        detail: e.detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  static styles = css`
    :host {
      display: block;
    }
  `;

  _showToast(msg) {
    this.renderRoot.getElementById('search-toast')?.show(msg);
  }

  render() {
    return html`
      <div class="controls">
        <popover-queue .singer=${this.singer}></popover-queue>
      </div>
      <search-bar-with-status
        @results=${this._handleResults}
      ></search-bar-with-status>
      <search-results-list
        .results=${this.results}
        @add-song=${this._addSong}
        @save-song=${this._saveSong}
        @preview-song=${this._previewSong}
      ></search-results-list>
      <video-preview-modal
        .videoId=${this.preview?.videoId || ''}
        .title=${this.preview?.title || ''}
        .open=${!!this.preview}
        @click=${() => (this.preview = null)}
      ></video-preview-modal>
      <toast-notification id="search-toast"></toast-notification>
    `;
  }
}

customElements.define('guest-song-search', GuestSongSearch);
