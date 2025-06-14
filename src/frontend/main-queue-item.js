import { LitElement, html, css } from 'lit';

export class MainQueueItem extends LitElement {
  static properties = {
    position: { type: Number },
    singer: { type: String },
  };

  constructor() {
    super();
    this.position = 0;
    this.singer = '';
  }

  static styles = css`
    :host {
      display: block;
      padding: 0.25rem 0;
    }
    .pos {
      color: var(--accent-color, #ff4081);
      margin-right: 0.5rem;
      font-weight: bold;
    }
    .singer {
      font-size: 1.25rem;
      font-weight: bold;
    }
    em {
      color: var(--text-color);
    }
  `;

  render() {
    return html`
      <div>
        <span class="pos">${this.position}.</span>
        ${this.singer
          ? html`<span class="singer">${this.singer}</span>`
          : html`<em>Waiting for singer...</em>`}
      </div>
    `;
  }
}

customElements.define('main-queue-item', MainQueueItem);
