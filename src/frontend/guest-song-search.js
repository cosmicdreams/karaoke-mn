import { LitElement, html, css } from 'lit';
import {
  spacingStyles,
  mobileLandscapeStyles,
  surfaceStyles,
} from '../shared/theme-utils.js';
import './toast-notification.js';
import { parseVideoId } from '../shared/parseVideoId.js';
import { showToast } from '../shared/toast.js';

export class GuestSongSearch extends LitElement {
  static properties = {
    singer: { type: String },
    searchQuery: { state: true },
    searchStatus: { state: true },
    favorites: { state: true },
    queue: { state: true },
    currentView: { state: true },
    isLoggedIn: { state: true },
    liveQueue: { state: true },
    userQueue: { state: true },
    sungTonight: { state: true },
    searchResults: { state: true },
  };

  constructor() {
    super();
    this.singer = '';
    this.searchQuery = '';
    this.searchStatus = '';
    this.favorites = new Set();
    this.queue = [];
    this.currentView = 'home';
    this.isLoggedIn = !!localStorage.getItem('stageName');
    this.liveQueue = [];
    this.userQueue = [];
    this.sungTonight = [];
    this.searchResults = [];
    
    // Sample categories - in real app this would come from API
    this.categories = [
      { id: "80s", name: "80s Hits", icon: "🎸" },
      { id: "90s", name: "90s Classics", icon: "💿" },
      { id: "2000s", name: "2000s Pop", icon: "🎵" },
      { id: "current", name: "Current Hits", icon: "⭐" },
      { id: "party", name: "Party Anthems", icon: "🎉" },
      { id: "slow", name: "Slow Jams", icon: "💕" },
      { id: "rock", name: "Rock Ballads", icon: "🤘" },
      { id: "country", name: "Country Favorites", icon: "🤠" },
      { id: "hiphop", name: "Hip-Hop Bangers", icon: "🎤" }
    ];
  }

  async connectedCallback() {
    super.connectedCallback();
    await this._loadData();
    this._setupEventListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeEventListeners();
  }

  async _loadData() {
    try {
      // Load queue data
      const queueRes = await fetch('/queue');
      if (queueRes.ok) {
        const queueData = await queueRes.json();
        this.liveQueue = queueData.queue || [];
      }

      // Load user favorites if logged in
      if (this.isLoggedIn) {
        const deviceId = localStorage.getItem('karaoke-mn-deviceId');
        if (deviceId) {
          const favRes = await fetch(`/singers/${deviceId}`);
          if (favRes.ok) {
            const profile = await favRes.json();
            this.favorites = new Set((profile.favorites || []).map(f => f.videoId));
          }
        }
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  }

  _setupEventListeners() {
    window.addEventListener('popstate', this._onPopState.bind(this));
  }

  _removeEventListeners() {
    window.removeEventListener('popstate', this._onPopState.bind(this));
  }

  _onPopState(event) {
    if (event.state && event.state.view) {
      this.currentView = event.state.view;
    } else {
      this.currentView = 'home';
    }
  }

  async _handleSearch(e) {
    const query = e.target.value;
    this.searchQuery = query;

    if (!query.trim()) {
      this.searchResults = [];
      this.searchStatus = '';
      return;
    }

    this.searchStatus = 'Searching database...';
    
    try {
      const res = await fetch(`/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const results = await res.json();
        this.searchResults = results || [];
        const count = this.searchResults.length;
        this.searchStatus = `Found ${count} result${count !== 1 ? 's' : ''} • Search took 0.12s`;
      } else {
        throw new Error('Search failed');
      }
    } catch (err) {
      console.error('Search error:', err);
      this.searchStatus = 'Search failed';
      this.searchResults = [];
    }
  }

  _navigateTo(view) {
    this.currentView = view;
    window.history.pushState({ view }, '', view === 'home' ? '#' : `#${view}`);
  }

  _navigateToCategory(categoryId) {
    this._navigateTo(`category-${categoryId}`);
  }

  _getCurrentCategory() {
    if (this.currentView === 'home' || this.currentView === 'queue') return null;
    const categoryId = this.currentView.replace('category-', '');
    
    if (categoryId === 'favorites') {
      return { 
        id: 'favorites', 
        name: 'My Favorites', 
        icon: '❤️',
        songs: this.searchResults.filter(s => this.favorites.has(s.videoId))
      };
    }
    if (categoryId === 'sung') {
      return { 
        id: 'sung', 
        name: 'Sung Tonight', 
        icon: '🎭',
        songs: this.sungTonight
      };
    }
    return this.categories.find(cat => cat.id === categoryId);
  }

  async _toggleFavorite(song) {
    if (!this.isLoggedIn) return;

    const newFavorites = new Set(this.favorites);
    if (newFavorites.has(song.videoId)) {
      newFavorites.delete(song.videoId);
    } else {
      newFavorites.add(song.videoId);
    }
    this.favorites = newFavorites;

    // Save to backend
    try {
      const deviceId = localStorage.getItem('karaoke-mn-deviceId');
      if (deviceId) {
        await fetch(`/singers/${deviceId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            favorites: Array.from(this.favorites).map(id => ({ videoId: id }))
          }),
        });
      }
    } catch (err) {
      console.error('Failed to save favorite:', err);
    }
  }

  async _addToQueue(song) {
    // Check if user is authenticated
    const userId = localStorage.getItem('karaoke-mn-deviceId');
    const username = localStorage.getItem('karaoke-mn-username');
    
    if (!userId || !username) {
      showToast(this.renderRoot, 'Please login to add songs to the queue', 'search-toast');
      // Redirect to login page after a brief delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return;
    }
    
    // Use authenticated username as singer name
    if (!this.singer) {
      this.singer = username;
    }

    const vid = parseVideoId(song.videoId || song.id);
    if (!vid) return;

    try {
      const res = await fetch('/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          videoId: vid, 
          singer: this.singer,
          title: song.title,
          artist: song.artist
        }),
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Status ${res.status}`);
      }
      
      // Add to local queue for UI feedback
      this.queue = [...this.queue, song];
      
      showToast(this.renderRoot, `Added to queue: ${song.title}`, 'search-toast');
    } catch (err) {
      showToast(this.renderRoot, `Failed to add song: ${err.message}`, 'search-toast');
    }
  }

  _getMatchType(song, query) {
    const q = query.toLowerCase();
    if (song.title?.toLowerCase().includes(q)) return "Title";
    if (song.artist?.toLowerCase().includes(q)) return "Artist";
    return "Match";
  }

  _isInQueue(song) {
    return this.queue.find(q => q.videoId === song.videoId || q.id === song.id);
  }

  get currentSong() {
    return this.liveQueue.find(item => item.status === 'singing');
  }

  get upcomingSongs() {
    return this.liveQueue.filter(item => item.status === 'waiting').slice(0, 5);
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

      /* Header Styles */
      .header {
        background: var(--surface-color);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding: var(--spacing-md);
      }

      .header-content {
        max-width: 480px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .back-btn {
        background: transparent;
        border: none;
        color: var(--text-color);
        padding: 0.25rem;
        border-radius: 8px;
        cursor: pointer;
      }

      .back-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .app-title {
        font-size: 1.25rem;
        font-weight: bold;
        margin: 0;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .user-avatar {
        width: 40px;
        height: 40px;
        background: var(--accent-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
      }

      .login-btn {
        background: var(--accent-color);
        color: white;
        border: none;
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      /* Sticky Controls */
      .sticky-controls {
        position: sticky;
        top: 0;
        background: var(--surface-color);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 10;
        padding: var(--spacing-md);
      }

      .controls-content {
        max-width: 480px;
        margin: 0 auto;
      }

      /* Special Categories */
      .special-categories {
        display: flex;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-md);
      }

      .special-category {
        flex: 1;
        background: var(--accent-color);
        color: white;
        border: none;
        border-radius: 12px;
        padding: var(--spacing-sm);
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .special-category:hover {
        transform: scale(1.02);
      }

      .special-category-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .special-category-count {
        font-size: 0.75rem;
        opacity: 0.8;
      }

      /* Search Bar */
      .search-container {
        position: relative;
        margin-bottom: var(--spacing-sm);
      }

      .search-input {
        width: 100%;
        background: var(--bg-color);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) 3rem;
        color: var(--text-color);
        font-size: 1.125rem;
        box-sizing: border-box;
      }

      .search-input:focus {
        outline: 2px solid var(--accent-color);
        outline-offset: 2px;
        border-color: var(--accent-color);
      }

      .search-input::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      .search-icon {
        position: absolute;
        left: var(--spacing-md);
        top: 50%;
        transform: translateY(-50%);
        color: rgba(255, 255, 255, 0.5);
        width: 20px;
        height: 20px;
      }

      /* Status Bar */
      .status-bar {
        padding: var(--spacing-sm) var(--spacing-md);
        background: rgba(255, 64, 129, 0.1);
        border: 1px solid rgba(255, 64, 129, 0.3);
        border-radius: 8px;
        font-size: 0.875rem;
        color: var(--accent-color);
      }

      /* Main Content */
      .main-content {
        max-width: 480px;
        margin: 0 auto;
        padding: var(--spacing-md);
        padding-bottom: 120px;
      }

      /* Category Grid */
      .category-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-sm);
      }

      .category-card {
        background: var(--surface-color);
        border-radius: 12px;
        padding: var(--spacing-md);
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .category-card:hover {
        transform: scale(1.02);
        background: rgba(255, 255, 255, 0.05);
      }

      .category-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }

      .category-icon {
        font-size: 1.5rem;
      }

      .category-count {
        font-size: 0.875rem;
        opacity: 0.7;
      }

      .category-name {
        font-weight: 600;
        font-size: 0.875rem;
        margin: 0;
      }

      /* Song Cards */
      .song-card {
        background: var(--surface-color);
        border-radius: 12px;
        padding: var(--spacing-md);
        margin-bottom: var(--spacing-sm);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .song-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .song-header {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-md);
      }

      .song-info {
        flex: 1;
        min-width: 0;
      }

      .song-title {
        font-weight: 600;
        margin: 0 0 0.25rem 0;
        color: var(--text-color);
      }

      .song-artist {
        color: rgba(255, 255, 255, 0.7);
        margin: 0 0 0.5rem 0;
        font-size: 0.875rem;
      }

      .song-actions {
        display: flex;
        gap: var(--spacing-sm);
        align-items: center;
        justify-content: space-between;
      }

      .song-primary-action {
        display: flex;
        gap: var(--spacing-sm);
        align-items: center;
      }

      .btn-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      .btn-favorite {
        background: rgba(255, 82, 82, 0.1);
        color: var(--error-color);
      }

      .btn-favorite.active {
        background: var(--error-color);
        color: white;
      }

      .btn-add {
        background: rgba(255, 64, 129, 0.1);
        color: var(--accent-color);
      }

      .btn-add:disabled {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.3);
        cursor: not-allowed;
      }

      .btn-add-primary {
        background: var(--accent-color);
        color: white;
        border: none;
        border-radius: 8px;
        padding: var(--spacing-sm) var(--spacing-md);
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 120px;
        justify-content: center;
      }

      .btn-add-primary:hover {
        background: #e91e63;
        transform: scale(1.02);
      }

      .btn-add-primary:disabled {
        background: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.5);
        cursor: not-allowed;
        transform: none;
      }

      .btn-add-primary:disabled:hover {
        transform: none;
      }

      .match-type {
        display: inline-block;
        background: rgba(255, 64, 129, 0.2);
        color: var(--accent-color);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
      }

      /* Empty States */
      .empty-state {
        text-align: center;
        padding: var(--spacing-lg) * 2;
        color: rgba(255, 255, 255, 0.6);
      }

      .empty-icon {
        font-size: 3rem;
        margin-bottom: var(--spacing-md);
        opacity: 0.5;
      }

      /* Queue Footer */
      .queue-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--surface-color);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 100;
      }

      .queue-footer-content {
        max-width: 480px;
        margin: 0 auto;
      }

      .queue-btn {
        width: 100%;
        background: transparent;
        border: none;
        padding: var(--spacing-md);
        text-align: left;
        cursor: pointer;
        color: var(--text-color);
        transition: background-color 0.2s;
      }

      .queue-btn:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      .queue-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .queue-text {
        flex: 1;
        min-width: 0;
      }

      .queue-current {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        margin-bottom: 0.25rem;
      }

      .live-indicator {
        width: 8px;
        height: 8px;
        background: #10b981;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }

      .queue-next {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.7);
      }

      .queue-badge {
        width: 24px;
        height: 24px;
        background: rgba(255, 64, 129, 0.2);
        color: var(--accent-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: bold;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      @media (max-width: var(--breakpoint-phone)) {
        .song-content {
          flex-direction: column;
        }

        .song-actions {
          margin-top: var(--spacing-sm);
          justify-content: flex-end;
        }
      }
    `,
  ];

  render() {
    const currentCategory = this._getCurrentCategory();
    const showSearch = this.currentView !== 'queue';
    const showCategories = this.currentView === 'home' && !this.searchQuery.trim();
    const showResults = this.searchQuery.trim() && this.searchResults.length > 0;
    const showEmpty = this.searchQuery.trim() && this.searchResults.length === 0;

    return html`
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <div class="header-left">
            ${this.currentView !== 'home' ? html`
              <button class="back-btn" @click=${() => this._navigateTo('home')}>
                ←
              </button>
            ` : html`
              <div style="font-size: 1.5rem;">🎵</div>
            `}
            <h1 class="app-title">
              ${this.currentView === 'queue' ? 'Live Queue' : 
                currentCategory ? currentCategory.name : 'KaraokeQ'}
            </h1>
          </div>
          
          <div class="header-right">
            ${this.isLoggedIn ? html`
              <div class="user-avatar">👤</div>
            ` : html`
              <button class="login-btn" @click=${() => this.isLoggedIn = true}>
                🔐 Login
              </button>
            `}
          </div>
        </div>
      </div>

      <!-- Sticky Controls -->
      ${showSearch ? html`
        <div class="sticky-controls">
          <div class="controls-content">
            <!-- Special Categories -->
            ${this.currentView === 'home' ? html`
              <div class="special-categories">
                ${this.isLoggedIn && Array.from(this.favorites).length > 0 ? html`
                  <button class="special-category" @click=${() => this._navigateToCategory('favorites')}>
                    <div class="special-category-info">
                      <span>❤️</span>
                      <span>My Favorites</span>
                    </div>
                    <span class="special-category-count">${this.favorites.size}</span>
                  </button>
                ` : ''}
                ${this.sungTonight.length > 0 ? html`
                  <button class="special-category" @click=${() => this._navigateToCategory('sung')}>
                    <div class="special-category-info">
                      <span>🎭</span>
                      <span>Sung Tonight</span>
                    </div>
                    <span class="special-category-count">${this.sungTonight.length}</span>
                  </button>
                ` : ''}
              </div>
            ` : ''}

            <!-- Search Bar -->
            <div class="search-container">
              <div class="search-icon">🔍</div>
              <input
                type="text"
                class="search-input"
                placeholder="Search by song, artist, or lyrics..."
                .value=${this.searchQuery}
                @input=${this._handleSearch}
                aria-label="Search for karaoke songs"
                role="searchbox"
              />
            </div>

            <!-- Status Bar -->
            ${this.searchStatus ? html`
              <div class="status-bar">${this.searchStatus}</div>
            ` : ''}
          </div>
        </div>
      ` : ''}

      <!-- Main Content -->
      <div class="main-content">
        <!-- Category Grid -->
        ${showCategories ? html`
          <div class="category-grid">
            ${this.categories.map(category => html`
              <div class="category-card" @click=${() => this._navigateToCategory(category.id)}>
                <div class="category-header">
                  <span class="category-icon">${category.icon}</span>
                  <span class="category-count">0</span>
                </div>
                <h3 class="category-name">${category.name}</h3>
              </div>
            `)}
          </div>
        ` : ''}

        <!-- Search Results -->
        ${showResults ? html`
          <div>
            <h2 style="margin-bottom: var(--spacing-md); font-size: 1.125rem; font-weight: 600;">
              Search Results
            </h2>
            ${this.searchResults.map(song => html`
              <div class="song-card">
                <div class="song-content">
                  <div class="song-header">
                    <div class="song-info">
                      <h3 class="song-title">${song.title}</h3>
                      <p class="song-artist">${song.artist}</p>
                      ${this.searchQuery ? html`
                        <span class="match-type">${this._getMatchType(song, this.searchQuery)} match</span>
                      ` : ''}
                    </div>
                    ${this.isLoggedIn ? html`
                      <button 
                        class="btn-icon btn-favorite ${this.favorites.has(song.videoId) ? 'active' : ''}"
                        @click=${() => this._toggleFavorite(song)}
                        title="Add to favorites"
                      >
                        ❤️
                      </button>
                    ` : ''}
                  </div>
                  <div class="song-actions">
                    <div class="song-primary-action">
                      <button
                        class="btn-add-primary"
                        @click=${() => this._addToQueue(song)}
                        ?disabled=${this._isInQueue(song)}
                      >
                        ${this._isInQueue(song) ? html`
                          <span>✓</span>
                          <span>Added to Queue</span>
                        ` : html`
                          <span>🎵</span>
                          <span>Add to Queue</span>
                        `}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `)}
          </div>
        ` : ''}

        <!-- Empty State -->
        ${showEmpty ? html`
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>No songs found</h3>
            <p>Try searching with different keywords</p>
          </div>
        ` : ''}
      </div>

      <!-- Queue Footer -->
      <div class="queue-footer">
        <div class="queue-footer-content">
          <button class="queue-btn" @click=${() => this._navigateTo('queue')}>
            <div class="queue-info">
              <div class="queue-text">
                ${this.currentSong ? html`
                  <div class="queue-current">
                    <div class="live-indicator"></div>
                    <span>Now: ${this.currentSong.song?.title} • ${this.currentSong.singer}</span>
                  </div>
                  ${this.upcomingSongs.length > 0 ? html`
                    <div class="queue-next">
                      Next: ${this.upcomingSongs[0].song?.title} • ${this.upcomingSongs[0].singer}
                      ${this.upcomingSongs.length > 1 ? ` (+${this.upcomingSongs.length - 1} more)` : ''}
                    </div>
                  ` : ''}
                ` : html`
                  <div class="queue-current">
                    <span style="opacity: 0.7;">🎵 Tap to view queue • No songs playing</span>
                  </div>
                `}
              </div>
              <div class="queue-badge">${this.liveQueue.length}</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Queue Added Indicator -->
      ${this.queue.length > 0 && this.currentView !== 'queue' ? html`
        <div style="position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: #10b981; color: white; padding: 0.5rem 1rem; border-radius: 9999px; z-index: 50;">
          ${this.queue.length} song${this.queue.length !== 1 ? 's' : ''} added to your queue
        </div>
      ` : ''}

      <toast-notification id="search-toast"></toast-notification>
    `;
  }
}

customElements.define('guest-song-search', GuestSongSearch);