import { LitElement, html, css } from 'lit';
import {
  spacingStyles,
  mobileLandscapeStyles,
  surfaceStyles,
} from '../shared/theme-utils.js';

export class GuestQueueView extends LitElement {
  static properties = {
    singer: { type: String },
    liveQueue: { state: true },
    userQueue: { state: true },
    currentView: { state: true },
    isKJ: { type: Boolean },
    showLaunchControls: { type: Boolean },
  };

  constructor() {
    super();
    this.singer = '';
    this.liveQueue = [];
    this.userQueue = [];
    this.currentView = 'queue';
    this.isKJ = false;
    this.showLaunchControls = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this._load();
    this._interval = setInterval(() => this._load(), 5000);
  }

  disconnectedCallback() {
    clearInterval(this._interval);
    super.disconnectedCallback();
  }

  async _load() {
    try {
      const res = await fetch('/queue');
      if (res.ok) {
        const data = await res.json();
        this.liveQueue = Array.isArray(data.queue) ? data.queue : [];
        
        // Filter user's personal queue
        this.userQueue = this.liveQueue.filter(q => 
          q.singer === this.singer && q.status === 'waiting'
        );
      }
    } catch (err) {
      console.error('Failed to load queue:', err);
    }
  }

  _navigateHome() {
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { view: 'home' },
      bubbles: true,
      composed: true
    }));
  }

  _launchYouTube(song, fullscreen = false) {
    if (!song?.videoId) return;
    
    const videoUrl = `https://www.youtube.com/watch?v=${song.videoId}`;
    const params = fullscreen ? '&autoplay=1&fs=1' : '&autoplay=1';
    const finalUrl = videoUrl + params;
    
    // Open in new window/tab
    const windowFeatures = fullscreen 
      ? 'fullscreen=yes,width=1920,height=1080,menubar=no,toolbar=no,location=no,status=no'
      : 'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no';
    
    const newWindow = window.open(finalUrl, '_blank', windowFeatures);
    
    // Request fullscreen if supported and desired
    if (fullscreen && newWindow) {
      // Note: Fullscreen API may not work across origins, but the window size helps
      setTimeout(() => {
        try {
          if (newWindow.document && newWindow.document.documentElement) {
            newWindow.document.documentElement.requestFullscreen?.();
          }
        } catch (e) {
          console.log('Fullscreen request failed (expected for cross-origin)');
        }
      }, 1000);
    }
  }

  async _markSongComplete(songId) {
    if (!this.isKJ) return;
    
    try {
      const res = await fetch(`/songs/${songId}/complete`, {
        method: 'POST',
      });
      
      if (res.ok) {
        // Reload queue to reflect changes
        this._load();
      }
    } catch (err) {
      console.error('Failed to mark song complete:', err);
    }
  }

  async _skipSong(songId) {
    if (!this.isKJ) return;
    
    try {
      const res = await fetch(`/songs/${songId}/skip`, {
        method: 'POST',
      });
      
      if (res.ok) {
        // Reload queue to reflect changes
        this._load();
      }
    } catch (err) {
      console.error('Failed to skip song:', err);
    }
  }

  async _startNextSong() {
    if (!this.isKJ) return;
    
    try {
      const res = await fetch('/queue/advance', {
        method: 'POST',
      });
      
      if (res.ok) {
        // Reload queue to reflect changes
        this._load();
      }
    } catch (err) {
      console.error('Failed to advance queue:', err);
    }
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

      /* Header */
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
        gap: var(--spacing-sm);
      }

      .back-btn {
        background: transparent;
        border: none;
        color: var(--text-color);
        padding: 0.25rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1.25rem;
      }

      .back-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .queue-title {
        font-size: 1.25rem;
        font-weight: bold;
        margin: 0;
      }

      /* Main Content */
      .main-content {
        max-width: 480px;
        margin: 0 auto;
        padding: var(--spacing-md);
      }

      .section {
        margin-bottom: var(--spacing-lg);
      }

      .section-title {
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0 0 var(--spacing-md) 0;
        color: var(--text-color);
      }

      /* Queue Item Styles */
      .queue-container {
        background: var(--surface-color);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        overflow: hidden;
      }

      .queue-item {
        padding: var(--spacing-md);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        position: relative;
      }

      .queue-item:last-child {
        border-bottom: none;
      }

      .queue-item.current {
        background: rgba(255, 64, 129, 0.1);
        border-left: 4px solid var(--accent-color);
      }

      .queue-item.upcoming {
        position: relative;
        padding-left: 3rem;
      }

      .queue-number {
        position: absolute;
        left: var(--spacing-md);
        top: var(--spacing-md);
        width: 24px;
        height: 24px;
        background: rgba(255, 255, 255, 0.2);
        color: var(--text-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: bold;
      }

      .song-info {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      }

      .song-details {
        flex: 1;
        min-width: 0;
      }

      .song-title {
        font-weight: 600;
        margin: 0 0 0.25rem 0;
        color: var(--text-color);
      }

      .song-meta {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
      }

      .current-indicator {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
        font-size: 0.75rem;
        color: var(--accent-color);
        font-weight: 500;
      }

      .live-dot {
        width: 8px;
        height: 8px;
        background: var(--accent-color);
        border-radius: 50%;
        animation: pulse 2s infinite;
      }

      .start-time {
        font-size: 0.75rem;
        color: var(--accent-color);
        margin-top: 0.25rem;
      }

      /* User Queue Styles */
      .user-queue-item {
        padding: var(--spacing-md);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: var(--surface-color);
        border-left: 4px solid rgba(255, 255, 255, 0.2);
      }

      .user-queue-item:last-child {
        border-bottom: none;
      }

      /* Divider */
      .divider {
        display: flex;
        align-items: center;
        margin: var(--spacing-lg) 0;
      }

      .divider-line {
        flex: 1;
        height: 1px;
        background: rgba(255, 255, 255, 0.2);
      }

      .divider-text {
        padding: 0 var(--spacing-md);
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.6);
        background: var(--bg-color);
      }

      /* Launch and Control Buttons */
      .song-actions {
        display: flex;
        gap: var(--spacing-sm);
        margin-top: var(--spacing-sm);
        flex-wrap: wrap;
      }

      .btn-launch {
        background: var(--accent-color);
        color: white;
        border: none;
        border-radius: 8px;
        padding: var(--spacing-sm) var(--spacing-md);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.2s ease;
        min-height: 36px;
      }

      .btn-launch:hover {
        background: color-mix(in srgb, var(--accent-color) 90%, white);
        transform: scale(1.02);
      }

      .btn-launch:focus {
        outline: 2px solid var(--accent-color);
        outline-offset: 2px;
      }

      .btn-launch.primary {
        background: var(--accent-color);
        box-shadow: 0 2px 8px rgba(255, 64, 129, 0.3);
      }

      .btn-launch.secondary {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-color);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .btn-launch.secondary:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .btn-kj {
        background: transparent;
        color: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 6px;
        padding: 0.375rem 0.75rem;
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-kj:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-color);
      }

      .btn-kj.danger {
        border-color: var(--error-color);
        color: var(--error-color);
      }

      .btn-kj.danger:hover {
        background: rgba(255, 82, 82, 0.1);
      }

      .btn-kj.success {
        border-color: #10b981;
        color: #10b981;
      }

      .btn-kj.success:hover {
        background: rgba(16, 185, 129, 0.1);
      }

      .kj-controls {
        margin-top: var(--spacing-sm);
        padding-top: var(--spacing-sm);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
      }

      .kj-controls-label {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.5);
        margin-bottom: var(--spacing-sm);
        display: block;
      }

      /* Empty State */
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

      .empty-title {
        font-size: 1.125rem;
        font-weight: 500;
        margin: 0 0 0.5rem 0;
      }

      .empty-description {
        margin: 0;
        font-size: 0.875rem;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      @media (max-width: var(--breakpoint-phone)) {
        .song-info {
          flex-direction: column;
        }
      }
    `,
  ];

  render() {
    const hasCurrentSong = !!this.currentSong;
    const hasUpcoming = this.upcomingSongs.length > 0;
    const hasUserQueue = this.userQueue.length > 0;

    return html`
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <button class="back-btn" @click=${this._navigateHome}>
            ←
          </button>
          <h1 class="queue-title">Live Queue</h1>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Current Song -->
        ${hasCurrentSong ? html`
          <div class="section">
            <h2 class="section-title">Now Playing</h2>
            <div class="queue-container">
              <div class="queue-item current">
                <div class="song-info">
                  <div class="song-details">
                    <h3 class="song-title">${this.currentSong.song?.title || 'Unknown Song'}</h3>
                    <p class="song-meta">
                      ${this.currentSong.song?.artist || 'Unknown Artist'} • ${this.currentSong.singer}
                    </p>
                    <div class="current-indicator">
                      <div class="live-dot"></div>
                      <span>NOW SINGING</span>
                    </div>
                    ${this.currentSong.startTime ? html`
                      <div class="start-time">Started at ${this.currentSong.startTime}</div>
                    ` : ''}
                    
                    <!-- Launch Controls -->
                    ${this.showLaunchControls ? html`
                      <div class="song-actions">
                        <button
                          class="btn-launch primary"
                          @click=${() => this._launchYouTube(this.currentSong.song, true)}
                          title="Launch in full screen"
                        >
                          🎬 Launch Full Screen
                        </button>
                        <button
                          class="btn-launch secondary"
                          @click=${() => this._launchYouTube(this.currentSong.song, false)}
                          title="Launch in window"
                        >
                          📺 Launch Window
                        </button>
                      </div>
                    ` : ''}

                    <!-- KJ Controls -->
                    ${this.isKJ ? html`
                      <div class="kj-controls">
                        <span class="kj-controls-label">KJ Controls:</span>
                        <button
                          class="btn-kj success"
                          @click=${() => this._markSongComplete(this.currentSong.id)}
                          title="Mark song as complete and advance queue"
                        >
                          ✓ Complete
                        </button>
                        <button
                          class="btn-kj danger"
                          @click=${() => this._skipSong(this.currentSong.id)}
                          title="Skip this song"
                        >
                          ⏭ Skip
                        </button>
                        <button
                          class="btn-kj"
                          @click=${() => this._startNextSong()}
                          title="Start next song"
                        >
                          ▶️ Next
                        </button>
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Upcoming Songs -->
        ${hasUpcoming ? html`
          <div class="section">
            <h2 class="section-title">Up Next</h2>
            <div class="queue-container">
              ${this.upcomingSongs.map((item, index) => html`
                <div class="queue-item upcoming">
                  <div class="queue-number">${index + 1}</div>
                  <div class="song-info">
                    <div class="song-details">
                      <h3 class="song-title">${item.song?.title || 'Unknown Song'}</h3>
                      <p class="song-meta">
                        ${item.song?.artist || 'Unknown Artist'} • ${item.singer}
                      </p>
                      
                      <!-- Preview Launch Controls -->
                      ${this.showLaunchControls ? html`
                        <div class="song-actions">
                          <button
                            class="btn-launch secondary"
                            @click=${() => this._launchYouTube(item.song, false)}
                            title="Preview in window"
                          >
                            👁️ Preview
                          </button>
                          <button
                            class="btn-launch secondary"
                            @click=${() => this._launchYouTube(item.song, true)}
                            title="Preview in full screen"
                          >
                            🎬 Full Preview
                          </button>
                        </div>
                      ` : ''}

                      <!-- KJ Controls for upcoming songs -->
                      ${this.isKJ ? html`
                        <div class="kj-controls">
                          <span class="kj-controls-label">KJ Controls:</span>
                          <button
                            class="btn-kj"
                            @click=${() => this._markSongComplete(item.id)}
                            title="Start this song now"
                          >
                            ▶️ Start Now
                          </button>
                          <button
                            class="btn-kj danger"
                            @click=${() => this._skipSong(item.id)}
                            title="Remove from queue"
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                </div>
              `)}
            </div>
          </div>
        ` : ''}

        <!-- Divider (only show if there are both live queue items and user queue items) -->
        ${(hasCurrentSong || hasUpcoming) && hasUserQueue ? html`
          <div class="divider">
            <div class="divider-line"></div>
            <div class="divider-text">Your upcoming songs</div>
            <div class="divider-line"></div>
          </div>
        ` : ''}

        <!-- User's Personal Queue -->
        ${hasUserQueue ? html`
          <div class="section">
            <h2 class="section-title">My Queue</h2>
            <div class="queue-container">
              ${this.userQueue.map(item => html`
                <div class="user-queue-item">
                  <div class="song-info">
                    <div class="song-details">
                      <h3 class="song-title">${item.song?.title || 'Unknown Song'}</h3>
                      <p class="song-meta">${item.song?.artist || 'Unknown Artist'}</p>
                    </div>
                  </div>
                </div>
              `)}
            </div>
          </div>
        ` : ''}

        <!-- Empty State -->
        ${!hasCurrentSong && !hasUpcoming && !hasUserQueue ? html`
          <div class="empty-state">
            <div class="empty-icon">🎵</div>
            <h3 class="empty-title">No songs in queue</h3>
            <p class="empty-description">
              The karaoke queue is empty. Add some songs to get the party started!
            </p>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('guest-queue-view', GuestQueueView);