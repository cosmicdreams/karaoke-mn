import { LitElement, html, css } from 'lit';
import './search-result-item.js';

export class SearchResultsList extends LitElement {
  static properties = {
    results: { type: Array },
  };

  constructor() {
    super();
    this.results = [];
  }

  static styles = css`
    ul {
      list-style: none;
      padding: 0;
    }
  `;

  render() {
    return html`
      <ul>
        ${this.results.map(
          (r) =>
            html`<search-result-item
              .result=${r}
              @add-song=${(e) => this.dispatchEvent(e)}
              @save-song=${(e) => this.dispatchEvent(e)}
              @preview-song=${(e) => this.dispatchEvent(e)}
            ></search-result-item>`,
        )}
      </ul>
    `;
  }
}

customElements.define('search-results-list', SearchResultsList);
