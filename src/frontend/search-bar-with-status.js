import { LitElement, html, css } from 'lit';
import './search-bar.js';
import './loading-spinner.js';

export class SearchBarWithStatus extends LitElement {
  static properties = {
    value: { type: String },
    searchTerm: { state: true },
    query: { state: true },
    loading: { state: true },
    error: { state: true },
  };

  constructor() {
    super();
    this.value = '';
    this.searchTerm = '';
    this.loading = false;
    this.error = '';
    this.query = '';
  }

  _onInput(e) {
    this.value = e.detail.value;
  }

  async _onSearch(e) {
    const v = e.detail.value.trim();
    if (!v) return;
    this.searchTerm = v;
    const q = /karaoke/i.test(v) ? v : `${v} karaoke`;
    this.error = '';
    this.query = q;
    this.loading = true;
    try {
      const res = await fetch(`/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      this.dispatchEvent(
        new CustomEvent('results', {
          detail: data,
          bubbles: true,
          composed: true,
        }),
      );
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }

  _displayTerm() {
    const term = this.searchTerm;
    return /karaoke/i.test(term) ? term : html`${term} + Karaoke`;
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
    }
    .status {
      background: var(--surface-color);
      color: var(--text-color);
      padding: 0.5rem;
      margin: 0.5rem 0;
      font-size: 1rem;
      border-radius: 4px;
    }
  `;

  render() {
    return html`
      <search-bar
        .value=${this.value}
        @search-input=${this._onInput}
        @search=${this._onSearch}
      ></search-bar>
      <div class="status">
        ${this.loading
          ? html`Searching for ${this._displayTerm()}
              <loading-spinner></loading-spinner>`
          : this.error
            ? html`Error: ${this.error}`
            : this.query
              ? html`Showing results for ${this._displayTerm()}`
              : html``}
      </div>
    `;
  }
}

customElements.define('search-bar-with-status', SearchBarWithStatus);
