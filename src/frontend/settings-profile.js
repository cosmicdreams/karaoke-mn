import { LitElement, html, css } from 'lit';
import './search-bar-with-status.js';
import './search-results-list.js';
import './toggle-view-button.js';

export class SettingsProfile extends LitElement {
  static properties = {
    theme: { type: String },
    stageName: { type: String },
    favorites: { state: true },
    results: { state: true },
    viewMode: { state: true },
    status: { state: true },
  };

  constructor() {
    super();
    this.theme = localStorage.getItem('theme') || 'light';
    this.stageName = localStorage.getItem('stageName') || '';
    this.favorites = [];
    this.results = [];
    this.viewMode = 'list';
    this.status = '';
  }

  async connectedCallback() {
    super.connectedCallback();
    const deviceId = localStorage.getItem('karaoke-mn-deviceId');
    if (deviceId) {
      try {
        const res = await fetch(`/singers/${deviceId}`);
        if (res.ok) {
          const profile = await res.json();
          if (Array.isArray(profile.favorites)) {
            this.favorites = profile.favorites;
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
    document.body.setAttribute('data-theme', this.theme);
  }

  _onStageInput(e) {
    this.stageName = e.target.value;
  }

  async _saveProfile() {
    localStorage.setItem('stageName', this.stageName.trim());
    const deviceId = localStorage.getItem('karaoke-mn-deviceId');
    if (deviceId) {
      try {
        const res = await fetch(`/singers/${deviceId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favorites: this.favorites }),
        });
        if (res.ok) {
          this.status = 'saved';
        } else {
          this.status = 'error';
        }
      } catch (err) {
        this.status = 'error';
      }
    }
  }

  _onResults(e) {
    this.results = Array.isArray(e.detail) ? e.detail : [];
  }

  _onToggle(e) {
    this.viewMode = e.detail;
  }

  _addFavorite(e) {
    const song = e.detail;
    if (!song || !song.videoId) return;
    if (this.favorites.find((f) => f.videoId === song.videoId)) return;
    this.favorites = [...this.favorites, song];
    this._saveProfile();
  }

  _removeFavorite(e) {
    const id = e.target.dataset.id;
    this.favorites = this.favorites.filter((f) => f.videoId !== id);
    this._saveProfile();
  }

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
    }
    .badge {
      margin-left: 0.5rem;
      font-size: 0.9rem;
      color: var(--text-color);
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
      <h2>Settings / Profile</h2>
      <div>
        <label for="stage">Stage Name</label>
        <input id="stage" .value=${this.stageName} @input=${this._onStageInput} />
        <span class="badge" aria-live="polite">
          ${this.status === 'saved' ? 'Saved' : ''}
        </span>
      </div>
      <div>
        <label>Theme: ${this.theme}</label>
        <button @click=${this.toggleTheme}>Toggle Theme</button>
      </div>

      <h3>Add Favorites</h3>
      <toggle-view-button .mode=${this.viewMode} @toggle=${this._onToggle}></toggle-view-button>
      <search-bar-with-status @results=${this._onResults}></search-bar-with-status>
      <search-results-list
        .results=${this.results}
        .viewMode=${this.viewMode}
        @save-song=${this._addFavorite}
      ></search-results-list>

      <h3>Your Favorites</h3>
      <ul>
        ${this.favorites.map(
          (f) => html`<li>
            <span>${f.title}</span>
            <button data-id=${f.videoId} @click=${this._removeFavorite}>Remove</button>
          </li>`,
        )}
      </ul>
    `;
  }
}

customElements.define('settings-profile', SettingsProfile);
