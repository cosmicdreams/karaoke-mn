import { LitElement, html, css } from 'lit';

export class WatermarkLink extends LitElement {
  static properties = {
    link: { type: String }
  };

  static styles = css`
    :host {
      position: absolute;
      bottom: 0.5rem;
      right: 0.5rem;
      font-size: 0.75rem;
      background: rgba(0, 0, 0, 0.4);
      color: rgba(255, 255, 255, 0.8);
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
  `;

  constructor() {
    super();
    this.link = '';
  }

  render() {
    return html`<a href="${this.link}" target="_blank" rel="noopener">${this.link}</a>`;
  }
}

customElements.define('watermark-link', WatermarkLink);