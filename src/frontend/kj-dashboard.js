import { LitElement, html } from 'lit';
import './kj-session-creator.js';
import './kj-control-panel.js';
import './kj-catalog-manager.js';

export class KJDashboard extends LitElement {
  render() {
    return html`
      <kj-session-creator></kj-session-creator>
      <kj-control-panel></kj-control-panel>
      <kj-catalog-manager></kj-catalog-manager>
    `;
  }
}

customElements.define('kj-dashboard', KJDashboard);
