import { LitElement, html, css } from 'lit';
import './guest-queue-view.js';

export class PopoverQueue extends LitElement {
  static properties = {
    singer: { type: String },
    open: { state: true },
  };

  constructor() {
    super();
    this.singer = '';
    this.open = false;
  }

  toggle() {
    this.open = !this.open;
  }

  static styles = css`
    :host {
      position: relative;
      display: inline-block;
      margin-right: 1rem;
    }
    .popover {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 0.5rem;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      z-index: 100;
    }
  `;

  render() {
    return html`
      <button @click=${this.toggle} aria-label="Show your queue">My Queue</button>
      ${this.open
        ? html`<div class="popover"><guest-queue-view .singer=${this.singer}></guest-queue-view></div>`
        : ''}
    `;
  }
}

customElements.define('popover-queue', PopoverQueue);