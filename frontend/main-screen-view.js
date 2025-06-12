import { LitElement, html, css } from 'lit';
import './youtube-player.js';
import './main-queue-display.js';
import './interstitial-player.js';
import './on-screen-announcement.js';
import './session-info-display.js';
import './prepared-content-display.js';

export class MainScreenView extends LitElement {
  static properties = {
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
      this.preparedContent = s.preparedContent || null;
    }
  }

  static styles = css`
    :host {
      display: block;
      text-align: center;
      box-sizing: border-box;
      padding: 0.5rem;
    }

    .layout {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .side {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    @media (min-width: 600px) {
      .layout {
        flex-direction: row;
        align-items: flex-start;
      }
      .side {
        width: 35%;
        max-width: 400px;
      }
      youtube-player {
        flex: 1;
      }
    }
  `;

  render() {
    const current = this.queue[0];
    return html`
      <div class="layout">
        <youtube-player
          .videoId=${current ? current.videoId : ''}
        ></youtube-player>
        <div class="side">
          <session-info-display
            .code=${this.sessionCode}
            .qrCode=${this.qrCode}
          ></session-info-display>
          <main-queue-display
            .queue=${this.queue.slice(1, 6)}
          ></main-queue-display>
          <prepared-content-display
            .content=${this.preparedContent}
          ></prepared-content-display>
        </div>
      </div>
      <interstitial-player id="interstitial"></interstitial-player>
      <on-screen-announcement id="announcement"></on-screen-announcement>
    `;
  }
}

customElements.define('main-screen-view', MainScreenView);
