import { LitElement, html, css } from 'lit';

export class GuestQueueView extends LitElement {
  static properties = {
    singer: { type: String },
    queue: { state: true },
  };

  constructor() {
    super();
    this.singer = '';
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
    const res = await fetch('/queue');
    const data = await res.json();
    this.queue = Array.isArray(data.queue) ? data.queue.filter((q) => q.singer === this.singer) : [];
  }

  static styles = css`
    ul {
      list-style: none;
      padding: 0;
    }
  `;

  render() {
    return html`
      <h3>Your Songs</h3>
      <ul aria-label="Your queued songs">
        ${this.queue.length === 0
          ? html`<li>No queued songs</li>`
          : this.queue.map((q) => html`<li>Song ID: ${q.videoId}</li>`)}
      </ul>
    `;
  }
}

customElements.define('guest-queue-view', GuestQueueView);
