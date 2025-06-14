import { LitElement, html, css } from 'lit';

export class LoadingSpinner extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    .spinner {
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top-color: var(--text-color);
      border-radius: 50%;
      width: 24px;
      height: 24px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  render() {
    return html`<div class="spinner"></div>`;
  }
}

customElements.define('loading-spinner', LoadingSpinner);
