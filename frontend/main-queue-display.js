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
      <ul>
        ${this.queue.map((q) => html`<li>${q.singer}: ${q.videoId}</li>`)}
      </ul>
    `;
  }
}

customElements.define('main-queue-display', MainQueueDisplay);
