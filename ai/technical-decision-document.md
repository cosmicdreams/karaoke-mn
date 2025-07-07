# Karaoke MN - Technical Decision Document (TDD)
*Version 1.0*

---

## Overview

This Technical Decision Document captures the key architectural decisions, technology choices, and implementation strategies for Karaoke MN. It serves as a reference for developers to understand why specific technologies were chosen and how the system is designed to be resilient and maintainable.

---

## Core Technology Stack

### Frontend Framework: Lit Web Components

**Decision**: Use Lit for building modular, reusable web components
**Rationale**:
- **Native Web Standards**: Built on Web Components standards, ensuring longevity
- **Lightweight**: Minimal runtime overhead compared to React/Vue frameworks
- **Component Isolation**: True encapsulation with Shadow DOM
- **Framework Agnostic**: Components can be used in any framework or vanilla HTML
- **Modern Features**: Reactive properties, declarative templates, efficient updates

**Implementation**:
```javascript
// Component structure
export class GuestSongSearch extends LitElement {
  static properties = {
    searchQuery: { state: true },
    results: { state: true }
  };
  
  render() {
    return html`<div>...</div>`;
  }
}
```

### Build Tool: Vite

**Decision**: Use Vite for development and production builds
**Rationale**:
- **Fast Development**: ES modules, instant hot reload
- **Modern Defaults**: TypeScript, PostCSS, optimized bundling out-of-the-box
- **Lit Integration**: First-class support for web components
- **Production Optimization**: Code splitting, tree shaking, asset optimization

### Backend Architecture: Dual Environment Strategy

**Decision**: Express.js for development, Firebase for production
**Rationale**:

**Development (Express.js)**:
- **Rapid Iteration**: Fast restart, easy debugging
- **Local Development**: No external dependencies or API quotas
- **Full Control**: Custom middleware, logging, error handling
- **Cost-Free**: No hosting costs during development

**Production (Firebase)**:
- **Scalability**: Auto-scaling Functions and Firestore
- **Real-time Data**: Firestore real-time listeners for queue updates
- **Managed Infrastructure**: No server maintenance required
- **Global CDN**: Fast content delivery worldwide

### Database: Firestore (Production) / In-Memory (Development)

**Decision**: Firestore for production persistence, in-memory for development
**Rationale**:
- **Real-time Updates**: Native support for live queue synchronization
- **NoSQL Flexibility**: Easy schema evolution as features grow
- **Offline Support**: Built-in offline capabilities for PWA features
- **Security Rules**: Fine-grained access control
- **Development Speed**: In-memory storage eliminates setup complexity

---

## Authentication Architecture

### WebAuthn Passkeys for KJ Authentication

**Decision**: Use WebAuthn passkeys instead of traditional passwords
**Rationale**:
- **Security**: Phishing-resistant, no credential replay attacks
- **User Experience**: Biometric/PIN authentication, no passwords to remember
- **Modern Standard**: FIDO2/WebAuthn is the future of web authentication
- **Device Binding**: Credentials tied to specific devices for better security

**Implementation Strategy**:
```javascript
// Registration flow
const credential = await navigator.credentials.create({
  publicKey: {
    challenge: new Uint8Array(32),
    rp: { name: "Karaoke MN" },
    user: { id, name, displayName },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "required"
    }
  }
});
```

### Anonymous Guest Access with Device Binding

**Decision**: No guest authentication, use device UUIDs for continuity
**Rationale**:
- **Zero Friction**: No registration barriers for casual participants
- **Session Continuity**: Device UUID maintains favorites and queue position
- **Privacy**: No personal information collected or stored
- **Scalability**: Reduces auth overhead and complexity

---

## Content Strategy

### Primary Content Source: YouTube API

**Decision**: YouTube Data API v3 for song search and metadata
**Rationale**:
- **Vast Library**: Millions of karaoke videos available
- **Always Updated**: Community-driven content with latest songs
- **No Licensing Issues**: Content creators handle licensing
- **Familiar Interface**: Users already know YouTube's UX patterns

**Search Enhancement**:
```javascript
// Auto-append "karaoke" to improve results
const enhancedQuery = `${userQuery} karaoke`;
const results = await youtube.search.list({
  part: 'snippet',
  q: enhancedQuery,
  type: 'video',
  maxResults: 20
});
```

### Optional Content Curation: Drupal Headless CMS

**Decision**: Optional Drupal integration for KJ-curated content
**Rationale**:
- **Professional Control**: KJs can curate high-quality song lists
- **Graceful Degradation**: App functions fully without Drupal
- **Content Management**: Non-technical users can manage playlists
- **SEO Benefits**: Structured content for discoverability

**Failure Resilience**:
```javascript
// Drupal integration with fallback
try {
  const curatedContent = await fetch(`${DRUPAL_API}/content/popular`);
  if (curatedContent.ok) {
    return await curatedContent.json();
  }
} catch (error) {
  console.warn('Drupal unavailable, using YouTube-only mode');
}
// Continue with YouTube-only functionality
```

**Key Principle**: Drupal enhances the experience but never blocks core functionality.

---

## Playback Architecture

### YouTube Launch Strategy (No Embedding)

**Decision**: Launch YouTube videos in new windows instead of embedding
**Rationale**:
- **Copyright Compliance**: Avoids embedding restrictions and takedowns
- **Reliability**: No iframe blocking or regional restrictions
- **Performance**: Reduces app complexity and resource usage
- **User Familiarity**: Users know YouTube's native video controls

**Implementation**:
```javascript
function launchYouTube(videoId, fullscreen = false) {
  const url = `https://www.youtube.com/watch?v=${videoId}&autoplay=1`;
  const features = fullscreen 
    ? 'fullscreen=yes,width=1920,height=1080'
    : 'width=1280,height=720';
  
  window.open(url, '_blank', features);
}
```

### Manual Queue Management

**Decision**: KJ manually advances queue after each song
**Rationale**:
- **Human Control**: KJs can handle technical issues, crowd management
- **Flexibility**: Easy to skip intros, handle equipment problems
- **Reliability**: No complex video end detection across different browsers
- **Professional Feel**: KJ maintains session flow and timing

---

## State Management

### Fair Play Queue Algorithm

**Decision**: Implement custom queue algorithm with phase-based fairness
**Rationale**:
- **Prevents Gaming**: Users can't exploit the system for more turns
- **Encourages Participation**: First-time singers get priority
- **Social Harmony**: Fair rotation prevents conflicts
- **Scalable Logic**: Works with any number of participants

**Algorithm Overview**:
```javascript
// Phase 1: First-time singers (round-robin)
// Phase 2: Fair rotation based on songs sung
function orderQueue(queue, singers) {
  const phase1 = queue.filter(song => singers[song.deviceId].songsSung === 0);
  const phase2 = queue.filter(song => singers[song.deviceId].songsSung > 0);
  
  return [
    ...sortByJoinOrder(phase1),
    ...sortByFairRotation(phase2)
  ];
}
```

### Real-time Synchronization

**Decision**: Use Firestore real-time listeners for queue updates
**Rationale**:
- **Instant Updates**: All devices see changes within 500ms
- **Optimistic UI**: Local updates with server reconciliation
- **Offline Resilience**: Queued changes sync when connection returns
- **Scalability**: Firestore handles connection management automatically

---

## Data Architecture

### Session Document Structure

**Decision**: Single document per session with embedded queue
**Rationale**:
- **Atomic Updates**: Queue operations are transactional
- **Real-time Efficiency**: Single listener for all session data
- **Simplicity**: Easier to reason about and debug
- **Performance**: Fewer database reads/writes

```json
{
  "sessionId": "uuid",
  "kjId": "kj-auth-id", 
  "roomCode": "MUSIC-42",
  "queue": [
    {
      "id": "song-uuid",
      "videoId": "youtube-id",
      "singer": "Stage Name",
      "status": "waiting|singing|completed"
    }
  ],
  "singers": {
    "device-uuid": {
      "name": "Stage Name",
      "songsSung": 2,
      "phase": 1
    }
  }
}
```

### Device Identity Strategy

**Decision**: UUID in localStorage for guest identity
**Rationale**:
- **Privacy**: No personal information stored
- **Persistence**: Survives browser restarts
- **Simplicity**: No server-side user management
- **Functionality**: Enables favorites, queue position tracking

```javascript
// Device identity management
function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem('karaoke-mn-deviceId');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('karaoke-mn-deviceId', deviceId);
  }
  return deviceId;
}
```

---

## UI/UX Architecture

### Design System: CSS Custom Properties

**Decision**: Use CSS custom properties instead of CSS-in-JS or external libraries
**Rationale**:
- **Performance**: No runtime style computation
- **Native Support**: Works across all browsers
- **Themeable**: Easy to modify colors, spacing globally
- **Maintainable**: Single source of truth for design tokens

```css
:root {
  --bg-color: #111111;
  --surface-color: #222222;
  --text-color: #ffffff;
  --accent-color: #ff4081;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
}
```

### Responsive Strategy: Mobile-First

**Decision**: Design for mobile first, enhance for larger screens
**Rationale**:
- **Primary Use Case**: Guests primarily use smartphones
- **Progressive Enhancement**: Larger screens get additional features
- **Performance**: Smaller initial payload for mobile users
- **Touch Optimization**: Touch targets and gestures prioritized

**Breakpoint Strategy**:
```css
/* Mobile: ≤480px (default) */
/* Tablet: 481-768px */
@media (min-width: 481px) { ... }
/* Desktop/TV: ≥1280px */
@media (min-width: 1280px) { ... }
```

---

## Security Architecture

### Input Sanitization

**Decision**: Sanitize all user inputs, especially Stage Names and search queries
**Rationale**:
- **XSS Prevention**: Prevent script injection
- **Display Safety**: Ensure proper rendering across devices
- **Database Safety**: Prevent NoSQL injection

```javascript
function sanitizeStageName(name) {
  return name
    .replace(/[<>]/g, '') // Remove HTML brackets
    .substring(0, 30)     // Limit length
    .trim();              // Remove whitespace
}
```

### Content Security Policy

**Decision**: Strict CSP with YouTube domain allowlist
**Rationale**:
- **XSS Protection**: Prevent unauthorized script execution
- **Data Exfiltration**: Control external resource loading
- **YouTube Integration**: Allow legitimate video launching

```http
Content-Security-Policy: default-src 'self'; 
  script-src 'self' 'unsafe-inline'; 
  connect-src 'self' https://www.googleapis.com;
  frame-ancestors 'none';
```

---

## Error Handling & Resilience

### Graceful Degradation Strategy

**Decision**: Core functionality works even when external services fail
**Rationale**:
- **Reliability**: Users can always participate in basic karaoke
- **User Experience**: No complete failures, just reduced features
- **Business Continuity**: Jeff's kiosk keeps running regardless

**Failure Scenarios & Responses**:

| Component Failure | System Response |
|------------------|-----------------|
| YouTube API down | Show cached/fallback content, allow manual URL entry |
| Drupal unavailable | Continue with YouTube-only mode |
| Firestore offline | Use local state, sync when restored |
| Network intermittent | Show network status, enable offline queue building |

### Error Boundaries & Logging

**Decision**: Comprehensive error tracking with user-friendly fallbacks
**Rationale**:
- **Debugging**: Detailed logs for development and monitoring
- **User Experience**: Friendly error messages with recovery suggestions
- **System Health**: Proactive monitoring of failure patterns

```javascript
// Error boundary pattern
class ComponentErrorBoundary extends LitElement {
  constructor() {
    super();
    this.hasError = false;
    this.errorMessage = '';
  }
  
  updated(changedProperties) {
    try {
      // Component logic
    } catch (error) {
      this.hasError = true;
      this.errorMessage = 'Something went wrong. Please refresh the page.';
      console.error('Component error:', error);
    }
  }
}
```

---

## Performance Architecture

### Loading Strategy: Progressive Enhancement

**Decision**: Load core features first, enhance with additional capabilities
**Rationale**:
- **Perceived Performance**: Users can start participating immediately
- **Network Resilience**: Works on slow connections
- **Battery Efficiency**: Reduces initial computational load

**Loading Priority**:
1. **Critical**: QR code scanning, basic search, queue display
2. **Important**: Video preview, favorites, enhanced search
3. **Enhancement**: Analytics, advanced features, optimizations

### Caching Strategy: Smart Resource Management

**Decision**: Cache static assets aggressively, cache API responses conservatively
**Rationale**:
- **Performance**: Faster subsequent loads
- **Bandwidth**: Reduce mobile data usage
- **Freshness**: Ensure live queue data is always current

```javascript
// API response caching
const CACHE_DURATION = {
  search: 5 * 60 * 1000,    // 5 minutes
  queue: 0,                 // Never cache (real-time)
  content: 30 * 60 * 1000   // 30 minutes
};
```

---

## Testing Strategy

### Multi-Layer Testing Approach

**Decision**: Unit tests for logic, component tests for UI, E2E for workflows
**Rationale**:
- **Reliability**: Each layer catches different types of bugs
- **Speed**: Fast unit tests for rapid feedback
- **Confidence**: E2E tests verify real user scenarios

**Testing Tools**:
- **Unit Tests**: Vitest for fast JavaScript testing
- **Component Tests**: Web Test Runner for Lit components
- **E2E Tests**: Playwright for cross-browser automation
- **Visual Tests**: Storybook for component development

### Test Environment Strategy

**Decision**: Use Firebase emulators for consistent testing environment
**Rationale**:
- **Reproducibility**: Same data state for every test run
- **Speed**: Local emulators are faster than remote services
- **Cost**: No Firebase usage charges during testing
- **Isolation**: Tests don't interfere with production data

---

## Deployment Architecture

### Environment Strategy: Progressive Promotion

**Decision**: Development → Staging → Production pipeline with Firebase
**Rationale**:
- **Quality Gates**: Each environment validates different aspects
- **Risk Mitigation**: Issues caught before production
- **Rollback Capability**: Easy reversion if problems occur

**Environment Configuration**:

| Environment | Backend | Database | Authentication |
|------------|---------|----------|----------------|
| Development | Express | In-memory | Mock passkeys |
| Staging | Firebase Functions | Firestore emulator | Test passkeys |
| Production | Firebase Functions | Firestore | Real passkeys |

### Monitoring & Observability

**Decision**: Comprehensive monitoring with Firebase and custom metrics
**Rationale**:
- **Performance Tracking**: Identify bottlenecks and optimization opportunities
- **Error Detection**: Proactive issue identification
- **User Experience**: Monitor real user success rates
- **Business Metrics**: Track Jeff's kiosk success metrics

**Key Metrics**:
- **Technical**: Response times, error rates, uptime
- **User Experience**: Queue participation rate, song completion rate
- **Business**: Session creation rate, repeat usage, user satisfaction

---

## Future Architecture Considerations

### Scalability Preparedness

**Decision**: Design for current needs while preparing for scale
**Rationale**:
- **Avoid Over-engineering**: Don't build what isn't needed yet
- **Enable Growth**: Architecture can evolve as usage grows
- **Cost Efficiency**: Pay for what you use, scale as needed

**Scaling Triggers & Responses**:

| Metric | Threshold | Response |
|--------|-----------|----------|
| Concurrent Sessions | >100 | Implement Redis caching |
| Database Reads | >10k/hour | Add read replicas |
| API Response Time | >500ms | Implement CDN |
| User Growth | >1000 KJs | Consider microservices |

### Integration Readiness

**Decision**: API-first design enables future integrations
**Rationale**:
- **Ecosystem Growth**: Third-party tools can integrate
- **Hardware Compatibility**: Professional karaoke equipment integration
- **Service Extensions**: Additional content providers or features

**Integration Points**:
- **REST APIs**: Standard endpoints for external access
- **WebHooks**: Real-time event notifications
- **SSO**: Future enterprise authentication
- **Hardware APIs**: Professional audio/video equipment

---

## Conclusion

This Technical Decision Document captures the architectural thinking behind Karaoke MN's design. Every decision prioritizes Jeff's use case of running a successful pop-up karaoke kiosk while building a foundation for future growth and enhancement.

The architecture emphasizes:
- **Resilience**: Graceful degradation when components fail
- **Performance**: Fast, responsive experience on mobile devices
- **Simplicity**: Easy to understand, maintain, and extend
- **User Focus**: Technical decisions driven by real user needs

These technical decisions create a robust foundation that can evolve as the product grows while maintaining the core value proposition of friction-free karaoke participation.

---

*Last Updated: 2024-07-04*  
*Document Version: 1.0*  
*Status: Current Architecture*