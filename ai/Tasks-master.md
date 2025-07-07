# Consolidated Tasks

## 1.0 UI Development from Mockups

### 1.1 Full-Screen Video Player (TV View)
- **Objective:** Create a full-screen video playback experience for the main display, referencing `ai/ui-mockups/Full-screen-song-playback.jpg`.
- **Tasks:**
    - Implement a `<youtube-player>` component that expands to fill the entire browser window.
    - Design and overlay a component that displays the room code, a join URL, and a QR code for guests. Ensure high contrast and readability against video backgrounds.
    - Implement a mechanism to automatically hide the overlay and any player controls after a few seconds of user inactivity, and reveal them on mouse movement or touch.
    - Add a subtle watermark component in a corner of the screen with a link to the application's website or guest join page.
    - Create a dedicated route (e.g., `/<room-id>/play`) for this full-screen view, which should not include the main search or queue management UI.

### 1.2 Login/Splash Screen
- **Objective:** Build the initial login and splash screen, as depicted in `ai/ui-mockups/Login-Splash-Screen.jpg`.
- **Tasks:**
    - Develop a `<login-form>` component that includes an input for the user's "Stage Name" and a prominent "Continue" or "Join" button.
    - Integrate WebAuthn passkey authentication using the existing `kjAuth.js` helper functions for a secure and passwordless login experience.
    - Upon successful authentication, persist the user's Stage Name and credentials in local storage or a secure cookie.
    - Provide clear visual feedback for both successful and failed authentication attempts, redirecting the user to the main application on success.
    - Ensure the final implementation is a pixel-perfect match of the `Login-Splash-Screen.jpg` mockup, paying close attention to layout, colors, and typography.

### 1.3 Main Search Screen
- **Objective:** Construct the primary search interface for finding songs, based on `ai/ui-mockups/Main-Search-Page.jpg`.
- **Tasks:**
    - Integrate a `<search-bar-with-status>` component that is connected to the `/search?q=` API endpoint.
    - Implement a `<toggle-view-button>` that allows users to switch between a grid and a list view for the search results.
    - Create a `<search-results-list>` component that can render the search results in both grid and list formats.
    - Add an "Add to queue" button to each search result item, which provides a toast notification as feedback when a song is successfully added.
    - Develop a `<popover-queue>` component that, when activated, displays the current and upcoming singers, as well as the user's own queued songs.
    - The final implementation must visually and functionally align with the `Main-Search-Page.jpg` mockup.
    - Before adding a song to the queue, validate that the YouTube video is embeddable and display an error message if it is not.

### 1.4 User Profile & Favorites Screen
- **Objective:** Build the user profile and favorites management screen, referencing `ai/ui-mockups/User-Profile.jpg`.
- **Tasks:**
    - Create a `<settings-profile>` component that allows users to view and edit their Stage Name inline. Include a "Cloud Save" badge or indicator to show that their settings are being persisted.
    - Connect the component to Firestore to load and save the user's favorite songs.
    - Reuse the `<search-bar-with-status>` and `<toggle-view-button>` components to allow users to search and switch views within their favorites list.
    - Render the list of favorite songs with a "Remove" button for each item.
    - Implement sorting controls to allow users to sort their favorites by song title or artist.
    - Ensure the final UI is a faithful reproduction of the `User-Profile.jpg` mockup.

## 2.0 Application Setup and Backend

- [ ] **2.1** Set up the Lit application and configure routing (`/`, `/admin`, `/admin/<uuid>`)
- [ ] **2.2** Implement passkey authentication and guest session joining
- [ ] **2.3** Build the guest search interface that appends “karaoke” to queries
- [ ] **2.4** Create the KJ dashboard with queue management using `fairPlay.js`
- [ ] **2.5** Design the main screen showing upcoming singers and content
- [ ] **2.6** Switch the repository to Vitest for all testing
- [ ] **2.7** Session & Login Persistence

## 3.0 Shared Components and Theming

- [ ] **3.1** Extract and integrate shared UI components.
- [ ] **3.2** Apply a consistent dark theme and responsive layouts.
- [ ] **3.3** Implement global error handling and empty states.

## 4.0 Code Cleanup and Testing

- [ ] **4.1** Clean up the frontend by removing obsolete resources.
- [ ] **4.2** Isolate and test components with Storybook.
