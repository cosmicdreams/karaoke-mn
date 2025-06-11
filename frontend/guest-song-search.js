import { LitElement, html, css } from 'lit';
import './search-bar.js';
import './search-results-list.js';
import './loading-spinner.js';
import './video-preview-modal.js';

export class GuestSongSearch extends LitElement {
  static properties = {
    results: { state: true },
    loading: { state: true },
    singer: { type: String },
    preview: { state: true },
  };

  constructor() {
    super();
    this.results = [];
    this.loading = false;
    this.singer = '';
    this.preview = null;
  }

  async _onSearch(e) {
    const input = e.detail.value.trim();
    if (!input) return;
    const q = input.toLowerCase().includes('karaoke')
      ? input
      : `${input} karaoke`;
    this.loading = true;
    try {
      const res = await fetch('/search?q=' + encodeURIComponent(q));
      const data = await res.json();
      this.results = Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(err);
      this.results = [];
    } finally {
      this.loading = false;
    }
  }

  async _addSong(e) {
    const { videoId } = e.detail;
    if (!videoId || !this.singer) return;
    await fetch('/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, singer: this.singer }),
    });
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

  render() {
    return html`
      <search-bar @search=${this._onSearch}></search-bar>
      ${this.loading
        ? html`<loading-spinner></loading-spinner>`
        : html`<search-results-list
            .results=${this.results}
            @add-song=${this._addSong}
            @save-song=${this._saveSong}
            @preview-song=${this._previewSong}
          ></search-results-list>`}
      <video-preview-modal
        .videoId=${this.preview?.videoId || ''}
        .title=${this.preview?.title || ''}
        .open=${!!this.preview}
        @click=${() => (this.preview = null)}
      ></video-preview-modal>
    `;
  }
}

customElements.define('guest-song-search', GuestSongSearch);
