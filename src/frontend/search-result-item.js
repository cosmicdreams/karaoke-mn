import { LitElement, html, css } from 'lit';

export class SearchResultItem extends LitElement {
  static properties = {
    result: { type: Object },
  };

  constructor() {
    super();
    this.result = { videoId: '', title: '' };
  }

  _preview() {
    this.dispatchEvent(
      new CustomEvent('preview-song', {
        detail: this.result,
        bubbles: true,
        composed: true,
      }),
    );
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
      flex-direction: column;
      align-items: center;
      padding: 0.5rem;
      background: var(--surface-color);
      border-radius: 4px;
      text-align: center;
    }
    img {
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }
    .actions {
      display: flex;
      gap: 0.25rem;
      margin-top: 0.5rem;
    }
    button {
      flex: 1;
      padding: 0.25rem 0.5rem;
    }
  `;

  render() {
    return html`
      <li>
        <span>${this.result.title}</span>
        <span>
          <button
            @click=${this._add}
            aria-label="Add song: ${this.result.title}"
          >
            Add
          </button>
          <button
            @click=${this._save}
            aria-label="Save song: ${this.result.title}"
          >
            Save
          </button>
          <button
            @click=${this._preview}
            aria-label="Preview song: ${this.result.title}"
          >
            Preview
          </button>
        </span>
      </li>
    `;
  }
}

customElements.define('search-result-item', SearchResultItem);
