# Karafun-like Frontend

## Introduction / Overview

This feature introduces a new user interface for Karaoke MN inspired by the Karafun
application. The goal is to provide an easy onboarding process for new users and a
visually appealing experience for both singers and the Karaoke Jockey (KJ). The
frontend will be built with Lit and will use YouTube as the primary source for
karaoke videos. Passkeys and QR codes will streamline the authentication and session
joining process.

## Goals

1. Smooth onboarding with passkey authentication and QR code session joining.
2. User interface resembles Karafun while remaining lightweight and mobile-friendly.
3. Reliable search that assists users in finding karaoke versions of songs on YouTube.
4. KJ can manage the queue with the existing "fairplay" algorithm.
5. Main screen clearly shows upcoming singers and session information.

## User Stories

- **Guest Login**: As a new guest, I want to log in quickly using a passkey so that I can start searching for songs right away.
- **Song Search**: As a guest, I want the search bar to automatically add the word "karaoke" to my query so I get relevant YouTube results.
- **Queue Management**: As a KJ, I want to view and control the queue so that performances run smoothly using the fairplay rules.
- **Main Screen**: As a guest, I want to see who is singing now and who is up next so I know when my turn is coming.
- **Admin Passkey**: As the host, I need to create my passkey via `/admin/<uuid>` so only I can access the control panel.

## Functional Requirements

1. The system must start the Lit application with `npm run start`.
2. When the server starts, it must output a UUID that is used at `/admin/<uuid>` for KJ passkey creation.
3. Visiting `/admin` after a passkey is created must require passkey authentication via WebAuthn.
4. Guests must be able to join a session via QR code or room code displayed on the main screen.
5. The UI must append "karaoke" to search queries before sending them to the YouTube search API.
6. The queue must follow the "fairplay" algorithm implemented in `fairPlay.js`.
7. The main screen must list at least the next five singers.
8. The app must load content from Firestore and inject custom content from Drupal when available.
9. The interface must be responsive for phones, tablets, and large screens.

## Non-Goals (Out of Scope)

- Advanced analytics or session statistics.
- Duet or multi-singer features.
- Offline usage beyond basic error messages.
- Profile/settings screens and themes (future work).

## Design Considerations

- Use a dark theme with vibrant accent colors similar to Karafun as suggested in `frontend-lit.md`.
- Components should follow the structure outlined in `frontend-lit.md`, including `karaoke-app`, `kj-dashboard`, `guest-song-search`, and others.
- Keep fonts large and controls easy to tap for a party environment.

## Technical Considerations

- Implement with Lit and Vite as already configured.
- Ensure routes `/`, `/admin`, `/admin/<uuid>` load the Lit app and appropriate components.
- Integrate existing Firestore functions and Drupal content API.

## Success Metrics

- Application starts and serves the frontend at `localhost:3000` with `npm run start`.
- KJ can successfully create and use a passkey via `/admin/<uuid>`.
- Guests can search and queue songs from YouTube with relevant results at least 80% of the time.
- Main screen accurately shows upcoming singers and updates within two seconds of queue changes.

## Open Questions

- Exact color palette and typography for the Karafun-inspired theme.
- Whether to support guest passkeys in addition to KJ passkeys.
- Handling of network errors or offline states for a smoother experience.
