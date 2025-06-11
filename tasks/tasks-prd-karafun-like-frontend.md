## Relevant Files

- `tasks/tasks-prd-karafun-like-frontend.md` - Task list for Karafun-like frontend PRD.
- `frontend/` - Lit components for guest, KJ and main views.
- `server.js` - Express server serving the app and API endpoints.
- `kjAuth.js` - Helper functions for WebAuthn passkey registration and auth.
- `fairPlay.js` - Queue algorithm used by the KJ dashboard.
- `firebase.js` - Firestore initialization for session data.
- `public/index.html` - Entry point loaded by Vite build.
- `__tests__/` - Vitest unit and integration tests.
- `.storybook/` - Storybook configuration and component tests.
- `playwright.config.js` - Playwright test configuration.
- `e2e/` - Playwright end-to-end tests.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.js` and `MyComponent.test.js` in the same directory).
- Use `npx vitest run [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Vitest configuration.
- Storybook 9 is used for component testing (`npm run test:storybook`).
- End-to-end tests run with Playwright (`npm run test:e2e`).

## Tasks

- [x] **1.0** Set up the Lit application and configure routing (`/`, `/admin`, `/admin/<uuid>`)
  - [x] **1.1** Verify Vite outputs the build to `public/dist` and is served by `server.js`.
  - [x] **1.2** Implement routing logic in `karaoke-app.js` to load guest, KJ and main components.
  - [x] **1.3** Ensure unknown paths fall back to the Lit app from the server.
- [x] **2.0** Implement passkey authentication and guest session joining
  - [x] **2.1** Add WebAuthn registration and login flows in `kj-login` using `kjAuth.js` endpoints.
  - [x] **2.2** Display a QR code and room code on the main screen so guests can join.
  - [x] **2.3** Implement `guest-join-session` component to join via QR or room code.
- [x] **3.0** Build the guest search interface that appends “karaoke” to queries
  - [x] **3.1** Connect `guest-song-search` to the `/search` API and show results.
  - [x] **3.2** Use `search-results-list` and `search-result-item` to display YouTube songs.
  - [x] **3.3** Allow previewing songs with the `/preview` endpoint before queueing.
- [ ] **4.0** Create the KJ dashboard with queue management using `fairPlay.js`
  - [x] **4.1** Implement add, reorder, skip and complete actions in `kj-control-panel`.
  - [x] **4.2** Use `fairPlay.js` to order songs returned from `/queue`.
  - [ ] **4.3** Write Vitest unit tests covering queue logic and KJ endpoints.
- [ ] **5.0** Design the main screen showing upcoming singers and content
  - [ ] **5.1** Display at least the next five singers in `main-queue-display`.
  - [ ] **5.2** Load session content from Firestore and Drupal when available.
  - [ ] **5.3** Ensure layouts are responsive across phones, tablets and desktops.
- [ ] **6.0** Switch the repository to Vitest for all testing
  - [ ] **6.1** Remove Jest dependencies and config files.
  - [ ] **6.2** Update documentation and tasks to reference Vitest.
  - [ ] **6.3** Confirm all existing tests pass with `npm test`.
