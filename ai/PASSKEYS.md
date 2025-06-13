# Passkey Implementation Rationale

The WebAuthn specification defines how passkey registration and authentication
requests should be formatted and verified on the client and server. While it is
possible to implement the specification manually, handling every detail of the
standard correctly is complex:

- Converting between base64url and binary formats
- Parsing attestation objects and verifying cryptographic signatures
- Managing authenticator counter values to prevent replay attacks
- Keeping up with updates to the spec and new authenticator behaviours

The [`@simplewebauthn/server`](https://github.com/MasterKale/SimpleWebAuthn) library
abstracts these details and provides battle‑tested utilities for verifying
registration and authentication responses. Using it ensures this project remains
aligned with the official specification without re‑implementing low‑level crypto
operations ourselves. It also reduces maintenance overhead, since community
updates to the library bring spec and browser compatibility fixes for free.

For these reasons the project depends on `@simplewebauthn/server` rather than a
custom implementation. The browser still uses the standard WebAuthn APIs, but
server‑side verification is delegated to a focused library to improve reliability
and security.
