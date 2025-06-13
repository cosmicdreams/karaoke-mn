import { LitElement, html, css } from 'lit';
import './youtube-player.js';
import './interstitial-player.js';
import './on-screen-announcement.js';
import './session-info-display.js';
import './watermark-link.js';

export class MainScreenView extends LitElement {
  static properties = {
    roomCode: { type: String },
    queue: { state: true },
    sessionCode: { state: true },
    qrCode: { state: true },
    preparedContent: { state: true },
  };

  constructor() {
    super();
    this.queue = [];
    this.sessionCode = '';
    this.qrCode = '';
    this.preparedContent = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._load();
    this._interval = setInterval(() => this._load(), 5000);
    this._resetHideTimer = () => {
      this.classList.remove('hide-controls');
      clearTimeout(this._hideTimer);
      this._hideTimer = setTimeout(() => this.classList.add('hide-controls'), 3000);
    };
    ['mousemove', 'keydown', 'touchstart'].forEach(evt => document.addEventListener(evt, this._resetHideTimer));
    this._resetHideTimer();
  }

  disconnectedCallback() {
    clearInterval(this._interval);
    ['mousemove', 'keydown', 'touchstart'].forEach(evt => document.removeEventListener(evt, this._resetHideTimer));
    clearTimeout(this._hideTimer);
    super.disconnectedCallback();
  }

  async _load() {
    const sessionUrl = this.roomCode
      ? `/sessions/${encodeURIComponent(this.roomCode)}`
      : '/sessions/current';
    const [queueRes, sessionRes] = await Promise.all([
      fetch('/queue'),
      fetch(sessionUrl),
    ]);
    const queueData = await queueRes.json();
    this.queue = queueData.queue || [];
    if (sessionRes.ok) {
      const s = await sessionRes.json();
      this.sessionCode = s.code;
      this.qrCode = s.qrCode;
      this.preparedContent = s.preparedContent || null;
    }
  }

  static styles = css`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      margin: 0;
      padding: 0.5rem;
      box-sizing: border-box;
      overflow: hidden;
    }

    .video-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .hide-controls session-info-display,
    .hide-controls watermark-link {
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
  `;

  render() {
    const current = this.queue[0];
    const joinUrl = `${window.location.origin}/?code=${this.sessionCode}`;
    return html`
      <div class="video-wrapper">
        <youtube-player .videoId=${current ? current.videoId : ''}></youtube-player>
        <session-info-display
          .code=${this.sessionCode}
          .qrCode=${this.qrCode}
          .joinUrl=${joinUrl}
        ></session-info-display>
        <watermark-link .link=${joinUrl}></watermark-link>
      </div>
      <interstitial-player id="interstitial"></interstitial-player>
      <on-screen-announcement id="announcement"></on-screen-announcement>
    `;
  }
}

customElements.define('main-screen-view', MainScreenView);
