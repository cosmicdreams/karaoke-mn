# Karaoke MN - Product Requirements Document
*Version 3.0 - Final Consolidated PRD*

---

## Executive Summary

Karaoke MN is a free, accessible karaoke application that leverages YouTube's extensive video library to provide a modern alternative to expensive commercial karaoke solutions. Built with Lit web components and Firebase, it enables guests to control song search and queue management from their smartphones while giving the Karaoke Jockey (KJ) full session oversight through WebAuthn passkey authentication.

### Primary User Story

**Jeff's Pop-up Karaoke Kiosk**

Jeff operates a pop-up karaoke kiosk that he sets up on busy streets and at events. His biggest challenge is getting people to quickly participate without friction - he needs:

- **Instant Participation**: People should be able to add songs to the queue with minimal effort and no app downloads
- **Zero Install**: Guests use their existing smartphones and browsers 
- **Quick Song Selection**: Fast, relevant search results so people don't lose interest
- **Seamless Handoff**: When it's someone's turn, Jeff (the KJ) can instantly launch their song on the main screen
- **Automatic Flow**: After each song ends, the queue automatically updates and the next singer is ready

*This is exactly what Karaoke MN delivers - guests scan a QR code, search for songs on their phones, and Jeff manages the flow from his KJ dashboard with one-click YouTube launches.*

**Key Value Propositions:**
- **Free & Open**: No subscription fees or proprietary hardware required
- **Vast Song Library**: Access to YouTube's millions of karaoke videos
- **Smart Queue Management**: Fair Play algorithm prevents queue gaming
- **Mobile-First**: Guests use their own devices as controllers
- **Professional Control**: KJ maintains full session management authority

---

## Problem Statement

Traditional karaoke solutions suffer from significant barriers to adoption:

1. **High Cost**: Commercial systems cost $500-2000+ for software/hardware
2. **Limited Catalogs**: Proprietary song databases with licensing constraints
3. **Complex Setup**: Dedicated hardware, dongles, and technical configuration
4. **Poor Queue Management**: Manual systems prone to social manipulation
5. **Outdated UX**: Legacy interfaces that don't leverage modern smartphone capabilities

---

## User Personas & Goals

### Primary Personas

**The Karaoke Jockey (KJ)**
- **Profile**: Event host, bar owner, party organizer
- **Goals**: 
  - Quick session setup (<2 minutes)
  - Maintain control over song flow and timing
  - Provide fair, enjoyable experience for all guests
- **Pain Points**: Queue disputes, technical difficulties, limited song selection

**The Enthusiastic Guest**
- **Profile**: Regular karaoke participant, social and outgoing
- **Goals**:
  - Find and queue favorite songs quickly
  - Preview songs before committing
  - See fair queue order and wait times
- **Pain Points**: Unfamiliar interfaces, song unavailability, unclear queue status

**The Casual Participant**
- **Profile**: Occasional singer, less tech-savvy
- **Goals**:
  - Join session without creating accounts
  - Simple song search and selection
  - Clear indication of turn order
- **Pain Points**: Complex registration, intimidating interfaces

### User Success Metrics

- **KJ**: 100% passkey setup completion in <30 seconds
- **All Users**: Song search results delivered in <300ms
- **Guests**: 85% queue at least one song per session
- **Mobile Usability**: 100% compliance with accessibility standards

---

## Core Features & Requirements

### 1. Authentication & Session Management

**KJ Authentication (WebAuthn Passkeys)**
- Passwordless registration and login using device biometrics/PIN
- Session creation generates human-readable room codes (e.g., "MUSIC-42")
- QR code generation for easy guest joining
- Session persistence across browser refreshes

**Guest Access (Anonymous Device Binding)**
- No account registration required
- Device UUID stored in localStorage for session continuity
- Singer name (Stage Name) tied to device for queue display
- Automatic reconnection to existing sessions

### 2. Song Search & Discovery

**YouTube Integration**
- Auto-append "karaoke" to search queries for relevant results
- Support for direct YouTube URL pasting and video ID extraction
- Song metadata display (title, artist, duration, thumbnail)
- Real-time search with debounced API calls

**Content Curation (Optional)**
- Drupal headless CMS integration for KJ-curated playlists
- Popular songs and trending karaoke picks
- Genre-based browsing (80s, 90s, Current Hits, etc.)

**Video Preview System**
- Preview videos before adding to queue
- Thumbnail and basic metadata display
- Direct YouTube preview in modal/popup

### 3. Fair Play Queue Algorithm

**Phase-Based Queue Management**
```
Phase 1: First-time singers (round-robin)
Phase 2: Fair rotation of all participants
```

**Queue Rules**
- Maximum 3 pending songs per guest
- Front-end enforcement prevents over-queuing
- Queue position transparency for all users
- Automatic progression between phases

**KJ Override Controls**
- Drag-and-drop queue reordering
- Skip, pause, and remove song capabilities
- Manual queue advancement controls
- Emergency queue reset functionality

### 4. Playback & Display System

**YouTube Launch Approach** (No Embedding)
- Launch YouTube videos in new windows/tabs
- Full-screen and windowed playback options
- Manual KJ control for song progression
- Bypass embedding restrictions and copyright blocks

**Main Screen Display**
- Current song information (title, artist, singer)
- "Now Playing" status with live indicators
- Next 5-10 queue positions displayed
- Session info (room code, QR code) always visible

**Queue Status Display**
- Real-time queue updates across all devices
- Singer names and song titles
- Position indicators and estimated wait times
- Visual distinction for current and upcoming songs

### 5. Device & Platform Support

**Responsive Design Framework**
- **Mobile** (≤480px): Optimized touch interface
- **Tablet** (480-768px): Enhanced layout utilization
- **Desktop/TV** (≥1280px): Full feature access and control

**Progressive Web App Features**
- Offline error handling with graceful degradation
- Network status indicators and retry mechanisms
- Device orientation support (portrait/landscape)

---

## Technical Architecture

### Frontend Stack
- **Framework**: Lit web components for modular, reusable UI
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: CSS custom properties with design token system
- **State Management**: Lit reactive properties with event-driven updates

### Backend & Data
- **Development**: Express.js server with in-memory data
- **Production**: Firebase Functions + Firestore for real-time data
- **Authentication**: Firebase Auth integrated with WebAuthn
- **External APIs**: YouTube Data API v3, optional Drupal JSON:API

### Component Architecture

**Application Container**
```
karaoke-app (root router)
├── kj-view (KJ interface)
│   ├── kj-login (passkey auth)
│   └── kj-dashboard
│       ├── kj-session-creator
│       ├── kj-control-panel  
│       └── kj-catalog-manager
├── guest-view (guest interface)
│   ├── guest-join-session
│   ├── guest-song-search
│   ├── guest-queue-view
│   └── settings-profile
└── main-screen-view (display screen)
    ├── session-info-display
    ├── qr-code-display
    └── main-queue-display
```

**Shared Component Library**
- Form components: `login-form`, `search-bar`, `input-field`
- UI components: `modal-dialog`, `toast-notification`, `loading-spinner`
- Display components: `user-avatar`, `button-component`, `error-banner`

### Data Models

**Session Document (Firestore)**
```json
{
  "id": "session-uuid",
  "kjId": "kj-auth-id",
  "roomCode": "MUSIC-42",
  "status": "active|paused|ended",
  "createdAt": "2024-timestamp",
  "nowPlaying": {
    "songId": "song-uuid",
    "videoId": "youtube-video-id",
    "title": "Song Title",
    "artist": "Artist Name",
    "singer": "Stage Name",
    "startedAt": "timestamp",
    "status": "singing"
  },
  "queue": [
    {
      "id": "song-uuid",
      "videoId": "youtube-video-id", 
      "title": "Song Title",
      "artist": "Artist Name",
      "singer": "Stage Name",
      "deviceId": "guest-device-uuid",
      "addedAt": "timestamp",
      "status": "waiting|singing|completed|skipped",
      "queuePosition": 1
    }
  ],
  "singers": {
    "device-uuid-1": {
      "name": "Stage Name",
      "songsSung": 2,
      "songsQueued": 1,
      "joinedAt": "timestamp",
      "phase": 1
    }
  },
  "settings": {
    "maxSongsPerSinger": 3,
    "allowDuplicates": false,
    "autoAdvance": false
  }
}
```

**Singer Profile (Guest Device)**
```json
{
  "deviceId": "uuid",
  "stageName": "User Stage Name",
  "favorites": [
    {
      "videoId": "youtube-id",
      "title": "Song Title",
      "artist": "Artist Name",
      "addedAt": "timestamp"
    }
  ],
  "sungTonight": ["song-id-1", "song-id-2"],
  "sessionHistory": ["session-id-1", "session-id-2"]
}
```

### API Endpoints

**Development Server (Express)**
```
Authentication:
POST   /auth/register/options     # Passkey registration start
POST   /auth/register/verify      # Passkey registration complete
POST   /auth/login/options        # Passkey login start  
POST   /auth/login/verify         # Passkey login complete
GET    /auth/session              # Check login status

Session Management:
POST   /sessions                  # Create new session
POST   /sessions/:code/join       # Join session with room code
GET    /sessions/:id              # Get session details
PUT    /sessions/:id              # Update session settings
DELETE /sessions/:id              # End session

Queue Operations:
GET    /queue                     # Get current queue
POST   /songs                     # Add song to queue
DELETE /songs/:id                 # Remove song from queue
POST   /songs/:id/complete        # Mark song as completed
POST   /songs/:id/skip            # Skip current song
POST   /queue/advance             # Advance to next song
PUT    /queue/reorder             # Reorder queue positions

Search & Content:
GET    /search?q=query            # YouTube karaoke search
GET    /preview?videoId=id        # Video metadata
GET    /content/popular           # Popular songs (Drupal)
GET    /content/categories        # Song categories (Drupal)

User Profiles:
GET    /singers/:deviceId         # Get singer profile
PUT    /singers/:deviceId         # Update singer profile
```

**Production (Firebase Functions)**
All Express endpoints mapped to Firebase Functions with Firestore persistence.

---

## User Experience Flows

### Jeff's Kiosk Setup Flow
1. Jeff arrives at his street location and sets up equipment
2. Opens `/admin/<uuid>` on his tablet/laptop
3. Authenticates via WebAuthn passkey (one-time setup)
4. Creates new session → instant room code and QR code generation
5. Displays QR code prominently for passersby to scan
6. Main screen shows "Scan to Add Songs" with live queue

### Street Passerby Participation Flow
1. **Zero Friction Entry**: Person scans QR code with phone camera
2. **Instant Access**: Browser opens directly to song search (no app install)
3. **Quick Identity**: Enters a fun Stage Name (stored to their device)
4. **Fast Discovery**: Searches for songs with auto-"karaoke" enhancement
5. **Easy Selection**: Previews and adds songs with one tap
6. **Live Feedback**: Sees their position in the real-time queue
7. **Passive Waiting**: Can walk away and return when their turn approaches

### Jeff's Kiosk Management Flow
1. **Queue Monitoring**: Watches live queue on KJ dashboard
2. **Song Launch**: When someone's turn arrives, one-click launches YouTube video
3. **Crowd Management**: Main screen shows current singer and next few in line
4. **Flow Control**: Marks songs complete when finished, queue auto-advances
5. **Override Control**: Can skip, reorder, or remove songs as needed
6. **Continuous Operation**: Seamless cycle keeps the kiosk running smoothly

### Real-World Kiosk Experience
```
🎤 Jeff's Kiosk is Live!
   ↓ QR Code displayed
👥 Passersby scan with phones
   ↓ Add songs instantly  
🎵 Queue builds automatically
   ↓ Fair rotation algorithm
🎬 Jeff launches songs one-click
   ↓ YouTube plays on main screen
🔄 Auto-advance to next singer
   ↓ Continuous entertainment
```

---

## Design System & UI Guidelines

### Visual Design
- **Color Palette**: Dark theme with vibrant accent colors
  - Background: `#111111` (primary), `#222222` (surfaces)
  - Text: `#ffffff` (primary), `rgba(255,255,255,0.7)` (secondary)
  - Accent: `#ff4081` (primary actions), `#8b5cf6` (secondary)
  - Status: `#10b981` (success), `#f59e0b` (warning), `#ef4444` (error)

- **Typography**: System font stack with clear hierarchy
  - Headers: Bold weights for prominence
  - Body: Regular weight for readability
  - Labels: Medium weight for form elements

- **Spacing System**: Consistent spacing scale
  - Base unit: 1rem (16px)
  - Scale: 0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 3rem

### Component Guidelines
- **Cards**: Rounded corners (12px), subtle borders and shadows
- **Buttons**: Clear hierarchy (primary, secondary, icon-only)
- **Forms**: Accessible labels, validation states, focus indicators
- **Modals**: Backdrop blur, escape key support, focus trapping

### Accessibility Standards
- **WCAG AA Compliance**: Color contrast, keyboard navigation, screen readers
- **Focus Management**: Clear focus indicators, logical tab order
- **Responsive Design**: Touch targets ≥44px, readable text at all scales
- **Error Handling**: Clear error messages, recovery instructions

---

## Performance Requirements

### Response Time Targets
- Initial page load: <2 seconds on 3G connection
- Search results: <300ms for YouTube API calls
- Queue updates: <500ms propagation across devices
- Authentication: <1 second for passkey operations

### Scalability Targets
- Concurrent sessions: 100+ active sessions
- Session size: Up to 50 guests per session
- Queue length: Up to 200 songs in queue
- Data sync: Real-time updates for all connected devices

### Browser Support
- **Primary**: Chrome 90+, Safari 14+, Firefox 88+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: WebAuthn, localStorage, ES2020, CSS Grid/Flexbox

---

## Security & Privacy

### Authentication Security
- WebAuthn passkey implementation following FIDO2 standards
- Device-bound credentials, no password storage
- Session tokens with appropriate expiration
- HTTPS enforcement in production

### Data Privacy
- Anonymous guest participation (no PII collection)
- Device UUIDs only for session continuity
- No persistent storage of personal information
- YouTube API compliance with terms of service

### Content Security
- YouTube video launching in separate context
- No embedded content to avoid XSS risks
- Sanitized user inputs (Stage Names, search queries)
- Rate limiting on API endpoints

---

## Testing Strategy

### Automated Testing
- **Unit Tests**: All utility functions and business logic
- **Component Tests**: Lit component rendering and interactions
- **Integration Tests**: API endpoints and data flow
- **E2E Tests**: Complete user workflows with Playwright

### Testing Tools & Framework
- **Test Runner**: Vitest for unit and integration tests
- **Component Testing**: Web Test Runner for Lit components
- **E2E Testing**: Playwright for browser automation
- **Visual Testing**: Storybook for component development

### Quality Gates
- 90%+ code coverage for core business logic
- All E2E scenarios passing for release deployment
- Accessibility testing with axe-core
- Performance testing with Lighthouse (90+ scores)

---

## Deployment & Operations

### Development Environment
```bash
npm install           # Install dependencies
npm run dev          # Start Vite dev server (frontend)
node server.js       # Start Express API server
npm run storybook    # Component development
npm test            # Run test suite
```

### Build & Deploy Process
```bash
npm run build        # Vite production build
npm run preview      # Test production build
npm run test:e2e     # E2E testing
# Deploy to Firebase Hosting + Functions
```

### Environment Configuration
- Development: Express server with in-memory data
- Staging: Firebase with Firestore emulator
- Production: Full Firebase stack with real Firestore

### Monitoring & Analytics
- Error tracking with Firebase Crashlytics
- Performance monitoring with Firebase Performance
- User analytics via Firebase Analytics
- Custom metrics for queue algorithm effectiveness

---

## Success Metrics & KPIs

### User Engagement
- **Session Creation Rate**: KJs creating sessions successfully
- **Guest Participation Rate**: % of QR code scans that result in song queuing
- **Song Queue Completion**: % of queued songs actually sung
- **Return Usage**: Repeat KJ and guest participation

### Technical Performance
- **Uptime**: 99.9% availability target
- **Response Times**: API calls <300ms, UI updates <500ms
- **Error Rates**: <1% failure rate for core functions
- **Device Compatibility**: >95% success rate across target browsers

### Business Impact
- **Adoption Growth**: Monthly active KJ accounts
- **Session Volume**: Total sessions created per month
- **Community Engagement**: User feedback and feature requests
- **Cost Efficiency**: Hosting costs vs. comparable commercial solutions

---

## Future Roadmap & Extensions

### Phase 2 Features (Future Versions)
- **Advanced Profiles**: Persistent singer accounts with stats
- **Social Features**: Friend lists, song recommendations
- **Enhanced Content**: Lyrics display, song previews with audio
- **Analytics Dashboard**: Session insights for KJs

### Technical Enhancements
- **Offline Support**: Progressive Web App with offline queue
- **Real-time Collaboration**: Live chat, reactions during songs
- **Advanced Queue**: Custom algorithms, theme nights, tournaments
- **Integration APIs**: Third-party karaoke hardware compatibility

### Scalability Considerations
- **Multi-region Deployment**: Geographic distribution for performance
- **Caching Layer**: Redis for frequently accessed data
- **CDN Integration**: Static asset optimization
- **Database Optimization**: Query performance and indexing strategies

---

## Conclusion

Karaoke MN represents a comprehensive solution to modernize karaoke experiences by leveraging web technologies, smartphone ubiquity, and YouTube's vast content library. The application successfully balances ease of use for casual participants with professional control features for session management, all while maintaining fair, algorithmic queue management that prevents social gaming.

The technical architecture supports both rapid development iteration and production scalability, with a clear path from the current Express-based development environment to a fully distributed Firebase production deployment. The emphasis on accessibility, mobile-first design, and passwordless authentication positions the application for broad adoption across diverse user groups and venue types.

This PRD serves as the definitive reference for all development, testing, and deployment activities, ensuring consistent implementation of the product vision while providing flexibility for future enhancements and community-driven improvements.

---

*Last Updated: 2024-07-04*  
*Document Version: 3.0*  
*Status: Implementation Complete*