import { LitElement, html, css } from 'lit';

export class GuestSongbook extends LitElement {
  static properties = {
    singer: { type: String },
    songs: { state: true },
  };

  constructor() {
    super();
    this.singer = '';
    this.songs = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  _storageKey() {
    return `karaoke-mn-book-${this.singer}`;
  }

  _load() {
    const stored = localStorage.getItem(this._storageKey());
    this.songs = stored ? JSON.parse(stored) : [];
  }

  _save() {
    localStorage.setItem(this._storageKey(), JSON.stringify(this.songs));
  }

  addSong(song) {
    if (!song || !song.videoId) return;
    if (this.songs.find((s) => s.videoId === song.videoId)) return;
    this.songs = [...this.songs, song];
    this._save();
  }

  _remove(e) {
    const id = e.target.dataset.id;
    this.songs = this.songs.filter((s) => s.videoId !== id);
    this._save();
  }

  static styles = css`
    :host {
      display: block;
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
    button {
      margin-left: 0.5rem;
    }
  `;

  render() {
    return html`
      <h3>Your Songbook</h3>
      <ul>
        ${this.songs.map(
          (song) =>
            html`<li>
              <span>${song.title}</span>
              <button data-id=${song.videoId} @click=${this._remove}>
                Remove
              </button>
            </li>`,
        )}
      </ul>
    `;
  }
}

customElements.define('guest-songbook', GuestSongbook);
