import { LitElement, html, css } from 'lit';

export class KJCatalogManager extends LitElement {
  static properties = {
    videos: { state: true },
  };

  constructor() {
    super();
    this.videos = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  _key() {
    return 'kj-picks';
  }

  _load() {
    const stored = localStorage.getItem(this._key());
    this.videos = stored ? JSON.parse(stored) : [];
  }

  _save() {
    localStorage.setItem(this._key(), JSON.stringify(this.videos));
  }

  _addVideo() {
    const input = this.renderRoot?.getElementById('vid');
    const videoId = input.value.trim();
    if (!videoId) return;
    this.videos = [...this.videos, { videoId }];
    input.value = '';
    this._save();
  }

  _remove(e) {
    const idx = Number(e.target.dataset.index);
    this.videos = this.videos.filter((_, i) => i !== idx);
    this._save();
  }

  static styles = css`
    :host {
      display: block;
      margin-top: 1rem;
    }
    input {
      margin: 0.25rem;
      padding: 0.25rem;
    }
    button {
      margin: 0.25rem;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem 0;
    }
  `;

  render() {
    return html`
      <h3>KJ's Picks</h3>
      <input id="vid" placeholder="YouTube Video ID" />
      <button @click=${this._addVideo}>Add</button>
      <ul>
        ${this.videos.map(
          (v, i) =>
            html`<li>
              <span>${v.videoId}</span>
              <button data-index=${i} @click=${this._remove}>Remove</button>
            </li>`,
        )}
      </ul>
    `;
  }
}

customElements.define('kj-catalog-manager', KJCatalogManager);
