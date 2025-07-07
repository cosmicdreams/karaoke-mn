import { LitElement, html, css } from 'lit';
import {
  spacingStyles,
  mobileLandscapeStyles,
  surfaceStyles,
} from '../shared/theme-utils.js';

function base64urlToUint8Array(base64url) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const paddingLength = (4 - base64.length % 4) % 4;
  const padded = base64 + '='.repeat(paddingLength);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

function bufToB64(buf) {
  const bin = String.fromCharCode(...new Uint8Array(buf));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeOpts(opts) {
  if (!opts) return opts;
  const out = { ...opts };
  if (out.challenge) out.challenge = base64urlToUint8Array(out.challenge);
  if (out.user && out.user.id) out.user.id = base64urlToUint8Array(out.user.id);
  if (Array.isArray(out.allowCredentials)) {
    out.allowCredentials = out.allowCredentials.map((c) => ({
      ...c,
      id: base64urlToUint8Array(c.id),
    }));
  }
  if (Array.isArray(out.excludeCredentials)) {
    out.excludeCredentials = out.excludeCredentials.map((c) => ({
      ...c,
      id: base64urlToUint8Array(c.id),
    }));
  }
  return out;
}

function credToJSON(cred) {
  if (cred instanceof ArrayBuffer) {
    return bufToB64(cred);
  } else if (Array.isArray(cred)) {
    return cred.map(credToJSON);
  } else if (cred && cred.constructor && cred.constructor.name === 'PublicKeyCredential') {
    return {
      id: cred.id,
      rawId: credToJSON(cred.rawId),
      response: {
        clientDataJSON: credToJSON(cred.response.clientDataJSON),
        attestationObject: cred.response.attestationObject ? credToJSON(cred.response.attestationObject) : undefined,
        authenticatorData: cred.response.authenticatorData ? credToJSON(cred.response.authenticatorData) : undefined,
        signature: cred.response.signature ? credToJSON(cred.response.signature) : undefined,
        userHandle: cred.response.userHandle ? credToJSON(cred.response.userHandle) : undefined,
      },
      type: cred.type,
    };
  } else if (cred && cred.constructor && cred.constructor.name === 'AuthenticatorAttestationResponse') {
    return {
      clientDataJSON: credToJSON(cred.clientDataJSON),
      attestationObject: credToJSON(cred.attestationObject),
    };
  } else if (cred && cred.constructor && cred.constructor.name === 'AuthenticatorAssertionResponse') {
    return {
      clientDataJSON: credToJSON(cred.clientDataJSON),
      authenticatorData: credToJSON(cred.authenticatorData),
      signature: credToJSON(cred.signature),
      userHandle: cred.userHandle ? credToJSON(cred.userHandle) : undefined,
    };
  } else if (cred && typeof cred === 'object') {
    const obj = {};
    for (const [k, v] of Object.entries(cred)) {
      obj[k] = credToJSON(v);
    }
    return obj;
  }
  return cred;
}

export class LoginForm extends LitElement {
  static properties = {
    name: { state: true },
    roomName: { state: true },
    error: { state: true },
    isLoading: { state: true },
    isAuthenticated: { state: true },
  };

  constructor() {
    super();
    this.name = localStorage.getItem('stageName') || '';
    this.roomName = 'Karaoke MN Session';
    this.error = '';
    this.isLoading = false;
    this.isAuthenticated = false;
  }

  connectedCallback() {
    super.connectedCallback();
    // Try to get room info from URL or localStorage
    this._loadRoomInfo();
  }

  _loadRoomInfo() {
    // In a real app, this would come from URL params or session storage
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('room') || localStorage.getItem('currentRoom');
    if (roomCode) {
      this.roomName = `Room ${roomCode.toUpperCase()}`;
    }
  }

  _onInput(e) {
    this.name = e.target.value;
    this.error = ''; // Clear error when typing
  }

  async _handlePasskeyLogin() {
    this.error = '';
    this.isLoading = true;

    if (!this.name.trim()) {
      this.error = 'Please enter your Stage Name';
      this.isLoading = false;
      return;
    }

    localStorage.setItem('stageName', this.name.trim());

    try {
      // Check if user has existing passkey
      const hasPasskey = localStorage.getItem('hasPasskey') === 'true';
      
      if (hasPasskey) {
        // Try login with existing passkey
        await this._loginWithPasskey();
      } else {
        // Register new passkey
        await this._registerPasskey();
      }

      this.isAuthenticated = true;
      
      // Show success briefly, then navigate
      setTimeout(() => {
        this.dispatchEvent(
          new CustomEvent('login', { 
            detail: { name: this.name.trim() }, 
            bubbles: true, 
            composed: true 
          })
        );
      }, 800);

    } catch (err) {
      console.error('Authentication error:', err);
      this.error = err.message || 'Authentication failed. Please try again.';
      this.isLoading = false;
    }
  }

  async _registerPasskey() {
    const optsRaw = await fetch('/auth/register/options').then((r) => r.json());
    const opts = decodeOpts(optsRaw);
    const cred = await navigator.credentials.create({ publicKey: opts });
    const res = await fetch('/auth/register/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credToJSON(cred)),
    }).then((r) => r.json());
    
    if (!res.verified) {
      throw new Error('Registration failed');
    }
    
    localStorage.setItem('hasPasskey', 'true');
  }

  async _loginWithPasskey() {
    const optsRaw = await fetch('/auth/login/options').then((r) => r.json());
    const opts = decodeOpts(optsRaw);
    const cred = await navigator.credentials.get({ publicKey: opts });
    const res = await fetch('/auth/login/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credToJSON(cred)),
    }).then((r) => r.json());
    
    if (!res.verified) {
      throw new Error('Login failed');
    }
  }

  static styles = [
    spacingStyles,
    mobileLandscapeStyles,
    surfaceStyles,
    css`
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: var(--bg-color);
        color: var(--text-color);
        padding: var(--spacing-md);
        position: relative;
        overflow: hidden;
      }

      /* Animated background elements */
      .background-elements {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
      }

      .bg-element {
        position: absolute;
        border-radius: 50%;
        opacity: 0.1;
        animation: pulse 4s infinite;
      }

      .bg-element:nth-child(1) {
        top: 25%;
        left: 25%;
        width: 128px;
        height: 128px;
        background: var(--accent-color);
      }

      .bg-element:nth-child(2) {
        top: 75%;
        right: 25%;
        width: 96px;
        height: 96px;
        background: #fbbf24;
        animation-delay: 1s;
      }

      .bg-element:nth-child(3) {
        bottom: 25%;
        left: 33%;
        width: 80px;
        height: 80px;
        background: #10b981;
        animation-delay: 0.5s;
      }

      /* Main container */
      .container {
        width: 100%;
        max-width: 400px;
        position: relative;
        z-index: 10;
      }

      /* Login card */
      .login-card {
        background: rgba(34, 34, 34, 0.8);
        backdrop-filter: blur(20px);
        border-radius: 24px;
        padding: var(--spacing-lg);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      }

      /* Logo section */
      .logo-section {
        display: flex;
        justify-content: center;
        margin-bottom: var(--spacing-lg);
      }

      .logo-container {
        position: relative;
      }

      .logo-circle {
        width: 80px;
        height: 80px;
        background: var(--accent-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 25px rgba(255, 64, 129, 0.3);
        transition: all 0.3s ease;
      }

      .logo-icon {
        font-size: 2.5rem;
        color: white;
      }

      .logo-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 32px;
        height: 32px;
        background: #fbbf24;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
      }

      .logo-loading {
        width: 32px;
        height: 32px;
        border: 3px solid white;
        border-top: 3px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      /* Welcome section */
      .welcome-section {
        text-align: center;
        margin-bottom: var(--spacing-lg);
      }

      .welcome-title {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0 0 0.5rem 0;
        color: var(--text-color);
      }

      .singer-name {
        font-size: 1.25rem;
        color: var(--accent-color);
        font-weight: 600;
        margin: 0 0 var(--spacing-md) 0;
      }

      .room-info {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: var(--spacing-md);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .room-label {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.7);
        margin: 0 0 0.25rem 0;
      }

      .room-name {
        font-size: 1.125rem;
        font-weight: 500;
        margin: 0;
        color: var(--text-color);
      }

      /* Form section */
      .form-section {
        margin-bottom: var(--spacing-lg);
      }

      .name-input {
        width: 100%;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: var(--spacing-md);
        color: var(--text-color);
        font-size: 1rem;
        margin-bottom: var(--spacing-md);
        box-sizing: border-box;
        transition: all 0.2s ease;
      }

      .name-input:focus {
        outline: 2px solid var(--accent-color);
        outline-offset: 2px;
        border-color: var(--accent-color);
      }

      .name-input::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      /* Login button */
      .login-button {
        width: 100%;
        background: var(--accent-color);
        color: white;
        border: none;
        border-radius: 16px;
        padding: var(--spacing-md);
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        transition: all 0.2s ease;
        box-shadow: 0 4px 15px rgba(255, 64, 129, 0.3);
        min-height: 56px;
      }

      .login-button:hover:not(:disabled) {
        transform: scale(1.02);
        background: color-mix(in srgb, var(--accent-color) 90%, white);
      }

      .login-button:focus {
        outline: 2px solid var(--accent-color);
        outline-offset: 2px;
      }

      .login-button:disabled {
        background: rgba(255, 255, 255, 0.2);
        cursor: not-allowed;
        transform: none;
      }

      .button-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid white;
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .button-icon {
        font-size: 1.25rem;
      }

      /* Additional info */
      .additional-info {
        text-align: center;
        margin-top: var(--spacing-md);
      }

      .security-note {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.6);
        margin: 0;
      }

      /* Bottom decoration */
      .bottom-decoration {
        display: flex;
        justify-content: center;
        margin-top: var(--spacing-md);
      }

      .dots-container {
        display: flex;
        gap: 0.5rem;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out;
      }

      .dot:nth-child(1) {
        background: var(--accent-color);
      }

      .dot:nth-child(2) {
        background: #8b5cf6;
        animation-delay: 0.1s;
      }

      .dot:nth-child(3) {
        background: #3b82f6;
        animation-delay: 0.2s;
      }

      /* Error message */
      .error-message {
        background: rgba(255, 82, 82, 0.1);
        border: 1px solid var(--error-color);
        border-radius: 8px;
        padding: var(--spacing-sm);
        margin-top: var(--spacing-sm);
        color: var(--error-color);
        font-size: 0.875rem;
        text-align: center;
      }

      /* Animations */
      @keyframes pulse {
        0%, 100% { 
          opacity: 0.1; 
          transform: scale(1);
        }
        50% { 
          opacity: 0.2; 
          transform: scale(1.05);
        }
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes bounce {
        0%, 80%, 100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }

      /* Success state */
      .logo-circle.success {
        background: #10b981;
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
      }

      .success-icon {
        animation: pulse 0.6s ease-in-out;
      }

      /* Mobile adjustments */
      @media (max-width: var(--breakpoint-phone)) {
        :host {
          padding: var(--spacing-sm);
        }

        .login-card {
          padding: var(--spacing-md);
        }

        .logo-circle {
          width: 70px;
          height: 70px;
        }

        .logo-icon {
          font-size: 2rem;
        }

        .welcome-title {
          font-size: 1.25rem;
        }

        .singer-name {
          font-size: 1.125rem;
        }
      }
    `,
  ];

  render() {
    return html`
      <!-- Animated background elements -->
      <div class="background-elements">
        <div class="bg-element"></div>
        <div class="bg-element"></div>
        <div class="bg-element"></div>
      </div>

      <div class="container">
        <!-- Main login card -->
        <div class="login-card">
          <!-- App logo/icon -->
          <div class="logo-section">
            <div class="logo-container">
              <div class="logo-circle ${this.isAuthenticated ? 'success' : ''}">
                ${this.isAuthenticated ? html`
                  <div class="logo-icon success-icon">✓</div>
                ` : this.isLoading ? html`
                  <div class="logo-loading"></div>
                ` : html`
                  <div class="logo-icon">🎤</div>
                `}
              </div>
              ${!this.isLoading && !this.isAuthenticated ? html`
                <div class="logo-badge">
                  <span>🎵</span>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Welcome message -->
          <div class="welcome-section">
            <h1 class="welcome-title">Welcome Back,</h1>
            <p class="singer-name">
              ${this.name || 'Singer'}! 🎤
            </p>
            
            <!-- Room info -->
            <div class="room-info">
              <p class="room-label">Joining:</p>
              <p class="room-name">${this.roomName}</p>
            </div>
          </div>

          <!-- Form section -->
          <div class="form-section">
            <form @submit=${(e) => { e.preventDefault(); this._handlePasskeyLogin(); }}>
              <input
                type="text"
                class="name-input"
                placeholder="Enter your stage name"
                .value=${this.name}
                @input=${this._onInput}
                ?disabled=${this.isLoading}
                aria-label="Stage name"
                autofocus
              />
              
              <!-- Passkey login button -->
              <button
                type="submit"
                class="login-button"
                ?disabled=${this.isLoading}
              >
                ${this.isLoading ? html`
                  <div class="button-spinner"></div>
                  <span>Authenticating...</span>
                ` : html`
                  <span class="button-icon">📱</span>
                  <span>Login with Passkey</span>
                  <span class="button-icon">🔐</span>
                `}
              </button>
            </form>

            ${this.error ? html`
              <div class="error-message" role="alert" aria-live="polite">
                ${this.error}
              </div>
            ` : ''}
          </div>

          <!-- Additional info -->
          <div class="additional-info">
            <p class="security-note">
              Secure login with your device credentials
            </p>
          </div>
        </div>

        <!-- Bottom decorative element -->
        <div class="bottom-decoration">
          <div class="dots-container">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('login-form', LoginForm);