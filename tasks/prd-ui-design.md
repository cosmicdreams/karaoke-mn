# PRD: Karaoke MN UI Design

## 1. Introduction / Overview

This PRD describes the user interface requirements for the Karaoke MN application.  We are
building a cohesive Lit-based frontend that guides guests through passkey login, song search,
and queue management, while providing a full-screen TV view for performers and spectators.

## 2. Goals

- **Fresh UI Experience:** Create a modern, intuitive interface inspired by Karafun’s layout.
- **Seamless Guest Flow:** Minimize friction for new and returning guests when registering, searching,
  and queuing songs.
- **Responsive & Accessible:** Ensure layouts work on mobile, tablet, and TV displays; adhere to
  accessibility best practices.

## 3. User Stories

- **New Guest:** As a new guest, I want to register with my StageName using passkeys so I can
  securely join without passwords.
- **Returning Guest:** As a returning guest, I want silent auto-authentication to quickly queue songs.
- **Singer:** As a guest, I want to search for karaoke videos and add them to the queue so I can
  secure my turn.
- **Spectator:** As an audience member, I want to see a full-screen video display with room code
  and a queue overlay so I know how to join and follow along.
- **Fan:** As a guest, I want to manage my favorites (add/remove, sort) in my profile so I can
  quickly re-queue songs in future sessions.

## 4. Functional Requirements

1. **Full-Screen Video (TV View):** Embed a YouTube player that:
   - Shows playback full-window with auto-hiding controls.
   - Overlays room code and QR code in the top-right corner.
   - Displays an unobtrusive join link watermark.
2. **Login/Splash Screen:** On app load:
   - Detect existing WebAuthn passkey and StageName in localStorage.
   - If found, auto-authenticate and navigate to Main Search Screen.
   - Otherwise, display `<login-form>` to collect StageName and register passkey.
3. **Main Search Screen:** Provide `<search-bar-with-status>` plus:
   - Toggle between grid and list layouts with `<toggle-view-button>`.
   - Display results in `<search-results-list>` with “Add to queue” buttons.
   - Show `<popover-queue>` side panel with current + next 5 singers and guest’s own queued songs.
4. **User Profile Screen:** Allow profile and favorites management:
   - Inline edit StageName.
   - Show Cloud Save timestamp badge.
   - Use `<search-bar-with-status>` to filter favorites.
   - Use `<toggle-view-button>` and `<search-results-list>` to view/remove favorites.

## 5. Non-Goals (Out of Scope)

- KJ-specific administrative dashboards and queue override controls.
- Actual karaoke audio/video playback controls beyond basic YouTube embedding.

## 6. Design Considerations

- **Brand Inspiration:** Follow Karafun’s dark, high-contrast theme.
- **Component Library:** Leverage Lit components and draw styling cues from Shadcn UI.
- **Responsive Layout:** Ensure breakpoints support phones (≤480px), tablets (480–768px), and large TVs (≥1280px).

## 7. Technical Considerations

- Built entirely with Lit + Vite (ESM) and TypeScript/JavaScript.
- OAuth/WebAuthn passkey integration via existing `kjAuth.js` APIs.
- Real-time data via Firestore; queue updates reflected in `<popover-queue>`.

## 8. Success Metrics

- **Registration Flow:** 100% of new guests complete passkey setup in under 30 seconds.
- **Search Performance:** Search queries return first results in <300ms 90% of the time.
- **User Engagement:** Guests queue at least one song in 85% of sessions.
- **Responsive Score:** 100% critical UI components pass mobile usability audits.

## 9. Edge Cases & Error States

- **Offline / API Errors:** Display non-blocking banners and retry options.
- **Empty States:** Show clear “No results found” or “No queued songs” placeholders.
- **Invalid Passkey:** Prompt a fallback login if WebAuthn fails.
- **Missing StageName:** Require StageName input before proceeding to search.

---
_End of PRD for UI Design._