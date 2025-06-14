import { LitElement, html, css } from 'lit';
import './toggle-view-button.js';
import './search-result-item.js';

export class SearchResultsList extends LitElement {
  static properties = {
    results: { type: Array },
    viewMode: { type: String },
    searched: { type: Boolean },
  };

  constructor() {
    super();
    this.results = [];
    this.viewMode = 'list';
    this.searched = false;
  }

  static styles = css`
    ul {
      list-style: none;
      padding: 0;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 1rem;
      padding: 0;
      margin: 0;
    }
    .grid ::slotted(*) {
      margin: 0;
    }
  `;

  render() {
    return html`
      <div class="controls">
        <toggle-view-button
          .mode=${this.viewMode}
          @toggle=${(e) => (this.viewMode = e.detail)}
        ></toggle-view-button>
      </div>
      ${this.results.length === 0 && this.searched
        ? html`<p>No results found</p>`
        : this.viewMode === 'grid'
          ? html`<div class="grid">
              ${this.results.map(
                (r) =>
                  html`<search-result-item
                    .result=${r}
                    @add-song=${(e) => this.dispatchEvent(e)}
                    @save-song=${(e) => this.dispatchEvent(e)}
                    @preview-song=${(e) => this.dispatchEvent(e)}
                  ></search-result-item>`,
              )}
            </div>`
          : html`<ul>
              ${this.results.map(
                (r) =>
                  html`<search-result-item
                    .result=${r}
                    @add-song=${(e) => this.dispatchEvent(e)}
                    @save-song=${(e) => this.dispatchEvent(e)}
                    @preview-song=${(e) => this.dispatchEvent(e)}
                  ></search-result-item>`,
              )}
            </ul>`}
    `;
  }
}

customElements.define('search-results-list', SearchResultsList);
