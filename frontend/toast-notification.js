import { LitElement, html, css } from 'lit';

export class ToastNotification extends LitElement {
  static properties = {
    message: { type: String },
    open: { type: Boolean, reflect: true },
    duration: { type: Number },
  };

  constructor() {
    super();
    this.message = '';
    this.open = false;
    this.duration = 3000;
    this._timer = null;
  }

  show(msg, duration = this.duration) {
    this.message = msg;
    this.open = true;
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this.open = false;
    }, duration);
  }

  static styles = css`
    :host {
      position: fixed;
      left: 50%;
      bottom: 1rem;
      transform: translateX(-50%);
      background: #323232;
      color: #fff;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      z-index: 1000;
    }
    :host([open]) {
      opacity: 1;
      pointer-events: auto;
    }
  `;

  render() {
    return html`${this.message}`;
  }
}

customElements.define('toast-notification', ToastNotification);
