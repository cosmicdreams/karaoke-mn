import { LitElement, html, css } from 'lit';
import {
  spacingStyles,
  mobileLandscapeStyles,
} from '../shared/theme-utils.js';
import './popover-queue.js';
import './search-bar-with-status.js';
import './search-results-list.js';
import './video-preview-modal.js';
import './toast-notification.js';
import { parseVideoId } from '../shared/parseVideoId.js';
import { showToast } from '../shared/toast.js';

export class GuestSongSearch extends LitElement {
  static properties = {
    results: { state: true },
    singer: { type: String },
    preview: { state: true },
    searched: { state: true },
  };

  constructor() {
    super();
    this.results = [];
    this.singer = '';
    this.preview = null;
    this.searched = false;
  }

  _handleResults(e) {
    this.results = Array.isArray(e.detail) ? e.detail : [];
    this.searched = true;
  }

  async _addSong(e) {
    const { videoId, url, title } = e.detail;
    const vid = parseVideoId(videoId || url);
    if (!vid || !this.singer) return;
    try {
      const res = await fetch('/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: vid, singer: this.singer }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Status ${res.status}`);
      }
      showToast(this.renderRoot, `Added to queue: ${title}`, 'search-toast');
    } catch (err) {
      showToast(this.renderRoot, `Failed to add song: ${err.message}`, 'search-toast');
    }
  }

  async _previewSong(e) {
    const { videoId, url } = e.detail;
    const vid = parseVideoId(videoId || url);
    if (!vid) return;
    try {
      const res = await fetch(
        `/preview?videoId=${encodeURIComponent(vid)}`,
      );
      if (res.ok) {
        const info = await res.json();
        this.preview = info;
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(this.renderRoot, err.error || 'Failed to load preview', 'search-toast');
      }
    } catch (err) {
      showToast(this.renderRoot, `Failed to load preview: ${err.message}`, 'search-toast');
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

  static styles = [
    spacingStyles,
    mobileLandscapeStyles,
    css`
      :host {
        display: block;
      }

      .controls {
        margin-bottom: var(--spacing-md);
      }

      @media (orientation: landscape) and (max-width: var(--breakpoint-phone)) {
        .controls {
          display: flex;
          justify-content: space-between;
        }
      }

      @media (min-width: var(--breakpoint-tv)) {
        :host {
          max-width: 1024px;
          margin: 0 auto;
        }
      }
    `,
  ];

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
        .searched=${this.searched}
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
