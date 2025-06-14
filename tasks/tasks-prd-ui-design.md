## Tasks for PRD: Karaoke MN UI Design

- [x] 1.0 Full-Screen Video (TV View)
  - [x] 1.1 Move or verify `<youtube-player>` for full-window layout.
  - [x] 1.2 Implement overlays for room code, join URL, and QR code with accessible contrast.
  - [x] 1.3 Auto-hide controls after a few seconds of inactivity.
- [x] 1.4 Add watermark component with join link in footer or corner.
- [x] 1.5 Route full-screen video to `/<room-id>/play` and remove upcoming queue/main search UI from this view.

- [x] 2.0 Login / Splash Authentication Flow

  - [x] 2.1 Build `<login-form>` component with StageName input and confirm button.
  - [x] 2.2 Integrate WebAuthn passkey flows via `kjAuth.js`.
  - [x] 2.3 Persist StageName and credentials in `localStorage`.
  - [x] 2.4 Redirect or display errors based on authentication result.
  - [x] 2.5 Ensure Login/Splash UI matches design mock (Login-Splash-Screen.jpg)

- [x] 3.0 Main Search Screen Layout and Components

  - [x] 3.1 Integrate `<search-bar-with-status>` bound to `/search?q=` API.
  - [x] 3.2 Implement `<toggle-view-button>` for grid/list modes.
  - [x] 3.3 Create `<search-results-list>` for grid and list templates.
  - [x] 3.4 Add “Add to queue” action with toast feedback.
  - [x] 3.5 Develop `<popover-queue>` to show current + next singers and user’s queued songs.
  - [x] 3.6 Ensure Main Search screen UI matches design mock (Main-Search-Screen.jpg)
  - [x] 3.7 Validate embeddability of YouTube videos before preview/add and display an error if embedding is not allowed

- [x] 4.0 User Profile & Favorites Screen

  - [x] 4.1 Build `<settings-profile>` view with inline StageName edit and Cloud Save badge.
  - [x] 4.2 Load and save favorites via Firestore.
  - [x] 4.3 Reuse `<search-bar-with-status>` and `<toggle-view-button>` for favorites.
  - [x] 4.4 Render favorites list with remove action.
  - [x] 4.5 Add sort controls (by song title / artist).
  - [x] 4.6 Ensure Profile & Favorites UI matches design mock (Profile-Favorites-Screen.jpg)

- [x] 5.0 Shared UI Components Extraction and Integration

  - [x] 5.1 Refine `parseVideoId.js` import into preview and search components.
  - [x] 5.2 Extract shared helpers (date formatting, toasts) into `src/shared/`.
  - [x] 5.3 Consume CSS variables & tokens from `app-theme.js` in components.

- [ ] 6.0 Theming and Responsive Layout Updates

  - [ ] 6.1 Apply dark theme variables (colors, fonts) from `app-theme.js`.
  - [ ] 6.2 Add responsive breakpoints for phones, tablets, and TVs.
  - [ ] 6.3 Audit contrast and typography per WCAG AA.
  - [ ] 6.4 Ensure `login-form`, `guest-song-search`, and `settings-profile` use
        the shared theme tokens.
  - [ ] 6.5 Add orientation-specific layouts for portrait vs. landscape on
        mobile devices.
  - [ ] 6.6 Create shared mixins/utilities for consistent spacing and surface
        colors across components.
  - [ ] 6.7 Document responsive examples in Storybook and verify breakpoints
        with screenshot tests.

  - [ ] 7.1 Create `<error-banner>` for global messages.
  - [ ] 7.2 Display offline/network error states non-blocking.
  - [ ] 7.3 Handle empty states (no results, empty queue).

- [ ] 8.0 Frontend Cleanup & Removal of Obsolete Resources

  - [ ] 8.1 Audit `src/frontend/` for unused or legacy Lit components.
  - [ ] 8.2 Delete deprecated component files (e.g., onboarding-flow.js, hello-lit.js).
  - [ ] 8.3 Remove outdated Storybook stories and assets not aligned with new UI mocks.
  - [ ] 8.4 Clean up static assets in `public/` that are no longer referenced.

- [ ] 9.0 Component Isolation & Testing with Storybook
  - [ ] 9.1 Configure Storybook 9 to load all Lit components from `src/frontend/`.
  - [ ] 9.2 Write stories for each new or updated component (`<login-form>`, `<search-bar-with-status>`, etc.).
  - [ ] 9.3 Develop Storybook-driven tests for component behavior and accessibility using Storybook 9’s testing API.
  - [ ] 9.4 Integrate Storybook test runs into CI.

I have generated the high-level tasks based on the UI Design PRD.
Refer to **Relevant Files** below before starting implementation.

## Relevant Files

- `src/frontend/index.html` - Entry template for Vite's Lit SPA.
- `src/frontend/app-theme.js` - Global theming and design tokens.
- `src/frontend/karaoke-app.js` - Root component handling routing.
- `src/frontend/video-preview-modal.js` - Video preview modal UI.
- `src/frontend/login-form.js` - Login/prompt passkey registration view.
- `src/frontend/guest-song-search.js` - Main search component.
- `src/frontend/guest-queue-view.js` - Popover queue preview component.
- `src/frontend/settings-profile.js` - Profile/favorites management view.
- `src/shared/parseVideoId.js` - Shared helper for parsing YouTube IDs.
- `public/` - Static assets directory (favicon, robots.txt).
- `dist/` - Built application output.

- `src/frontend/main-screen-view.js` - Full-screen video layout, overlays, and auto-hide controls logic for play route.
- `src/frontend/session-info-display.js` - Overlay component showing room code, join URL and QR code with accessible contrast.
- `src/frontend/watermark-link.js` - New watermark component displaying join link overlay.
- `src/frontend/karaoke-app.js` - Routing updates for play route and dynamic room code linking.
- `src/backend/server.js` - Added GET `/sessions/:code` endpoint for play view session metadata.
