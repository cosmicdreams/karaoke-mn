Product Requirements Document (PRD)
Project: Karaoke MN - Purple Rain
Version: 1.1
Status: Final Specification (with implementation notes)
1. Introduction & Vision
1.1. Vision
To create a free, accessible, and feature-rich karaoke application that leverages the vast library of karaoke videos on YouTube. Karaoke MN aims to be an open and shareable alternative to established platforms like Karafun, providing a complete solution for casual karaoke nights without requiring expensive software or dedicated hardware.
1.2. The Problem
Casual karaoke is a universally fun social activity, but the barrier to entry is often unnecessarily high. Potential hosts and singers face several pain points:
High Cost: Traditional karaoke software and hardware can be expensive and complex to set up.
Limited Catalogs: Paid services have limited, licensed songbooks that may not include niche, new, or user-created tracks.
Inconvenient Experience: Relying on a single laptop for search and playback creates bottlenecks. Passing a mic and a keyboard around is clumsy.
Unfair Queues: Manual "paper list" queues are prone to social exploits ("My friend is next!"), causing frustration and sidelining new singers.
Karaoke MN solves this by using guests' own smartphones as controllers and YouTube as the song source, managed by a fair, automated system.
2. Target Audience
Primary Persona: The Karaoke Jockey (KJ) / Party Host
Who they are: Someone hosting a party or social gathering (at home, at a cabin, in a dorm room) who wants to make karaoke the main event.
Needs: A simple way to manage the music and the queue so they can also enjoy the party. They need control to keep things running smoothly but want to avoid being a bottleneck.
Frustrations: Keeping track of who is next, dealing with arguments over the queue, and the high cost of "pro" software they don't really need.
Secondary Persona: The Singer / Party Guest
Who they are: A friend at the party who wants to participate.
Needs: A quick and easy way to find their song and get in line without having to interrupt the host or hover over a laptop.
Frustrations: Not knowing when their turn is, feeling like they have to "know someone" to get a turn, struggling to find the exact version of the song they want.
3. Goals & Objectives
User Goal 1: Frictionless Participation. Guests can join a session, pick a name, search for a song, and add it to the queue from their own device in under 60 seconds.
User Goal 2: A Fair & Transparent Queue. The queue logic is clear, automated, and visible to all participants, ensuring everyone gets a turn in a reasonable order.
Product Goal 1: Robust Queue Management. The system implements a smart default algorithm that prioritizes fairness but allows the KJ complete override control.
Product Goal 2: Device-as-Identity. Associate each singer with their unique device for the duration of a session to prevent queue manipulation and simplify tracking.
Technical Goal 1: Secure & Simple KJ Authentication. Utilize modern, secure passkey technology for the dedicated KJ account, eliminating the need for traditional passwords.
Business Goal 1: Community Adoption. Build a user base through a free, high-quality experience that encourages word-of-mouth sharing.
4. Core Features & Functionality (MVP)
4.1. Session Management
KJ Account: A persistent account for the KJ, secured with passkeys.
Create Session: The KJ can start a new "Karaoke Night" session.
Session Joining: The app generates a unique, easy-to-type room code (e.g., PURPLE-RAIN) and a QR code displayed on the main screen.
4.2. Singer / Guest Experience
Anonymous Entry: No account or sign-up is required for singers.
Device Binding: Upon first joining a session, the user is prompted to enter a singer name, which is then tied to their device's session data.
Song Search & Selection:
Augmented Search: Guest search queries are automatically augmented with the term "karaoke".
Direct Link Submission: Guests can paste a full YouTube video URL.
Video Preview: Guests can preview a video on their device before adding it to the queue.
Add to Queue: A simple "Sing this!" button adds the video to the shared queue.
Queue Limit: To ensure fair access, a single guest cannot have more than 3 songs in the queue at one time. This rule is enforced by the frontend application.
4.3. Main Screen / Player View (The "TV" screen)
Video Playback: A large, embedded YouTube player.
Queue Display: A prominent, real-time list of the next 5-10 singers.
Session Info: The Room Code and QR code are always visible.
4.4. Queue Logic & KJ Controls
Default Algorithm ("Fair Play"): Automatic interleaving of singers.
Phase 1 (First Round): Prioritizes singers who have not yet sung.
Phase 2 (Looping): Begins after Phase 1 is complete or a timer expires. In this phase, the queue prioritizes singers who have sung the fewest times.
KJ Control Panel (KJ's device only):
Set Timed First Round: Optional timer to start the looping phase.
Drag-and-Drop Reordering, Remove Singer, Replace Video, Next Singer, Pause Session.
5. Future Roadmap (V2 and Beyond)
Persistent Libraries & Curation:
KJ's Curated Catalog: A library of "KJ's Pick" videos to guide guests.
Guest's Songbook: A locally stored list of a guest's favorite songs.
KJ's Atmosphere Toolkit:
Interstitials: Splice in funny videos between songs.
Bumper Music: Playlists for background mood music.
Collaborative Songs (Duets & Groups):
Automatic Teaming: When a guest adds a song that is already in the queue for another singer, the app will trigger a collaboration prompt.
Group Invitation: The app sends a notification to all singers who have selected that same song, asking, "[Singer's Name] also wants to sing this. Team up?"
Queue Merging: As singers accept, their individual entries are merged into a single queue item. If they decline, the songs remain separate. Note: A collaborative performance will increment the songsSung count for every participant.
Themed Sessions & On-Screen Announcements.
6. Technical Architecture
Frontend: A modern JavaScript single-page application (SPA).
Real-Time Backend (Live Sessions): Firebase.
Content Backend (Persistent Assets): Headless Drupal.
6.1. Data Flow Diagram
graph TD
    subgraph "Flow 1: Prepared Content (Pre-Party Setup)"
        direction LR
        KJ_Pre[KJ] -- 1. Curates content --> Drupal[Headless Drupal];
        KJ_Pre -- 2. Starts Session --> FrontendApp[Frontend App];
        FrontendApp -- 3. Triggers --> CloudFunc[Firebase Cloud Function];
        CloudFunc -- 4. Fetches JSON Data --> Drupal;
        CloudFunc -- 5. Writes Prepared Content --> Firestore[Firebase Firestore];
    end

    subgraph "Flow 2: Live Content (During Party)"
        direction LR
        Guest[Guest] -- 1. Searches for Song --> FrontendApp;
        FrontendApp -- 2. Queries for results --> YouTube[YouTube API];
        YouTube -- 3. Returns results --> FrontendApp;
        Guest -- 4. Selects Song --> FrontendApp;
        FrontendApp -- 5. Adds Song to Live Queue --> Firestore;
    end

    FrontendApp -- Reads All Session Data --> Firestore;


7. API & Data Contracts
7.1. Firestore Data Model
Collection: sessions
Document ID: {sessionID}
Document Schema (sessions/{sessionID}):
{
  "kjId": "string",
  "status": "string",
  "nowPlaying": { /* Song Object */ } | null,
  "queue": [ /* Array of Song Objects */ ],
  "singers": {
    "deviceId_abc": { "name": "Alice", "songsSung": 2 }
  },
  "preparedContent": { /* Prepared content from Drupal */ }
}


Object Schemas:
Song Object:
{
  "videoId": "string",
  "title": "string",
  "thumbnailUrl": "string",
  "singerName": "string",
  "singerDeviceId": "string",
  "isKjPick": "boolean",
  "error": "string | null" 
}


Video Object (for memes, etc.):
{
  "type": "string",
  "url": "string",
  "title": "string"
}


Implementation Notes:
singerDeviceId: This should be a UUID generated by the Frontend App when a guest first joins a session. It MUST be persisted in the browser's localStorage, keyed by the sessionID (e.g., localStorage.setItem('karaoke-mn-id-PURPLE-RAIN', 'your-uuid-here')), to recognize returning users.
error field: If the YouTube Player API reports a video is unavailable or fails to play, the Frontend App should update the song entry in Firestore, setting error to a descriptive string (e.g., "playback_failed").
7.2. Firebase Cloud Functions
startSession(auth): Triggered by the Frontend App. Fetches prepared content from Drupal via its JSON:API, creates a new session document in Firestore, and populates it with the prepared data.
7.3. Drupal JSON:API Endpoints
Called by the startSession Cloud Function to fetch the KJ's curated song lists and media playlists.
7.4. External APIs (YouTube)
GET https://www.googleapis.com/youtube/v3/search: Called by the Frontend App for live song searches.
8. Monetization Strategy
(To Be Determined. Initial version will be free to encourage adoption.)
