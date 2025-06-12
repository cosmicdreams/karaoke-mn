import { LitElement, html, css } from 'lit';
import './kj-login.js';
import './kj-dashboard.js';
import './guest-join-session.js';
import './guest-song-search.js';
import './guest-queue-view.js';
import './guest-songbook.js';
import './main-screen-view.js';
import './settings-profile.js';
import './onboarding-flow.js';

class KJView extends LitElement {
  static properties = {
    loggedIn: { state: true },
  };

  constructor() {
    super();
    this.loggedIn = localStorage.getItem('kjLoggedIn') === 'true';
  }

  connectedCallback() {
    super.connectedCallback();
    fetch('/auth/session')
      .then((r) => r.json())
      .then((data) => {
        this.loggedIn = data.loggedIn;
        if (data.loggedIn) {
          localStorage.setItem('kjLoggedIn', 'true');
        } else {
          localStorage.removeItem('kjLoggedIn');
        }
      })
      .catch((err) => console.error('login state check failed', err));
  }

  _onLogin() {
    this.loggedIn = true;
    localStorage.setItem('kjLoggedIn', 'true');
  }

  render() {
    return this.loggedIn
      ? html`<kj-dashboard></kj-dashboard>`
      : html`<kj-login @login=${this._onLogin}></kj-login>`;
  }
}
customElements.define('kj-view', KJView);

class GuestView extends LitElement {
  static properties = {
    joined: { state: true },
    singer: { state: true },
    code: { state: true },
  };

  constructor() {
    super();
    this.joined = false;
    this.singer = '';
    this.code = '';
  }

  _onSaveSong(e) {
    const book = this.renderRoot?.querySelector('guest-songbook');
    book?.addSong(e.detail);
  }

  _onJoined(e) {
    const { name, code } = e.detail;
    this.joined = true;
    this.singer = name;
    this.code = code;
  }

  render() {
    return this.joined
      ? html`
          <guest-song-search
            .singer=${this.singer}
            @save-song=${this._onSaveSong}
          ></guest-song-search>
          <guest-songbook .singer=${this.singer}></guest-songbook>
          <guest-queue-view .singer=${this.singer}></guest-queue-view>
        `
      : html`<guest-join-session
          @session-joined=${this._onJoined}
        ></guest-join-session>`;
  }
}
customElements.define('guest-view', GuestView);

export class KaraokeApp extends LitElement {
  static properties = {
    route: { state: true },
    onboardingComplete: { state: true },
  };

  constructor() {
    super();
    this.route = this._getRoute();
    this.onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
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
    if (path === '/' || path.startsWith('/guest')) return 'guest';
    if (path.startsWith('/admin')) return 'kj';
    if (path.startsWith('/main')) return 'main';
    if (path.startsWith('/settings')) return 'settings';
    return 'guest';
  }

  _navigate(path) {
    window.history.pushState({}, '', path);
    this.route = this._getRoute();
  }

  _handleOnboardingComplete() {
    this.onboardingComplete = true;
    localStorage.setItem('onboardingComplete', 'true');
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
      ${!this.onboardingComplete
        ? html`<onboarding-flow @onboarding-complete=${this._handleOnboardingComplete}></onboarding-flow>`
        : html`
            <nav>
              <a @click=${() => this._navigate('/admin')}>KJ</a>
              <a @click=${() => this._navigate('/')}>Guest</a>
              <a @click=${() => this._navigate('/main')}>Main</a>
              <a @click=${() => this._navigate('/settings')}>Settings</a>
            </nav>
            ${this.route === 'kj'
              ? html`<kj-view></kj-view>`
              : this.route === 'guest'
                ? html`<guest-view></guest-view>`
                : this.route === 'main'
                  ? html`<main-screen-view></main-screen-view>`
                  : html`<settings-profile></settings-profile>`}
          `}
    `;
  }
}

customElements.define('karaoke-app', KaraokeApp);
