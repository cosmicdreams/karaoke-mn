import { LitElement, html, css } from 'lit';

export class OnScreenAnnouncement extends LitElement {
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
      left: 50%;
      top: 20%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-size: 1.5rem;
      display: none;
      z-index: 1000;
    }
    :host([open]) {
      display: block;
    }
  `;

  render() {
    return html`${this.message}`;
  }
}

customElements.define('on-screen-announcement', OnScreenAnnouncement);
