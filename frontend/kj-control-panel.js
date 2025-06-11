import { LitElement, html } from 'lit';

export class KJControlPanel extends LitElement {
  static properties = {
    queue: { state: true },
  };

  constructor() {
    super();
    this.queue = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadQueue();
  }

  async _loadQueue() {
    const res = await fetch('/queue').then((r) => r.json());
    this.queue = res.queue || [];
  }

  render() {
    return html`
      <h3>Queue</h3>
      <ul>
        ${this.queue.map(
          (item) => html`<li>${item.singer}: ${item.videoId}</li>`,
        )}
      </ul>
    `;
  }
}

customElements.define('kj-control-panel', KJControlPanel);
