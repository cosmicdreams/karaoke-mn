import { LitElement, html, css } from 'lit';

export class ToggleViewButton extends LitElement {
  static properties = {
    mode: { type: String },
  };

  constructor() {
    super();
    this.mode = 'list';
  }

  _toggle(mode) {
    this.mode = mode;
    this.dispatchEvent(new CustomEvent('toggle', { detail: mode, bubbles: true, composed: true }));
  }

  static styles = css`
    :host {
      display: inline-flex;
      gap: 0.5rem;
      margin-right: 1rem;
    }
    button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.25rem;
      color: var(--primary-color, #1976d2);
    }
    button[active] {
      font-weight: bold;
      text-decoration: underline;
    }
  `;

  render() {
    return html`
      <button
        ?active=${this.mode === 'list'}
        @click=${() => this._toggle('list')}
        aria-label="Show list view"
      >
        List
      </button>
      <button
        ?active=${this.mode === 'grid'}
        @click=${() => this._toggle('grid')}
        aria-label="Show grid view"
      >
        Grid
      </button>
    `;
  }
}

customElements.define('toggle-view-button', ToggleViewButton);