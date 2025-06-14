import { LitElement, html, css } from 'lit';

export class ModalDialog extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.open = false;
  }

  close() {
    this.open = false;
  }

  _onBackdrop(e) {
    if (e.target === e.currentTarget) {
      this.close();
    }
  }

  static styles = css`
    :host {
      display: none;
    }
    :host([open]) {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dialog {
      background: var(--surface-color);
      color: var(--text-color);
      padding: 1rem;
      border-radius: 4px;
      max-width: 90%;
      max-height: 90%;
      overflow: auto;
    }
  `;

  render() {
    return html`
      <div class="dialog" @click=${(e) => e.stopPropagation()}>
        <slot></slot>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._onBackdrop);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onBackdrop);
    super.disconnectedCallback();
  }
}

customElements.define('modal-dialog', ModalDialog);
