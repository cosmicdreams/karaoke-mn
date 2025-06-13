import { LitElement, html, css } from 'lit';

class OnboardingFlow extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 20px;
      background-color: #f0f0f0;
      border-radius: 8px;
      text-align: center;
      max-width: 500px;
      margin: 50px auto;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    h2 {
      color: #333;
      margin-bottom: 15px;
    }
    p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    button {
      background-color: #00bcd4;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }
    button:hover {
      background-color: #0097a7;
    }
  `;

  render() {
    return html`
      <h2>Welcome to Karaoke MN!</h2>
      <p>
        This app helps you manage your karaoke sessions. As a KJ, you can create
        sessions and manage the queue. As a guest, you can join sessions and
        request songs.
      </p>
      <button @click=${this._completeOnboarding}>Got It!</button>
    `;
  }

  _completeOnboarding() {
    this.dispatchEvent(new CustomEvent('onboarding-complete'));
  }
}

customElements.define('onboarding-flow', OnboardingFlow); 