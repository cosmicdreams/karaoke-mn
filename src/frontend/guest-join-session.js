import { LitElement, html, css } from 'lit';
import './toast-notification.js';
import { showToast } from '../shared/toast.js';

// WebAuthn utility functions
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
  } else if (cred && typeof cred === 'object') {
    const obj = {};
    for (const [k, v] of Object.entries(cred)) {
      obj[k] = credToJSON(v);
    }
    return obj;
  }
  return cred;
}

export class GuestJoinSession extends LitElement {
  static properties = {
    name: { state: true },
    message: { state: true },
    isLoading: { state: true },
    isAuthenticated: { state: true },
  };

  constructor() {
    super();
    this.name = '';
    this.message = '';
    this.isLoading = false;
    this.isAuthenticated = false;
  }

  _onNameInput(e) {
    this.name = e.target.value;
    this.message = ''; // Clear message when typing
  }

  async _handlePasskeyLogin() {
    this.message = '';
    this.isLoading = true;

    if (!this.name.trim()) {
      this.message = 'Please enter your username';
      this.isLoading = false;
      return;
    }

    try {
      // Generate device ID for this user
      const deviceId = this._generateDeviceId(this.name.trim());
      
      // Check if user has existing passkey for this device
      const hasPasskey = localStorage.getItem(`passkey-${deviceId}`) === 'true';
      
      if (hasPasskey) {
        // Try login with existing passkey
        await this._loginWithPasskey();
      } else {
        // Register new passkey
        await this._registerPasskey();
        localStorage.setItem(`passkey-${deviceId}`, 'true');
      }

      this.isAuthenticated = true;
      
      // Store authentication info
      localStorage.setItem('karaoke-mn-deviceId', deviceId);
      localStorage.setItem('karaoke-mn-username', this.name.trim());
      
      this.message = `Welcome ${this.name.trim()}!`;
      
      // Show success briefly, then navigate
      setTimeout(() => {
        this.dispatchEvent(
          new CustomEvent('join', {
            detail: { 
              deviceId: deviceId,
              username: this.name.trim()
            },
            bubbles: true,
            composed: true
          })
        );
      }, 800);

    } catch (err) {
      console.error('Authentication error:', err);
      this.message = err.message || 'Authentication failed. Please try again.';
      this.isLoading = false;
    }
  }

  _generateDeviceId(username) {
    // Create a consistent device ID based on username and browser
    return btoa(`${username}:${navigator.userAgent.slice(0, 50)}`).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
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

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #6B46C1 0%, #1E40AF 50%, #3730A3 100%);
      color: white;
      padding: 1rem;
      position: relative;
      overflow: hidden;
      font-family: system-ui, sans-serif;
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
      background: #EC4899;
    }

    .bg-element:nth-child(2) {
      top: 75%;
      right: 25%;
      width: 96px;
      height: 96px;
      background: #FBBF24;
      animation-delay: 1s;
    }

    .bg-element:nth-child(3) {
      bottom: 25%;
      left: 33%;
      width: 80px;
      height: 80px;
      background: #10B981;
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
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    }

    /* Logo section */
    .logo-section {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .logo-container {
      position: relative;
    }

    .logo-circle {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #EC4899, #8B5CF6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3);
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
      background: #FBBF24;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    /* Welcome section */
    .welcome-section {
      text-align: center;
      margin-bottom: 2rem;
    }

    .welcome-title {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0 0 0.5rem 0;
      color: white;
    }

    .subtitle {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 1.5rem 0;
    }

    /* Form section */
    form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
    }

    .form-group input {
      width: 100%;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 0.75rem;
      color: white;
      font-size: 1rem;
      box-sizing: border-box;
      transition: all 0.2s ease;
    }

    .form-group input:focus {
      outline: 2px solid #EC4899;
      outline-offset: 2px;
      border-color: #EC4899;
      background: rgba(255, 255, 255, 0.15);
    }

    .form-group input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .form-group small {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
    }


    /* Submit button */
    .submit-button {
      width: 100%;
      background: linear-gradient(135deg, #EC4899, #8B5CF6);
      color: white;
      border: none;
      border-radius: 16px;
      padding: 1rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      transition: all 0.2s ease;
      box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
      min-height: 56px;
    }

    .submit-button:hover {
      transform: scale(1.02);
      background: linear-gradient(135deg, #DB2777, #7C3AED);
    }

    .submit-button:focus {
      outline: 2px solid #EC4899;
      outline-offset: 2px;
    }

    .button-icon {
      font-size: 1.25rem;
    }

    .button-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid white;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .submit-button:disabled {
      background: rgba(255, 255, 255, 0.2);
      cursor: not-allowed;
      transform: none;
    }

    .additional-info {
      text-align: center;
      margin-top: var(--spacing-md);
    }

    .security-note {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }

    /* Message display */
    .message {
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 8px;
      text-align: center;
      font-size: 0.875rem;
    }

    .message.success {
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid #10B981;
      color: #6EE7B7;
    }

    .message.error {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid #EF4444;
      color: #FCA5A5;
    }

    /* Bottom decoration */
    .bottom-decoration {
      display: flex;
      justify-content: center;
      margin-top: 1.5rem;
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
      background: #EC4899;
    }

    .dot:nth-child(2) {
      background: #8B5CF6;
      animation-delay: 0.1s;
    }

    .dot:nth-child(3) {
      background: #3B82F6;
      animation-delay: 0.2s;
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

    @keyframes bounce {
      0%, 80%, 100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Mobile adjustments */
    @media (max-width: 600px) {
      :host {
        padding: 0.5rem;
      }

      .login-card {
        padding: 1.5rem;
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
    }
  `;

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
              <div class="logo-circle">
                <div class="logo-icon">🎤</div>
              </div>
              <div class="logo-badge">
                <span>🎵</span>
              </div>
            </div>
          </div>

          <!-- Welcome message -->
          <div class="welcome-section">
            <h1 class="welcome-title">Join Karaoke Night!</h1>
            <p class="subtitle">
              ${this.isAuthenticated 
                ? `Welcome ${this.name}! 🎤`
                : 'Enter your username and use your device passkey 🎤'
              }
            </p>
          </div>

          <!-- Form section -->
          <form
            @submit=${(e) => {
              e.preventDefault();
              this._handlePasskeyLogin();
            }}
          >
            <!-- Username -->
            <div class="form-group">
              <label for="username">Username</label>
              <input
                id="username"
                placeholder="Your username"
                .value=${this.name}
                @input=${this._onNameInput}
                autocomplete="username"
                ?disabled=${this.isLoading}
                required
                autofocus
              />
              <small>This device will remember your login credentials</small>
            </div>

            <!-- Submit button -->
            <button type="submit" class="submit-button" ?disabled=${this.isLoading} aria-label="Join session with passkey">
              ${this.isLoading ? html`
                <span class="button-spinner"></span>
                <span>Authenticating...</span>
              ` : this.isAuthenticated ? html`
                <span class="button-icon">✓</span>
                <span>Authenticated!</span>
                <span class="button-icon">🎤</span>
              ` : html`
                <span class="button-icon">📱</span>
                <span>Join with Passkey</span>
                <span class="button-icon">🔐</span>
              `}
            </button>

            ${this.message ? html`
              <div class="message ${this.message.includes('Welcome') ? 'success' : 'error'}" aria-live="polite">
                ${this.message}
              </div>
            ` : ''}
          </form>

          <!-- Additional info -->
          <div class="additional-info">
            <p class="security-note">
              🔐 Secure login with device passkeys - no passwords needed!
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

customElements.define('guest-join-session', GuestJoinSession);
