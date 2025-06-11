import { LitElement, html, css } from 'lit';

export class SettingsProfile extends LitElement {
  static properties = {
    theme: { type: String },
  };

  constructor() {
    super();
    this.theme = localStorage.getItem('theme') || 'light';
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
    document.body.setAttribute('data-theme', this.theme);
  }

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
    }
    button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
    }
  `;

  render() {
    return html`
      <h2>Settings / Profile</h2>
      <div>
        <label>Theme: ${this.theme}</label>
        <button @click=${this.toggleTheme}>Toggle Theme</button>
      </div>
      <!-- Add more preferences here -->
    `;
  }
}

customElements.define('settings-profile', SettingsProfile); 