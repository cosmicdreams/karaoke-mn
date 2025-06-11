/* global YT */
import { LitElement, html } from 'lit';

export class YouTubePlayer extends LitElement {
  static properties = {
    videoId: { type: String },
  };

  constructor() {
    super();
    this.videoId = '';
  }

  firstUpdated() {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(script);
    window.onYouTubeIframeAPIReady = () => {
      this.player = new YT.Player(this.shadowRoot.getElementById('player'), {
        height: '390',
        width: '640',
        videoId: this.videoId,
      });
    };
  }

  updated(changed) {
    if (changed.has('videoId') && this.player) {
      this.player.loadVideoById(this.videoId);
    }
  }

  render() {
    return html` <div id="player"></div> `;
  }
}

customElements.define('youtube-player', YouTubePlayer);
