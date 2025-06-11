import { LitElement, html } from 'lit';
import './youtube-player.js';

export class InterstitialPlayer extends LitElement {
  static properties = {
    videoId: { type: String },
    playing: { type: Boolean },
  };

  constructor() {
    super();
    this.videoId = '';
    this.playing = false;
  }

  play(id) {
    this.videoId = id;
    this.playing = true;
  }

  stop() {
    this.playing = false;
  }

  render() {
    return this.playing
      ? html`<youtube-player .videoId=${this.videoId}></youtube-player>`
      : html``;
  }
}

customElements.define('interstitial-player', InterstitialPlayer);
