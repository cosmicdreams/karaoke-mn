# Frontend Taskmaster

This checklist breaks down the work required to implement the Karaoke MN front-end using Lit.
Each item is independent so multiple Codex sessions can work in parallel.

## Build & Tooling

- [x] Install Lit and configure a modern build system (e.g. Vite) for component development.
- [x] Set up ESLint/Prettier for consistent styling.
- [x] Configure Jest with a browser environment for UI tests.

## Core App Structure

- [x] Implement the `karaoke-app` root component with basic routing for KJ, Guest and Main views.

## KJ Components

- [x] Create `kj-login` handling passkey authentication.
- [x] Build `kj-dashboard` as the container for KJ controls.
- [x] Implement `kj-session-creator` to start a session and display the room code/QR.
- [x] Implement `kj-control-panel` for queue management.

## Guest Components

- [x] Create `guest-join-session` for entering room code and singer name.
- [x] Implement `guest-song-search` with `search-bar`, `search-results-list` and `search-result-item` subcomponents.
- [x] Build `guest-queue-view` showing a guest their queued songs.

## Main Screen

- [x] Create `main-screen-view` hosting `youtube-player`, `main-queue-display` and `session-info-display`.

## Shared Components

- [ ] Implement reusable pieces: `qr-code-display`, `loading-spinner`, `modal-dialog` and `toast-notification`.
