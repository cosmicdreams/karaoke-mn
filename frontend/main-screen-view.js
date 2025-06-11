import { LitElement, html, css } from 'lit';
import './youtube-player.js';
import './main-queue-display.js';
import './interstitial-player.js';
import './on-screen-announcement.js';

export class MainScreenView extends LitElement {
  static properties = {
    queue: { state: true },
  };

  constructor() {
    super();
    this.queue = [];
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
    const queueRes = await fetch('/queue');
    const queueData = await queueRes.json();
    this.queue = queueData.queue || [];
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
      <main-queue-display .queue=${this.queue.slice(1, 6)}></main-queue-display>
      <interstitial-player id="interstitial"></interstitial-player>
      <on-screen-announcement id="announcement"></on-screen-announcement>
    `;
  }
}

customElements.define('main-screen-view', MainScreenView);
