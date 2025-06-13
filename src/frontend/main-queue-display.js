import { LitElement, html, css } from 'lit';
import './main-queue-item.js';

export class MainQueueDisplay extends LitElement {
  static properties = {
    queue: { type: Array },
  };

  constructor() {
    super();
    this.queue = [];
  }

  static styles = css`
    :host {
      display: block;
      background: var(--surface-color, #222);
      padding: 0.5rem;
      border-radius: 4px;
    }
    .list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  `;

  render() {
    const displayCount = 5;
    const items = this.queue.slice(0, displayCount);
    while (items.length < displayCount) items.push(null);
    return html`
      <ul class="list" aria-label="Upcoming singers queue">
        ${items.map(
          (q, i) => html`<li>
            <main-queue-item
              .position=${i + 1}
              .singer=${q ? q.singer : ''}
            ></main-queue-item>
          </li>`,
        )}
      </ul>
    `;
  }
}

customElements.define('main-queue-display', MainQueueDisplay);
