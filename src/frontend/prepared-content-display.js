import { LitElement, html, css } from 'lit';

export class PreparedContentDisplay extends LitElement {
  static properties = {
    content: { type: Object },
  };

  constructor() {
    super();
    this.content = null;
  }

  static styles = css`
    :host {
      display: block;
    }
    .wrapper {
      text-align: left;
      margin: 1rem auto;
      max-width: 600px;
      background: #fafafa;
      padding: 0.5rem;
      border-radius: 4px;
    }
  `;

  render() {
    if (!this.content) return html``;
    return html`
      <div class="wrapper">
        <h3>Session Content</h3>
        <pre>${JSON.stringify(this.content, null, 2)}</pre>
      </div>
    `;
  }
}

customElements.define('prepared-content-display', PreparedContentDisplay);
