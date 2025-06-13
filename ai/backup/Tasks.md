# Implementation Tasks

This checklist captures the work required to deliver the features outlined in **PRD.md** and will help finalize the Business Requirements Document (BRD).

## Setup

- [ ] Set up Headless Drupal for curated content.

## Core Functionality

All tasks completed.


## Technical Tasks

All tasks completed.

## Future Enhancements

- [x] Maintain a KJ-curated catalog of "KJ's Pick" videos.
- [x] Store each guest's personal songbook locally.
- [x] Provide interstitial and bumper video support.
- [ ] Implement duet and group collaboration features.
- [x] Support themed sessions and on-screen announcements.

## Completed Tasks

- Initialize the repository and development environment.
- Configure Firebase and create a Firestore instance.
- Acquire a YouTube API key for search.
- Implement passkey-based authentication for the KJ account.
- Create a session creation flow with room code and QR code display.
- Allow guests to join anonymously and bind their singer names to their devices.
- Provide a YouTube search interface with the term "karaoke" automatically appended.
- Accept direct YouTube links with video previews.
- Add songs to a shared queue, limiting each guest to three pending songs.
- Display the video player and next singers on the main screen.
- Implement the "Fair Play" queue algorithm with Phase 1 and Phase 2 behavior.
- Build a KJ control panel for reordering, removing, replacing, skipping, and pausing songs.
- Persist singer device IDs in localStorage keyed by session ID.
- Record playback failures in Firestore via an `error` field.
- Implement the `startSession` Cloud Function to pull prepared content from Drupal.
- Document API contracts and data models in the PRD.
