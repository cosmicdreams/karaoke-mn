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
  `;

  render() {
    return html`
      <ul aria-label="Upcoming singers queue">
        ${this.queue.map((q) =>
          html`<li>Singer: ${q.singer}, Song ID: ${q.videoId}</li>`
        )}
      </ul>
    `;
  }
}

customElements.define('main-queue-display', MainQueueDisplay);
