import { LitElement, html, css } from 'lit';

export class SearchResultItem extends LitElement {
  static properties = {
    result: { type: Object },
  };

  constructor() {
    super();
    this.result = { videoId: '', title: '' };
  }

  _add() {
    this.dispatchEvent(
      new CustomEvent('add-song', {
        detail: this.result,
        bubbles: true,
        composed: true,
      }),
    );
  }

  static styles = css`
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem 0;
    }
    button {
      margin-left: 0.5rem;
    }
  `;

  render() {
    return html`
      <li>
        <span>${this.result.title}</span>
        <button @click=${this._add}>Add</button>
      </li>
    `;
  }
}

customElements.define('search-result-item', SearchResultItem);
