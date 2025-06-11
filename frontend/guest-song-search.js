import { LitElement, html, css } from 'lit';
import './search-bar.js';
import './search-results-list.js';

export class GuestSongSearch extends LitElement {
  static properties = {
    results: { state: true },
    loading: { state: true },
    singer: { type: String },
  };

  constructor() {
    super();
    this.results = [];
    this.loading = false;
    this.singer = '';
  }

  async _onSearch(e) {
    const q = e.detail.value.trim();
    if (!q) return;
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

  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <search-bar @search=${this._onSearch}></search-bar>
      ${this.loading
        ? html`<p>Loading...</p>`
        : html`<search-results-list
            .results=${this.results}
            @add-song=${this._addSong}
          ></search-results-list>`}
    `;
  }
}

customElements.define('guest-song-search', GuestSongSearch);
