# ADR-006: Dual Environment Development Strategy

**Status:** Accepted

**Context:**

The application needs backend services for session management, queue operations, and search functionality. There's a tension between development speed and production scalability. Several approaches were considered:

1. **Single Stack (Express Only)**: Express.js for both development and production
2. **Single Stack (Firebase Only)**: Firebase Functions and Firestore for all environments  
3. **Firebase with Emulators**: Firebase emulator suite for development, Firebase for production
4. **Dual Environment**: Express.js for development, Firebase for production
5. **Microservices**: Separate services for different functions

Key requirements:
- **Development Speed**: Fast iteration, easy debugging, minimal setup overhead
- **Production Parity**: Development environment should match production behavior
- **Cost Efficiency**: Minimize hosting costs during development
- **Deployment Simplicity**: Easy promotion from development to production
- **Real-time Testing**: Ability to test real-time features locally

**Decision:**

We will use Express.js for development and Firebase (Functions + Firestore) for production, with identical API endpoints across both environments.

**Alternatives Reconsidered:**

**Firebase Emulators vs Express.js:**

Firebase Emulator Suite would provide better production parity but was rejected because:

- **Setup Complexity**: Requires Firebase CLI, Java runtime, emulator configuration
- **Startup Time**: Emulators take 10-20 seconds to start vs Express's instant startup
- **Memory Usage**: Firestore emulator uses ~200MB RAM vs Express's minimal footprint
- **Debugging Experience**: Cloud Functions debugging is more complex than Express middleware
- **Network Dependencies**: Still requires internet for initial Firebase project setup
- **Learning Curve**: Developers need to understand Firebase emulator quirks and limitations

**Express.js Benefits for Development:**

- **Instant Startup**: `node server.js` starts immediately
- **Zero Dependencies**: No external services, Java runtimes, or CLI tools required
- **Simple Debugging**: Standard Node.js debugging tools work perfectly
- **Familiar Patterns**: Standard Express middleware and routing
- **Complete Control**: Full access to request/response cycle for debugging

**Implementation:**

**Development (Express.js + In-Memory Storage):**
```javascript
// server.js - Development API
const express = require('express');
const app = express();

// In-memory storage for fast development
let sessions = new Map();
let queue = [];

app.post('/sessions', (req, res) => {
  const session = createSession(req.body);
  sessions.set(session.id, session);
  res.json(session);
});
```

**Production (Firebase Functions + Firestore):**
```javascript
// functions/index.js - Production API
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.createSession = functions.https.onRequest(async (req, res) => {
  const session = createSession(req.body);
  await admin.firestore().collection('sessions').doc(session.id).set(session);
  res.json(session);
});
```

**API Compatibility Layer:**
Both environments implement identical endpoints:
- `POST /sessions` - Create session
- `GET /queue` - Get queue status  
- `POST /songs` - Add song to queue
- `GET /search` - Search YouTube

**Consequences:**

- **Pros:**
  - **Fast Development**: Express server starts instantly, no Firebase setup required
  - **Easy Debugging**: Full control over logging, middleware, and error handling in development
  - **Cost Efficient**: No Firebase usage during development, unlimited local testing
  - **Production Scalability**: Firebase auto-scales to handle traffic spikes
  - **Real-time Features**: Firestore provides native real-time listeners for production
  - **Managed Infrastructure**: No server maintenance in production
  - **Identical APIs**: Same endpoints work in both environments

- **Cons:**
  - **Dual Maintenance**: Must maintain two backend implementations
  - **Testing Complexity**: Need to test both development and production paths
  - **Feature Parity**: Must ensure both environments behave identically
  - **Deployment Complexity**: Different deployment processes for each environment
  - **Data Migration**: No automatic data transfer between environments
  - **Learning Curve**: Developers need to understand both Express and Firebase

**Environment Configuration:**

| Aspect | Development | Production |
|--------|-------------|------------|
| **Server** | Express.js (localhost:3000) | Firebase Functions |
| **Database** | In-memory Map/Array | Firestore |
| **Real-time** | HTTP polling | Firestore listeners |
| **Authentication** | Mock passkeys | Firebase Auth + WebAuthn |
| **File Storage** | Local filesystem | Firebase Storage |
| **Deployment** | `node server.js` | `firebase deploy` |

**Migration Strategy:**

Development data is ephemeral (in-memory), so there's no migration needed. Production sessions are persistent in Firestore. This separation is intentional - development sessions are for testing, production sessions are for real karaoke events.

**Testing Strategy:**

- **Unit Tests**: Test business logic shared between environments
- **Integration Tests**: Test against both Express and Firebase APIs
- **E2E Tests**: Use development environment for speed, production for final validation

**Related Decisions:**

- Links to ADR-003 (Firebase chosen for production real-time capabilities)
- Links to ADR-001 (WebAuthn works in both environments with different configurations)
- Supports overall architecture allowing Jeff's kiosk to scale from local testing to street deployment

**Trade-offs Acknowledged:**

The Express.js approach sacrifices some production parity for development velocity:

- **Real-time Features**: Firebase's real-time listeners aren't testable in development (uses HTTP polling instead)
- **Security Rules**: Firestore security rules can't be tested locally
- **Performance Characteristics**: Different behavior between in-memory storage and Firestore
- **Firebase-specific APIs**: Features like Firebase Auth integration require separate testing

**Future Considerations:**

This decision prioritizes immediate development productivity. As the application matures, consider:

- **Staging Environment**: Add Firebase emulators for staging/integration testing
- **Hybrid Approach**: Use emulators for specific real-time testing, Express for daily development
- **Migration Path**: If setup complexity becomes less critical, could migrate to Firebase emulators
- **Team Growth**: Larger teams might benefit more from production parity despite setup overhead

**Monitoring for Reconsideration:**

This decision should be reconsidered if:
- Real-time feature bugs become common due to development/production differences
- New team members struggle with dual environment complexity
- Firebase emulator startup time improves significantly
- Development setup becomes more automated (Docker, dev containers)