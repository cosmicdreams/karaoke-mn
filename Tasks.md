# Tasks

The following tasks are derived from the features and implementation details described in **PRD.md**.

## Core Features (MVP)

- Implement passkey-based authentication for the KJ account.
- Allow the KJ to create a new session with a unique room code and QR code.
- Enable guests to join anonymously and bind their chosen singer name to their device.
- Provide YouTube search with the "karaoke" term automatically appended.
- Support direct YouTube link submission.
- Show a video preview before adding a song to the queue.
- Add selected songs to a shared queue, limiting each guest to three pending songs.
- Display the video player and upcoming singer list on the main "TV" screen.
- Implement a queue logic that interleaves singers fairly ("Fair Play" algorithm) with Phase 1 and Phase 2 behaviour.
- Build a KJ control panel with options to set a timed first round, reorder the queue, remove singers, replace videos, skip to the next singer, and pause the session.

## Technical Components

- Build the frontend as a single-page application (SPA).
- Use Firebase for real-time session data (Firestore) and Cloud Functions for starting sessions.
- Fetch prepared content from a headless Drupal backend.
- Integrate with the YouTube API for live song searches.
- Persist each singer's device ID in localStorage keyed by session ID.
- Record playback failures in Firestore using an `error` field in the song object.

## Future Enhancements (V2+)

- Maintain a KJ-curated catalog of "KJ's Pick" videos.
- Store each guest's personal songbook locally.
- Provide interstitial videos and bumper music as atmosphere tools.
- Offer collaborative song features (duets and groups) with invitations and merged queue items.
- Support themed sessions and on-screen announcements.

