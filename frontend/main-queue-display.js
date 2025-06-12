import { LitElement, html, css } from 'lit';

export class MainQueueDisplay extends LitElement {
  static properties = {
    queue: { type: Array },
  };

  constructor() {
    super();
    this.queue = [];
  }

  static styles = css`
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      margin: 0.25rem 0;
      font-size: 1.2rem;
    }
    em {
      color: #666;
    }
  `;

  render() {
    const displayCount = 5;
    const items = this.queue.slice(0, displayCount);
    while (items.length < displayCount) items.push(null);
    return html`
      <ul aria-label="Upcoming singers queue">
        ${items.map(
          (q, i) => html`<li>
            <strong>${i + 1}.</strong>
            ${q
              ? html`${q.singer}`
              : html`<em>Waiting for singer...</em>`}
          </li>`,
        )}
      </ul>
    `;
  }
}

customElements.define('main-queue-display', MainQueueDisplay);
