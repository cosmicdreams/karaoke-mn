# ADR-003: Use Firebase for Real-time Data and App Storage

**Status:** Accepted

**Context:**

The core of the karaoke application relies on real-time updates shared between multiple clients (the main screen, the KJ's controller, and all guest devices). The song queue, player status, and singer list must be synchronized instantly and reliably.

**Decision:**

We will use Google's Firebase platform, specifically Firestore, as the backend for all real-time data and application storage. The frontend application will connect directly to Firestore to read session data and write updates (e.g., adding a song to the queue).

**Consequences:**

- **Pros:**
  - Firestore provides excellent real-time capabilities out-of-the-box, simplifying the development of collaborative features.
  - It offers a scalable, serverless architecture, reducing backend management overhead.
  - The client-side SDKs are mature and easy to integrate with the Lit frontend.
- **Cons:**
  - Creates a vendor lock-in with the Google Cloud ecosystem.
  - Firestore's query capabilities are less flexible than traditional SQL databases.
  - Costs can become significant with high usage if the data model is not designed carefully.
