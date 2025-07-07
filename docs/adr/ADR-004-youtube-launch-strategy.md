# ADR-004: YouTube Launch Strategy (No Embedding)

**Status:** Accepted

**Context:**

The application needs to display YouTube karaoke videos when it's a singer's turn. There are two primary approaches:

1. **Embedded iframes**: Use YouTube's embed API to display videos within the application
2. **External launch**: Open YouTube videos in new windows/tabs

Embedded iframes face significant challenges:
- Many karaoke videos have embedding disabled by content creators
- Copyright restrictions block embedding for popular songs
- Regional restrictions can prevent iframe playback
- YouTube frequently changes embedding policies
- Embedding failures create poor user experience with broken videos

**Decision:**

We will launch YouTube videos in new windows/tabs instead of embedding them within the application. The KJ manually controls video playback and queue advancement.

**Implementation:**

```javascript
function launchYouTube(videoId, fullscreen = false) {
  const url = `https://www.youtube.com/watch?v=${videoId}&autoplay=1`;
  const features = fullscreen 
    ? 'fullscreen=yes,width=1920,height=1080'
    : 'width=1280,height=720';
  
  window.open(url, '_blank', features);
}
```

**Consequences:**

- **Pros:**
  - **Reliability**: Bypasses embedding restrictions and copyright blocks
  - **Compatibility**: Works with all YouTube videos regardless of embedding settings
  - **Performance**: Reduces application complexity and resource usage
  - **User Familiarity**: Users know YouTube's native video controls and interface
  - **Copyright Compliance**: Avoids potential legal issues with embedding restricted content
  - **Future-Proof**: Not affected by changes to YouTube's embedding policies

- **Cons:**
  - **Manual Control**: KJ must manually advance queue after each song ends
  - **Window Management**: Multiple windows/tabs may clutter the interface
  - **User Experience**: Less seamless than embedded playback would be
  - **Context Switching**: Users switch between app and YouTube contexts
  - **Dependency**: Relies on KJ attention for proper session flow

**Alternatives Considered:**

1. **YouTube Embed API**: Rejected due to high failure rate with karaoke content
2. **YouTube Player API**: Rejected for same embedding restriction issues
3. **Alternative Video Hosts**: Rejected due to limited karaoke content availability
4. **Local Video Files**: Rejected due to copyright and storage limitations

**Related Decisions:**

- Links to ADR-002 (Drupal content management provides curated alternatives)
- Links to ADR-003 (Firebase real-time updates support manual queue management)