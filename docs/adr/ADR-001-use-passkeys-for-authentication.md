# ADR-001: Use Passkeys for Authentication

**Status:** Accepted

**Context:**

The application requires a secure and low-friction way for KJs (Karaoke Jockeys) to authenticate and manage sessions. Guests participate anonymously without accounts. Traditional password-based systems add friction (forgotten passwords, sign-up forms) and security risks for KJs who need reliable access to session management.

**Decision:**

We will use WebAuthn (Passkeys) as the primary method for user authentication. This allows users to sign in using their device's built-in biometrics (fingerprint, face ID) or security keys. The `kjAuth.js` module will encapsulate this logic.

**Implementation:**

We use the `@simplewebauthn/server` library rather than implementing WebAuthn manually because:

- **Complexity**: WebAuthn requires handling base64url conversions, parsing attestation objects, verifying cryptographic signatures, and managing authenticator counter values
- **Security**: Community-tested library reduces risk of implementation vulnerabilities
- **Maintenance**: Library updates provide spec compliance and browser compatibility fixes
- **Standards Compliance**: Ensures alignment with official WebAuthn specification

The browser uses standard WebAuthn APIs, but server-side verification is delegated to the focused library.

**Consequences:**

- **Pros:**
  - Greatly improved user experience; no passwords to remember.
  - Higher security; resistant to phishing.
  - Simplifies the login flow for returning users.
  - Reliable implementation through battle-tested library.
  - Automatic updates to WebAuthn spec changes.
- **Cons:**
  - Newer technology; may be unfamiliar to some users.
  - Requires careful handling of browser compatibility and error states.
  - Users need to understand that their "account" is tied to the passkey on their device.
  - Dependency on external library for core authentication functionality.
