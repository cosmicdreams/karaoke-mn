import { LitElement, html, css } from 'lit';
import './youtube-player.js';
import './main-queue-display.js';
import './interstitial-player.js';
import './on-screen-announcement.js';
import './session-info-display.js';

export class MainScreenView extends LitElement {
  static properties = {
    queue: { state: true },
    sessionCode: { state: true },
    qrCode: { state: true },
  };

  constructor() {
    super();
    this.queue = [];
    this.sessionCode = '';
    this.qrCode = '';
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
    const [queueRes, sessionRes] = await Promise.all([
      fetch('/queue'),
      fetch('/sessions/current'),
    ]);
    const queueData = await queueRes.json();
    this.queue = queueData.queue || [];
    if (sessionRes.ok) {
      const s = await sessionRes.json();
      this.sessionCode = s.code;
      this.qrCode = s.qrCode;
    }
  }

  static styles = css`
    :host {
      display: block;
      text-align: center;
    }
  `;

  render() {
    const current = this.queue[0];
    return html`
      <youtube-player
        .videoId=${current ? current.videoId : ''}
      ></youtube-player>
      <session-info-display
        .code=${this.sessionCode}
        .qrCode=${this.qrCode}
      ></session-info-display>
      <main-queue-display .queue=${this.queue.slice(1, 6)}></main-queue-display>
      <interstitial-player id="interstitial"></interstitial-player>
      <on-screen-announcement id="announcement"></on-screen-announcement>
    `;
  }
}

customElements.define('main-screen-view', MainScreenView);
