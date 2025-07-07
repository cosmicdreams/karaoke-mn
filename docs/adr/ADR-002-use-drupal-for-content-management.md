# ADR-002: Use Headless Drupal for Curated Content

**Status:** Accepted

**Context:**

The application needs a way for the Karaoke Jockey (KJ) to manage persistent, curated content, such as featured song lists, themed playlists, or interstitial media, without modifying the application's code. This content needs to be separated from the live, session-specific data.

**Decision:**

We will use a headless Drupal instance as the content management system (CMS). A Firebase Cloud Function (`startSession`) will fetch this curated content from Drupal's JSON:API endpoint when a new karaoke session is created and inject it into the session's Firestore document.

**Consequences:**

- **Pros:**
  - Separates content management from application logic, allowing for easier updates.
  - Leverages a powerful, mature CMS with a robust API for content modeling.
  - KJs can manage content through a user-friendly interface without needing developer intervention.
- **Cons:**
  - Adds an additional service to the architecture, increasing complexity and maintenance overhead.
  - Introduces a dependency on an external system (Drupal) for full functionality.
  - Requires a separate hosting environment for the Drupal instance.
