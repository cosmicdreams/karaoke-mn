import { LitElement, html, css } from 'lit';

export class ErrorBanner extends LitElement {
  static properties = {
    message: { type: String },
    open: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.message = '';
    this.open = false;
  }

  show(msg) {
    this.message = msg;
    this.open = true;
  }

  hide() {
    this.open = false;
  }

  static styles = css`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: var(--accent-color);
      color: var(--text-color);
      padding: var(--spacing-sm, 0.5rem);
      text-align: center;
      box-sizing: border-box;
      transform: translateY(-100%);
      transition: transform 0.3s ease;
      z-index: 1000;
    }
    :host([open]) {
      transform: translateY(0);
    }
  `;

  render() {
    return html`<div role="alert">${this.message}</div>`;
  }
}

customElements.define('error-banner', ErrorBanner);
