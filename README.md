# Karaoke MN

This repository contains the early implementation of the Karaoke MN project.

## Development Setup

1. Install [Node.js](https://nodejs.org/) 20.x (see .nvmrc).
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env` and fill in required values.
4. Run `npm run lint` and `npm run format` to keep code style consistent.

### Frontend Development

The frontend uses [Vite](https://vitejs.dev/) with [Lit](https://lit.dev/) for component development.

Run a development server with hot module reloading:

```bash
npm run dev
```

Build the production assets to `public/dist`:

```bash
npm run build
```

### Firebase & Firestore Setup

1. Create a Firebase project and generate a service account JSON file.
2. Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of this file.
3. Set `FIREBASE_PROJECT_ID` to your project ID.
4. (Optional) If you prefer to use the Firestore emulator, set
   `FIRESTORE_EMULATOR_HOST` instead of providing credentials.
5. Set `DRUPAL_CONTENT_URL` to your Drupal JSON:API endpoint for prepared content.

## YouTube Search Script

A small Node.js script is provided to search YouTube for karaoke videos.
It appends the term `karaoke` to any search query and returns the top five results.

### Usage

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set your YouTube API key in the environment:
   ```bash
  export YOUTUBE_API_KEY=YOUR_KEY
  ```
3. Run a search:
  ```bash
  npm run search -- "purple rain"
  ```

### Acquiring a YouTube API Key
To obtain a key, create a project in the [Google Developer Console](https://console.developers.google.com/), enable the YouTube Data API v3, and generate an API key under **APIs & Services \> Credentials**. Paste this key into your `.env` file or export it as `YOUTUBE_API_KEY` before running any of the scripts or the server.

### Output
The script prints each video ID and title to standard output.

## Queue & Search Server

`server.js` exposes a small Express server with endpoints to search YouTube and
manage a simple in-memory song queue. If `GOOGLE_APPLICATION_CREDENTIALS` is set
to a Firebase service account file, queued songs will also be stored in
Firestore.

Start the app (build frontend and launch server) with:
```bash
npm start
```

Visit `http://localhost:3000/` in a browser to see the main screen with the
current video and a list of upcoming singers.

Endpoints:
- `POST /sessions` – creates a new session and returns a room code and QR code.
 - `POST /sessions/:code/join` with `name` and optional `deviceId` – joins a
    session. The `deviceId` must be a UUID and should be reused for the duration
    of the session; if a different name is sent for an existing `deviceId`, the
    server will reject the request. Store this identifier in `localStorage` keyed
    by session code so returning guests keep the same device ID.
- `GET /search?q=term` – returns the top five karaoke results.
- `POST /songs` with `videoId` or `url` and `singer` – adds a song to the queue
  (max three per singer).
- `GET /preview?url=` or `?videoId=` – fetches metadata for a YouTube link so
  the client can display a preview before adding it to the queue.
- `GET /queue` – lists the current queue.

## Cloud Functions

The `startSession` Cloud Function creates a new Firestore session document using
prepared content fetched from Drupal. Each document includes a `createdAt`
timestamp. Ensure `DRUPAL_CONTENT_URL` is set in your environment before
deploying. Deploy with:

```bash
firebase deploy --only functions:startSession
```

## Testing

Unit tests run with [Vitest](https://vitest.dev/):

```bash
npm test
```

Use [Storybook 9](https://storybook.js.org/) for component testing and visual regression checks:

```bash
npm run storybook
npm run test:storybook
```

End-to-end tests are written with [Playwright](https://playwright.dev/):

```bash
npm run test:e2e
```

## Tasks
See `Tasks.md` for the full implementation checklist.

## Passkeys

See [PASSKEYS.md](./PASSKEYS.md) for details on how passkeys are verified and why
the project uses the `@simplewebauthn/server` library for server-side
implementation.
