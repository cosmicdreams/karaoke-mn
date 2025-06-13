# Lit Component Recommendations for Karaoke MN

Based on the PRD.md, here is a suggested component structure for building the Karaoke MN frontend using Lit.

## High-Level App Container

*   **`karaoke-app`**:
    *   **Description**: The main application component.
    *   **Responsibilities**: Manages routing between different views (KJ, Guest, Main Screen), handles overall application state, and initializes connections to services like Firebase.

## KJ (Karaoke Jockey) Specific Components

*   **`kj-login`**:
    *   **Description**: Handles passkey authentication for the KJ.
    *   **Responsibilities**: Displays login prompts, interacts with WebAuthn APIs, and communicates authentication status to `karaoke-app`.
*   **`kj-dashboard`**:
    *   **Description**: Main view for the KJ after successful login.
    *   **Responsibilities**: Acts as a container for KJ-specific functionalities.
    *   **Child Components**: `kj-session-creator`, `kj-control-panel`, `kj-main-screen-preview`, (Future) `kj-catalog-manager`.
*   **`kj-session-creator`**:
    *   **Description**: Component to start a new karaoke session.
    *   **Responsibilities**: Makes requests to the backend to create a session, displays the generated room code and QR code.
*   **`kj-control-panel`**:
    *   **Description**: Displays the live queue and provides KJ with administrative controls.
    *   **Responsibilities**: Fetches and displays the song queue from Firestore, allows drag-and-drop reordering, song removal, skipping to the next singer, pausing the session, and setting timers.
    *   **Child Components**: `kj-queue-item`.
*   **`kj-queue-item`**:
    *   **Description**: Represents a single song entry in the KJ's control panel view of the queue.
    *   **Responsibilities**: Displays song title, singer name, and provides individual controls (e.g., remove, view details).
*   **`kj-main-screen-preview`**:
    *   **Description**: A smaller, read-only preview of what is currently displayed on the main "TV" screen.
    *   **Responsibilities**: Subscribes to relevant state changes to mirror the main screen.
*   **(Future) `kj-catalog-manager`**:
    *   **Description**: Allows the KJ to create and manage curated lists of karaoke songs.
    *   **Responsibilities**: Interface for adding/removing YouTube videos to/from a persistent KJ library.

## Guest (Singer) Specific Components

*   **`guest-join-session`**:
    *   **Description**: Allows guests to join an active session and set their singer name.
    *   **Responsibilities**: Input for room code and singer name, handles device binding (storing/retrieving a unique ID from localStorage), and communicates with `karaoke-app` to join the session in Firestore.
*   **`guest-song-search`**:
    *   **Description**: Enables guests to search for karaoke songs on YouTube.
    *   **Responsibilities**: Provides an interface for searching, displays results, allows video preview, and adding a song to the queue.
    *   **Child Components**: `search-bar`, `search-results-list`, `video-preview-modal`.
*   **`search-bar`**:
    *   **Description**: Input field for song search queries.
    *   **Responsibilities**: Captures user input, triggers search events, potentially with debouncing.
*   **`search-results-list`**:
    *   **Description**: Displays the list of karaoke videos returned from YouTube search.
    *   **Responsibilities**: Renders `search-result-item` components for each result.
    *   **Child Components**: `search-result-item`.
*   **`search-result-item`**:
    *   **Description**: Represents a single YouTube video in the search results.
    *   **Responsibilities**: Displays video title, thumbnail, and provides options to preview or add to the queue.
*   **`video-preview-modal`**:
    *   **Description**: A modal dialog to allow guests to preview a YouTube video on their device before adding it to the queue.
    *   **Responsibilities**: Embeds a small YouTube player or shows video details.
*   **`guest-queue-view`**:
    *   **Description**: Shows the guest their current position in the queue and a list of songs they have personally added.
    *   **Responsibilities**: Subscribes to queue updates from Firestore and filters/displays relevant information for the guest.
    *   **Child Components**: `guest-queued-song-item`.
*   **`guest-queued-song-item`**:
    *   **Description**: Represents one of the guest's own songs in their view of the queue.
    *   **Responsibilities**: Displays song title, status (e.g., "up next," "in queue"), and potentially an option to remove it (if allowed by rules).
*   **(Future) `guest-songbook`**:
    *   **Description**: Allows guests to save and manage a personal list of their favorite karaoke songs.
    *   **Responsibilities**: Uses localStorage or other client-side storage to maintain the songbook.

## Main Screen ("TV") Components

*   **`main-screen-view`**:
    *   **Description**: The primary display for the audience, typically shown on a TV or projector.
    *   **Responsibilities**: Container for the main playback elements and queue information.
    *   **Child Components**: `youtube-player`, `main-queue-display`, `session-info-display`, (Future) `interstitial-player`, (Future) `on-screen-announcement`.
*   **`youtube-player`**:
    *   **Description**: Embeds and controls the main YouTube IFrame Player.
    *   **Responsibilities**: Loads and plays videos from the queue, responds to playback controls (play, pause, volume) originating from the KJ or automated system, reports playback errors.
*   **`main-queue-display`**:
    *   **Description**: Prominently displays the list of upcoming singers (e.g., next 5-10).
    *   **Responsibilities**: Subscribes to queue changes in Firestore and renders the upcoming singers.
    *   **Child Components**: `main-queue-item`.
*   **`main-queue-item`**:
    *   **Description**: Represents a single song/singer entry in the main queue display.
    *   **Responsibilities**: Clearly displays song title and singer name.
*   **`session-info-display`**:
    *   **Description**: Persistently displays the Room Code and QR code for joining the session.
    *   **Responsibilities**: Ensures this information is always visible on the main screen.
    *   **Child Components**: `qr-code-display`.
*   **(Future) `interstitial-player`**:
    *   **Description**: Plays short, entertaining videos or announcements between karaoke performances.
*   **(Future) `on-screen-announcement`**:
    *   **Description**: Displays text-based announcements or messages on the main screen, controlled by the KJ.

## Shared/Utility Components

*   **`qr-code-display`**:
    *   **Description**: Generates and displays a QR code from a given string (e.g., session join link).
    *   **Responsibilities**: Uses a QR code generation library.
*   **`user-avatar` / `singer-display`**:
    *   **Description**: A consistent way to display singer names, potentially with an avatar or icon in the future.
*   **`loading-spinner`**:
    *   **Description**: A generic loading indicator used during data fetching or processing.
*   **`error-message`**:
    *   **Description**: A standardized component to display error messages to the user.
*   **`modal-dialog`**:
    *   **Description**: A base component for creating modal pop-ups (e.g., for video preview, confirmations).
*   **`button-component`**:
    *   **Description**: Standardized button elements with consistent styling and accessibility features.
*   **`input-field`**:
    *   **Description**: Standardized input fields with consistent styling, validation, and accessibility features.

## Additional Components

*   **`app-theme`**:
    *   **Description**: Provides global theming and reusable design tokens.
    *   **Responsibilities**: Applies a Karafun-inspired dark theme and exposes CSS custom properties for other components.
*   **`layout-container`**:
    *   **Description**: Handles responsive layout and places main regions of the app (player, queue, search) appropriately.
    *   **Responsibilities**: Adjusts to different screen sizes so the interface works on mobile devices, tablets, and TVs.
*   **`toast-notification`**:
    *   **Description**: Brief pop-up messages for join confirmations, queue updates, or errors.
    *   **Responsibilities**: Shows non-blocking feedback to the user and automatically dismisses after a few seconds.

## UI Design Notes

* Use a dark background with vibrant accent colors to mimic the Karafun aesthetic.
* Keep the YouTube player and queue information prominent on the main screen.
* Favor large, legible fonts and clear controls for a "party" environment.
* Implement smooth transitions when songs change or when the queue is updated.
* Ensure every view is responsive so guests can comfortably use phones while the KJ manages from a tablet or laptop.

This structure aims to create modular, reusable, and maintainable components for the Karaoke MN application. Each component has a clear set of responsibilities, which should simplify development and testing.
