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

  _save() {
    this.dispatchEvent(
      new CustomEvent('save-song', {
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
        <span>
          <button @click=${this._add} aria-label="Add song: ${this.result.title}">Add</button>
          <button @click=${this._save} aria-label="Save song: ${this.result.title}">Save</button>
        </span>
      </li>
    `;
  }
}

customElements.define('search-result-item', SearchResultItem);
