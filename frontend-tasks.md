# Frontend Taskmaster

This checklist breaks down the work required to implement the Karaoke MN front-end using Lit.
Each item is independent so multiple Codex sessions can work in parallel.

## Build & Tooling

- [x] Install Lit and configure a modern build system (e.g. Vite) for component development.
- [x] Set up ESLint/Prettier for consistent styling.
- [x] Configure Jest with a browser environment for UI tests.

## Core App Structure

- [x] Implement the `karaoke-app` root component with basic routing for KJ, Guest and Main views.
- [x] Ensure the Lit-based UI is built and served at the root (localhost:3000) as the main user-facing frontend. Verify that the Vite build output (public/dist) is used and the Express server serves the correct index.html for the Lit app.

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

 - [x] Implement reusable pieces: `qr-code-display`, `loading-spinner`, `modal-dialog` and `toast-notification`.

## Quality & Developer Experience

- [x] Integrate Storybook for isolated component development and visual testing (use Storybook 9's built-in tests for component testing).
- [x] Add end-to-end tests for critical user flows using Playwright.

## Accessibility

- [ ] Audit all components for keyboard navigation and screen reader support.
- [ ] Add ARIA labels and roles to custom components where appropriate.
- [ ] Ensure color contrast and font sizes meet accessibility standards.

## User Experience Enhancements

- [ ] Implement a settings/profile screen for KJ and guests (theme, preferences, etc.).
- [ ] Add onboarding/tutorial flow for first-time users (skippable, highlights main features).
- [ ] Add analytics/stats display (e.g., most popular songs, top singers, session summary).
- [ ] Implement error/offline handling screens and banners for network or backend issues.
