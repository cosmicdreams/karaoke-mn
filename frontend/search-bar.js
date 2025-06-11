import { LitElement, html, css } from 'lit';

export class SearchBar extends LitElement {
  static properties = {
    value: { type: String },
  };

  constructor() {
    super();
    this.value = '';
  }

  _onInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(
      new CustomEvent('search-input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _onKeyDown(e) {
    if (e.key === 'Enter') {
      this.dispatchEvent(
        new CustomEvent('search', {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  static styles = css`
    input {
      padding: 0.5rem;
      font-size: 1rem;
      width: 100%;
      box-sizing: border-box;
    }
  `;

  render() {
    return html`
      <input
        type="text"
        placeholder="Search songs"
        .value=${this.value}
        @input=${this._onInput}
        @keydown=${this._onKeyDown}
      />
    `;
  }
}

customElements.define('search-bar', SearchBar);
