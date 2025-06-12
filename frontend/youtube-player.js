/* global YT */
import { LitElement, html, css } from 'lit';

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
        height: '100%',
        width: '100%',
        videoId: this.videoId,
      });
    };
  }

  updated(changed) {
    if (changed.has('videoId') && this.player) {
      this.player.loadVideoById(this.videoId);
    }
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    #player {
      width: 100%;
      aspect-ratio: 16 / 9;
    }
    #player iframe {
      width: 100%;
      height: 100%;
    }
  `;

  render() {
    return html` <div id="player"></div> `;
  }
}

customElements.define('youtube-player', YouTubePlayer);
