import { LitElement, html, css } from 'lit';

class HelloLit extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      background: #222;
      color: #fff;
    }
  `;

  render() {
    return html`<p>Hello from Lit!</p>`;
  }
}

customElements.define('hello-lit', HelloLit);
