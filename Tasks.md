# Implementation Tasks

This checklist captures the work required to deliver the features outlined in **PRD.md** and will help finalize the Business Requirements Document (BRD).

## Setup
- [x] Initialize the repository and development environment.
- [x] Configure Firebase and create a Firestore instance.
- [ ] Set up Headless Drupal for curated content.
- [x] Acquire a YouTube API key for search.

## Core Functionality
- [ ] Implement passkey-based authentication for the KJ account.
- [x] Create a session creation flow with room code and QR code display.
- [x] Allow guests to join anonymously and bind their singer names to their devices.
- [x] Provide a YouTube search interface with the term "karaoke" automatically appended.
- [x] Accept direct YouTube links with video previews.
- [x] Add songs to a shared queue, limiting each guest to three pending songs.
- [x] Display the video player and next singers on the main screen.
- [ ] Implement the "Fair Play" queue algorithm with Phase 1 and Phase 2 behavior.
- [ ] Build a KJ control panel for reordering, removing, replacing, skipping, and pausing songs.

## Technical Tasks
- [ ] Persist singer device IDs in localStorage keyed by session ID.
- [x] Record playback failures in Firestore via an `error` field.
- [x] Implement the `startSession` Cloud Function to pull prepared content from Drupal.
- [ ] Document API contracts and data models in the BRD.

## Future Enhancements
- [ ] Maintain a KJ-curated catalog of "KJ's Pick" videos.
- [ ] Store each guest's personal songbook locally.
- [ ] Provide interstitial and bumper video support.
- [ ] Implement duet and group collaboration features.
- [ ] Support themed sessions and on-screen announcements.
