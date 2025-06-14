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
import './login-form.js';
import './error-banner.js';

class KJView extends LitElement {
  static properties = {
    loggedIn: { state: true },
  };

  constructor() {
    super();
    this.loggedIn = null; // login state unknown until checked
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
      .catch((err) => {
        console.error('login state check failed', err);
        this.loggedIn = false;
      });
  }

  _onLogin() {
    this.loggedIn = true;
    localStorage.setItem('kjLoggedIn', 'true');
  }

  render() {
    if (this.loggedIn === null) {
      return html`<p>Checking login...</p>`;
    }
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
    roomCode: { state: true },
    stageName: { state: true },
    bannerMessage: { state: true },
    bannerOpen: { state: true },
  };

  constructor() {
    super();
    this.route = this._getRoute();
    this.onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
    this.roomCode = null;
    this.stageName = localStorage.getItem('stageName');
    this.bannerMessage = '';
    this.bannerOpen = false;
    this._onPopState = () => {
      this.route = this._getRoute();
    };
    this._updateNetworkStatus = () => {
      if (!navigator.onLine) {
        this.bannerMessage = 'Network connection lost';
        this.bannerOpen = true;
      } else if (this.bannerOpen && this.bannerMessage === 'Network connection lost') {
        this.bannerMessage = 'Back online';
        this.bannerOpen = true;
        clearTimeout(this._bannerTimer);
        this._bannerTimer = setTimeout(() => (this.bannerOpen = false), 3000);
      }
    };
  }

  _onSessionCreated(e) {
    this.roomCode = e.detail.code;
  }

  _onLoggedIn(e) {
    this.stageName = e.detail.name;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', this._onPopState);
    this.addEventListener('session-created', this._onSessionCreated);
    window.addEventListener('online', this._updateNetworkStatus);
    window.addEventListener('offline', this._updateNetworkStatus);
    this._updateNetworkStatus();
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this._onPopState);
    this.removeEventListener('session-created', this._onSessionCreated);
    window.removeEventListener('online', this._updateNetworkStatus);
    window.removeEventListener('offline', this._updateNetworkStatus);
    super.disconnectedCallback();
  }

  _getRoute() {
    const path = window.location.pathname;
    const playMatch = path.match(/^\/([^/]+)\/play/);
    if (playMatch) {
      this.roomCode = playMatch[1];
      return 'play';
    }
    if (path === '/' || path.startsWith('/guest')) return 'guest';
    if (path.startsWith('/admin')) return 'kj';
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
      color: var(--accent-color);
    }
  `;

  render() {
    if (this.route === 'play') {
      return html`<main-screen-view .roomCode=${this.roomCode}></main-screen-view>`;
    }

    if (!this.onboardingComplete) {
      return html`<onboarding-flow @onboarding-complete=${this._handleOnboardingComplete}></onboarding-flow>`;
    }

    if (this.route !== 'kj' && !this.stageName) {
      return html`<login-form @login=${this._onLoggedIn}></login-form>`;
    }

    return html`
      <error-banner
        .message=${this.bannerMessage}
        ?open=${this.bannerOpen}
      ></error-banner>
      <nav>
        <a @click=${() => this._navigate('/admin')}>KJ</a>
        <a @click=${() => this._navigate('/')}>Guest</a>
        <a
          ?disabled=${!this.roomCode}
          @click=${() => this.roomCode && this._navigate(`/${this.roomCode}/play`)}
        >Play</a>
        <a @click=${() => this._navigate('/settings')}>Settings</a>
      </nav>
      ${this.route === 'kj'
        ? html`<kj-view></kj-view>`
        : this.route === 'guest'
          ? html`<guest-view></guest-view>`
          : html`<settings-profile></settings-profile>`}
    `;
  }
}

customElements.define('karaoke-app', KaraokeApp);
