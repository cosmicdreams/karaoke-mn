import { LitElement, html, css } from 'lit';
import './kj-login.js';
import './kj-dashboard.js';

class KJView extends LitElement {
  static properties = {
    loggedIn: { state: true },
  };

  constructor() {
    super();
    this.loggedIn = false;
  }

  _onLogin() {
    this.loggedIn = true;
  }

  render() {
    return this.loggedIn
      ? html`<kj-dashboard></kj-dashboard>`
      : html`<kj-login @login=${this._onLogin}></kj-login>`;
  }
}
customElements.define('kj-view', KJView);

class GuestView extends LitElement {
  render() {
    return html`<div>Guest View</div>`;
  }
}
customElements.define('guest-view', GuestView);

class MainScreenView extends LitElement {
  render() {
    return html`<div>Main Screen View</div>`;
  }
}
customElements.define('main-screen-view', MainScreenView);

export class KaraokeApp extends LitElement {
  static properties = {
    route: { state: true },
  };

  constructor() {
    super();
    this.route = this._getRoute();
    this._onPopState = () => {
      this.route = this._getRoute();
    };
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', this._onPopState);
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this._onPopState);
    super.disconnectedCallback();
  }

  _getRoute() {
    const path = window.location.pathname;
    if (path.startsWith('/kj')) return 'kj';
    if (path.startsWith('/guest')) return 'guest';
    if (path.startsWith('/main')) return 'main';
    return 'guest';
  }

  _navigate(path) {
    window.history.pushState({}, '', path);
    this.route = this._getRoute();
  }

  static styles = css`
    nav {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    nav a {
      cursor: pointer;
      color: #00bcd4;
    }
  `;

  render() {
    return html`
      <nav>
        <a @click=${() => this._navigate('/kj')}>KJ</a>
        <a @click=${() => this._navigate('/guest')}>Guest</a>
        <a @click=${() => this._navigate('/main')}>Main</a>
      </nav>
      ${this.route === 'kj'
        ? html`<kj-view></kj-view>`
        : this.route === 'guest'
          ? html`<guest-view></guest-view>`
          : html`<main-screen-view></main-screen-view>`}
    `;
  }
}

customElements.define('karaoke-app', KaraokeApp);
