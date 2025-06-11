# Agents.md

This file provides guidelines for AI agents (Codex) working on the Karaoke MN project.

## Project Context

This is a **karaoke application** that enables hosts (KJs) to run karaoke sessions where guests join using room codes, search for songs on YouTube, and participate in a fair queue system. The app prioritizes accessibility, fairness, and ease of use.

## Code Standards & Practices

### ESM First
- **Always use ESM imports/exports** - this project has committed to ESM throughout
- Convert any remaining CommonJS `require()` statements to `import` statements
- Use `import` syntax in all new files

### Technology Stack
- **Frontend**: Lit web components with Vite build system
- **Backend**: Express.js server with Firebase/Firestore integration  
- **Testing**: Vitest for unit tests, Playwright for E2E, Storybook for components
- **Code Quality**: ESLint + Prettier configured

### Component Conventions
- Use kebab-case for custom element names (`kj-dashboard`, `guest-song-search`)
- Follow Lit patterns: static properties, reactive properties, render() method
- Keep components focused and composable
- Import dependencies at the top of each component file

## Domain Knowledge

### Core Concepts
- **KJ (Karaoke Jockey)**: The host who manages the session
- **Fair Play Algorithm**: Queue system that ensures equal participation (see `fairPlay.js`)
- **Device Identity**: UUIDs stored in localStorage to prevent queue manipulation
- **Room Codes**: Human-readable codes like "PURPLE-RAIN" for session joining
- **Phase 1 vs Phase 2**: Queue phases (first-timers vs. rotation of experienced singers)

### Key Business Rules
- Maximum 3 songs per guest in queue at any time
- Search queries automatically append "karaoke" 
- Device IDs must persist in localStorage keyed by session ID
- KJ has override control over automatic queue ordering
- YouTube video failures should be recorded in Firestore `error` field

## Development Workflow

### Before Making Changes
1. Run `npm run lint` to check code style
2. Understand the fair play queue logic before modifying queue-related code
3. Test YouTube API integration with valid `YOUTUBE_API_KEY`
4. Verify Lit components render properly in isolation and integrated views

### Testing Requirements
- Unit test core business logic (especially queue algorithms)
- E2E test critical user flows (session creation, joining, song queueing)
- Component test UI components in Storybook
- Manual test real YouTube integration when possible

### Common Tasks
- **New Components**: Create in `frontend/` directory, register in parent components
- **Queue Logic**: Modify `fairPlay.js` and corresponding server endpoints
- **YouTube Integration**: Update search/preview functionality in server and frontend
- **Authentication**: Passkey implementation in `kjAuth.js` and `kj-login.js`

## Pitfalls to Avoid

### Technical
- Don't break ESM compatibility by introducing CommonJS patterns
- Don't assume YouTube videos are always playable - handle errors gracefully
- Don't bypass the fair play algorithm without KJ override controls
- Don't store sensitive data in localStorage or client-side code

### UX/Product
- Don't make guests create accounts - anonymous participation is core to the experience
- Don't allow queue manipulation - device identity and fair play are security features
- Don't assume users understand karaoke terminology - keep UI clear and intuitive
- Don't break the 3-song limit per guest - it ensures fair participation

## File-Specific Guidance

- `fairPlay.js`: Core queue algorithm - test thoroughly before changes
- `server.js`: Main API - maintain backward compatibility for frontend
- `frontend/karaoke-app.js`: Root component - coordinate view routing here  
- `kjAuth.js`: Passkey implementation - security-critical, handle errors gracefully
- `search.js`: YouTube search utility - ensure "karaoke" is appended to queries

## Current State

Most core functionality is complete. Focus areas for enhancement:
- Passkey authentication error resolution
- Settings/profile screens
- Analytics and session statistics  
- Error handling and offline scenarios
- Drupal integration for curated content