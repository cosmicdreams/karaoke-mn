import { LitElement, html, css } from 'lit';

export class KJControlPanel extends LitElement {
  static properties = {
    queue: { state: true },
    singer: { state: true },
    videoId: { state: true },
  };

  constructor() {
    super();
    this.queue = [];
    this.singer = '';
    this.videoId = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadQueue();
    this._interval = setInterval(() => this._loadQueue(), 5000);
  }

  disconnectedCallback() {
    clearInterval(this._interval);
    super.disconnectedCallback();
  }

  async _loadQueue() {
    const res = await fetch('/queue').then((r) => r.json());
    this.queue = res.queue || [];
  }

  async _addSong() {
    if (!this.singer || !this.videoId) return;
    await fetch('/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId: this.videoId, singer: this.singer }),
    });
    this.videoId = '';
    await this._loadQueue();
  }

  async _complete(id) {
    await fetch(`/songs/${id}/complete`, { method: 'POST' });
    await this._loadQueue();
  }

  async _skip(id) {
    await fetch(`/songs/${id}/skip`, { method: 'POST' });
    await this._loadQueue();
  }

  async _reorder(from, to) {
    const newQueue = [...this.queue];
    const [moved] = newQueue.splice(from, 1);
    newQueue.splice(to, 0, moved);
    await fetch('/songs/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: newQueue.map((s) => s.id) }),
    });
    await this._loadQueue();
  }

  static styles = css`
    :host {
      display: block;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    input {
      margin-right: 0.25rem;
    }
  `;

  render() {
    return html`
      <h3>Queue</h3>
      <div>
        <input
          placeholder="Singer"
          .value=${this.singer}
          @input=${(e) => (this.singer = e.target.value)}
        />
        <input
          placeholder="Video ID"
          .value=${this.videoId}
          @input=${(e) => (this.videoId = e.target.value)}
        />
        <button @click=${this._addSong}>Add</button>
      </div>
      <ul>
        ${this.queue.map(
          (item, index) =>
            html`<li>
              ${item.singer}: ${item.videoId}
              <button
                @click=${() => this._reorder(index, index - 1)}
                disabled=${index === 0}
              >
                ↑
              </button>
              <button
                @click=${() => this._reorder(index, index + 1)}
                disabled=${index === this.queue.length - 1}
              >
                ↓
              </button>
              <button @click=${() => this._skip(item.id)}>Skip</button>
              <button @click=${() => this._complete(item.id)}>Complete</button>
            </li>`,
        )}
      </ul>
    `;
  }
}

customElements.define('kj-control-panel', KJControlPanel);
