# Composite Product Requirements Document (PRD) for Karaoke MN

This composite PRD consolidates the vision, goals, user stories, functional requirements,
and system design for the Karaoke MN application into a single reference document.
It is intended for junior developers to understand the feature scope and to guide implementation.

## Introduction / Overview

Karaoke MN is a free, accessible, and feature‑rich karaoke application that leverages YouTube’s
extensive karaoke video library. It provides an open, shareable alternative to commercial
solutions by allowing guests to control song search and queue placement from their own devices,
while the Karaoke Jockey (KJ) retains overall session management and override control.

Key problems addressed:
- High cost and complexity of traditional karaoke hardware/software
- Limited song catalogs in paid services
- Cumbersome queue management and social exploits

## Goals

**User Goals**
- Guests can join a session, pick a singer name, search for songs, and add to the queue in under 60 seconds.
- Everyone sees a clear, fair queue order so no one is sidelined.

**Product Goals**
- Provide robust default queue management (Fair Play algorithm) with KJ override controls.
- Secure, passwordless KJ authentication using WebAuthn passkeys.

**Technical Goals**
- Persist session state and singer profiles in Firestore for reliability and restoration.
- Integrate curated content from Headless Drupal when available.

**Business Goals**
- Drive community adoption through a free, high‑quality experience.

## User Stories

- **Guest Login**: As a guest, I want to join anonymously (no account) so I can quickly participate.
- **Passkey Authentication**: As the KJ, I want to register and log in via passkey so only I control the session.
- **Song Search**: As a guest, I want the search bar to append “karaoke” to my query so I get relevant results.
- **Video Preview**: As a guest, I want to preview a video before queuing it so I ensure it works.
- **Queue Limit**: As a guest, I want to add up to 3 songs so I get fair turn-taking.
- **Fair Queue**: As a guest, I want the queue to interleave first-timers before looping back fairly.
- **Queue Control**: As the KJ, I want to reorder, skip, pause, or remove songs so the session flows smoothly.
- **Main Screen Display**: As the audience, I want to see who is singing now and who is up next.

## Functional Requirements

1. **Passkey Authentication**: The KJ must register and authenticate via WebAuthn passkeys.
2. **Session Creation**: The KJ can start a session that generates a human‑readable room code and QR code.
3. **Guest Join**: Guests use the room code or QR code to join anonymously, and enter a singer name tied to their device.
4. **Song Search & Link Submission**: Guests can search YouTube (query auto‑appends “karaoke”) or paste a YouTube URL.
5. **Video Preview**: The system must allow guests to preview a video before adding it to the queue.
6. **Queue Limit Enforcement**: Guests may have at most 3 pending songs; attempts beyond this are blocked on the frontend.
7. **Fair Play Algorithm**: The shared queue must implement the Phase 1/Phase 2 interleaving logic (see fairPlay.js).
8. **Main Screen Playback**: Embed a YouTube player on the “TV” screen and display the next 5–10 singers.
9. **Persistent Session State**: Queue state, singer profiles, and playback errors must be stored in Firestore and reloadable.
10. **Playback Error Reporting**: Record playback failures in Firestore via an `error` field when the YouTube API reports an issue.
11. **KJ Controls**: Provide drag‑and‑drop reordering, skip, pause, and removal controls for the KJ dashboard.
12. **Responsive UI**: All interface layouts must adapt to phones, tablets, and large screens.

## Non‑Goals (Out of Scope)

- Advanced analytics or session statistics beyond basic popularity metrics.
- Duet or multi‑singer collaboration features.
- Offline functionality beyond simple error banners.
- Profile/settings screens and theming (reserved for future versions).

## UI Component Architecture

The frontend is built with Lit and structured into modular, reusable web components:

**High‑Level Container**
- `karaoke-app`: Root component handling routing, app state, and Firebase initialization.

**KJ Components**
- `kj-login`: WebAuthn passkey registration/login UI.
- `kj-dashboard`, `kj-session-creator`, `kj-control-panel`, `kj-queue-item`, `kj-main-screen-preview`.

**Guest Components**
- `guest-join-session`, `guest-song-search` (with `search-bar`, `search-results-list`, `search-result-item`), `video-preview-modal`, `guest-queue-view`, `guest-queued-song-item`.

**Main Screen Components**
- `main-screen-view`, `youtube-player`, `main-queue-display`/`main-queue-item`, `session-info-display`, `qr-code-display`.

**Shared Utilities**
- `qr-code-display`, `loading-spinner`, `modal-dialog`, `toast-notification`, `button-component`, `input-field`, `error-message`, `user-avatar`, `app-theme`, `layout-container`.

## Technical Considerations

- Build with Lit + Vite; ensure Express serves Vite’s output (`public/dist`) and unknown paths fall back to `index.html`.
- Integrate Firestore for real‑time session data; use Firebase Cloud Function `startSession` to fetch Drupal content.
- Use Headless Drupal JSON:API for KJ‑curated song lists (if available).

## API & Data Contracts

**Firestore Model**
```json
// sessions/{sessionID}
{
  "kjId": "string",
  "status": "string",
  "nowPlaying": {/* Song Object */} | null,
  "queue": [/* Song Object */],
  "singers": { "deviceId_abc": {"name":"Alice","songsSung":2} },
  "preparedContent": {/* Drupal content */}
}
```

**REST Endpoints (Dev Server)**
- `POST /sessions` – create session (returns `{id,code,qrCode}`)
- `POST /sessions/:code/join` – join session (returns `{sessionId,singerId,deviceId}`)
- `GET /search?q=` – karaoke search results
- `GET /preview?videoId=` – video metadata
- `POST /songs` – add to queue
- `DELETE /songs/:id` – remove song
- `GET /queue` – fetch current queue
- Additional queue/control endpoints: `/songs/:id/error`, `/songs/:id/complete`, `/songs/reorder`, `/sessions/pause`, `/phase2`

## Success Metrics

- Frontend serves at `localhost:3000` with `npm run start` and Express routes correctly.
- KJ can register/login with passkey via `/admin/<uuid>`.
- Guests find relevant karaoke results ≥80% of the time.
- Main screen updates queue changes within 2 seconds.

## Open Questions

- Final color palette and typography for the Karafun‑inspired theme.
- Guest passkeys vs. anonymous join trade‑offs.
- Best strategy for handling offline/network errors gracefully.