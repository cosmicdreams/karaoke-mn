# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Frontend development (Vite + Lit)
npm run dev              # Start dev server with hot reload
npm run build            # Build to public/dist
npm run preview          # Preview built app

# Server development
node server.js           # Express server on port 3000
npm run start            # Start server and open browser

# Code quality
npm run lint             # ESLint
npm run format           # Prettier formatting

# Testing
npm test                 # Unit tests (Vitest)
npm run test:e2e         # E2E tests (Playwright)
npm run storybook        # Component development
npm run test:storybook   # Storybook tests

# YouTube search
npm run search -- "song name"  # Search YouTube for karaoke videos
```

## Architecture Overview

This is a karaoke application with three main parts:

1. **Express Server** (`server.js`) - Development API that manages sessions, queue, and YouTube search
2. **Lit Frontend** (`frontend/`) - Modern web components for KJ (host) and guest interfaces
3. **Firebase Integration** - Production backend for sessions and real-time queue management

### Key Components

- **Session Management**: Room codes, QR codes, passkey authentication for KJs
- **Queue System**: Fair play algorithm that rotates singers, prevents queue gaming
- **Device Identity**: UUID-based device tracking stored in localStorage
- **YouTube Integration**: Augmented search (adds "karaoke"), video preview, direct URL support

### Data Flow

1. KJ creates session → generates room code + QR code
2. Guests join with room code → get device UUID → search/add songs
3. Fair queue algorithm orders songs → KJ has override control
4. Main screen displays current video + upcoming queue

### Environment Setup

Required environment variables:
- `YOUTUBE_API_KEY` - YouTube Data API v3 key
- `GOOGLE_APPLICATION_CREDENTIALS` - Firebase service account (optional, uses emulator otherwise)
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIRESTORE_EMULATOR_HOST` - For local Firestore development
- `DRUPAL_CONTENT_URL` - Drupal JSON:API endpoint for curated content

### Frontend Structure

Uses Vite with Lit web components. Main entry points:
- `frontend/index.html` - Development index
- `public/kj.html` - KJ (host) interface
- `public/join.html` - Guest interface

Components follow pattern: `component-name.js` with kebab-case custom elements.

### Testing Strategy

- Unit tests in `__tests__/` using Vitest
- E2E tests in `e2e/` using Playwright
- Component tests via Storybook
- Development server provides API mock for frontend testing