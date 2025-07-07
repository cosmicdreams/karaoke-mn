import { LitElement, html, css } from 'lit';
import {
  spacingStyles,
  mobileLandscapeStyles,
  surfaceStyles,
} from '../shared/theme-utils.js';
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
    sortBy: { state: true },
    isEditingName: { state: true },
    searchQuery: { state: true },
    lastSaved: { state: true },
  };

  constructor() {
    super();
    this.theme = localStorage.getItem('theme') || 'dark';
    this.stageName = localStorage.getItem('stageName') || '';
    this.favorites = [];
    this.results = [];
    this.viewMode = 'list';
    this.status = '';
    this.sortBy = 'title';
    this.isEditingName = false;
    this.searchQuery = '';
    this.lastSaved = new Date();
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
    this.lastSaved = new Date();
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

  _startEditName() {
    this.isEditingName = true;
  }

  _saveNameEdit() {
    this.isEditingName = false;
    this._saveProfile();
  }

  _onSearchInput(e) {
    this.searchQuery = e.target.value;
  }

  _formatLastSaved(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  }

  _getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  get filteredFavorites() {
    if (!this.searchQuery.trim()) return this.favorites;
    
    const query = this.searchQuery.toLowerCase();
    return this.favorites.filter(song => 
      (song.title || '').toLowerCase().includes(query) ||
      (song.artist || '').toLowerCase().includes(query)
    );
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

  static styles = [
    spacingStyles,
    mobileLandscapeStyles,
    surfaceStyles,
    css`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--bg-color);
        color: var(--text-color);
      }

      .header {
        background: var(--surface-color);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding: var(--spacing-lg);
      }

      .header-content {
        max-width: 800px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: var(--spacing-lg);
      }

      .avatar {
        width: 80px;
        height: 80px;
        background: var(--accent-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        position: relative;
      }

      .name-section {
        flex: 1;
      }

      .name-edit {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .name-edit input {
        background: var(--surface-color);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: var(--spacing-sm) var(--spacing-md);
        color: var(--text-color);
        font-size: 1.25rem;
        font-weight: bold;
        flex: 1;
      }

      .name-edit input:focus {
        outline: 2px solid var(--accent-color);
        outline-offset: 2px;
      }

      .name-display {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .name-title {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0;
      }

      .last-saved {
        font-size: 0.875rem;
        color: var(--accent-color);
        margin-top: 0.25rem;
      }

      .main-content {
        max-width: 800px;
        margin: 0 auto;
        padding: var(--spacing-lg);
      }

      .search-section {
        margin-bottom: var(--spacing-lg);
      }

      .search-input {
        width: 100%;
        background: var(--surface-color);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: var(--spacing-md);
        color: var(--text-color);
        font-size: 1rem;
        box-sizing: border-box;
      }

      .search-input:focus {
        outline: 2px solid var(--accent-color);
        outline-offset: 2px;
      }

      .search-input::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      .favorites-container {
        background: var(--surface-color);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        overflow: hidden;
      }

      .favorites-header {
        padding: var(--spacing-lg);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .favorites-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0;
      }

      .favorites-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .favorite-item {
        padding: var(--spacing-lg);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-md);
      }

      .favorite-item:last-child {
        border-bottom: none;
      }

      .music-icon {
        width: 40px;
        height: 40px;
        background: rgba(255, 64, 129, 0.2);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--accent-color);
        flex-shrink: 0;
      }

      .song-info {
        flex: 1;
        min-width: 0;
      }

      .song-title {
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0 0 0.25rem 0;
        color: var(--text-color);
      }

      .song-artist {
        color: rgba(255, 255, 255, 0.7);
        margin: 0 0 0.5rem 0;
      }

      .song-actions {
        display: flex;
        gap: var(--spacing-sm);
        align-items: center;
      }

      .btn-primary {
        background: var(--accent-color);
        color: white;
        border: none;
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        min-height: 44px;
        transition: background-color 0.2s;
      }

      .btn-primary:hover {
        background: color-mix(in srgb, var(--accent-color) 90%, white);
      }

      .btn-primary:focus {
        outline: 2px solid var(--accent-color);
        outline-offset: 2px;
      }

      .btn-secondary {
        background: transparent;
        color: var(--error-color);
        border: 1px solid var(--error-color);
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        min-height: 44px;
        transition: background-color 0.2s;
      }

      .btn-secondary:hover {
        background: rgba(255, 82, 82, 0.1);
      }

      .btn-secondary:focus {
        outline: 2px solid var(--error-color);
        outline-offset: 2px;
      }

      .empty-state {
        padding: var(--spacing-lg) * 2;
        text-align: center;
        color: rgba(255, 255, 255, 0.6);
      }

      .empty-icon {
        width: 48px;
        height: 48px;
        margin: 0 auto var(--spacing-md);
        opacity: 0.5;
      }

      @media (max-width: var(--breakpoint-phone)) {
        .header-content {
          flex-direction: column;
          text-align: center;
          gap: var(--spacing-md);
        }

        .avatar {
          width: 60px;
          height: 60px;
          font-size: 1.25rem;
        }

        .favorite-item {
          flex-direction: column;
          align-items: stretch;
        }

        .song-actions {
          margin-top: var(--spacing-sm);
        }
      }

      @media (min-width: var(--breakpoint-tablet)) {
        .main-content,
        .header-content {
          max-width: 900px;
        }
      }
    `,
  ];

  render() {
    const sortedFavorites = [...this.filteredFavorites].sort((a, b) => {
      const av = (a[this.sortBy] || '').toLowerCase();
      const bv = (b[this.sortBy] || '').toLowerCase();
      return av.localeCompare(bv);
    });

    return html`
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <!-- Avatar -->
          <div class="avatar">
            ${this._getInitials(this.stageName || 'Guest')}
          </div>
          
          <!-- Name and Status -->
          <div class="name-section">
            ${this.isEditingName ? html`
              <div class="name-edit">
                <input
                  type="text"
                  .value=${this.stageName}
                  @input=${this._onStageInput}
                  @keydown=${(e) => e.key === 'Enter' && this._saveNameEdit()}
                  autofocus
                />
                <button class="btn-primary" @click=${this._saveNameEdit}>
                  ✓
                </button>
              </div>
            ` : html`
              <div class="name-display">
                <h1 class="name-title">${this.stageName || 'Guest'}</h1>
                <button class="btn-secondary" @click=${this._startEditName}>
                  ✏️ Edit
                </button>
              </div>
            `}
            
            <div class="last-saved">
              Last saved: ${this._formatLastSaved(this.lastSaved)}
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Search Section -->
        <div class="search-section">
          <input
            type="text"
            class="search-input"
            placeholder="Search your favorites..."
            .value=${this.searchQuery}
            @input=${this._onSearchInput}
          />
        </div>

        <!-- Favorites Section -->
        <div class="favorites-container">
          <div class="favorites-header">
            <h2 class="favorites-title">
              ❤️ My Favorites (${this.filteredFavorites.length})
            </h2>
            ${this.searchQuery ? html`
              <p style="margin: 0.5rem 0 0; font-size: 0.875rem; color: rgba(255,255,255,0.7)">
                Showing results for "${this.searchQuery}"
              </p>
            ` : ''}
          </div>

          <!-- Favorites List -->
          ${sortedFavorites.length > 0 ? html`
            <ul class="favorites-list">
              ${sortedFavorites.map(song => html`
                <li class="favorite-item">
                  <div class="music-icon">
                    🎵
                  </div>
                  
                  <div class="song-info">
                    <h3 class="song-title">${song.title || 'Unknown Title'}</h3>
                    <p class="song-artist">${song.artist || 'Unknown Artist'}</p>
                  </div>
                  
                  <div class="song-actions">
                    <button class="btn-primary">
                      Sing Now
                    </button>
                    <button 
                      class="btn-secondary"
                      data-id=${song.videoId} 
                      @click=${this._removeFavorite}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              `)}
            </ul>
          ` : html`
            <div class="empty-state">
              ${this.searchQuery ? html`
                <div class="empty-icon">🔍</div>
                <h3>No songs found</h3>
                <p>Try searching with different keywords</p>
                <button 
                  class="btn-primary" 
                  @click=${() => this.searchQuery = ''}
                >
                  Clear search
                </button>
              ` : html`
                <div class="empty-icon">⭐</div>
                <h3>No favorites yet</h3>
                <p>Start adding songs to your favorites to see them here</p>
              `}
            </div>
          `}
        </div>
      </div>
    `;
  }
}

customElements.define('settings-profile', SettingsProfile);
