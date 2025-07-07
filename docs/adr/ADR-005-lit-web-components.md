# ADR-005: Lit Web Components Framework Choice

**Status:** Accepted

**Context:**

The application needs a frontend framework for building modular, interactive user interfaces across KJ dashboard, guest interfaces, and main screen displays. Several options were considered:

1. **React**: Most popular, large ecosystem, virtual DOM
2. **Vue**: Progressive framework, good developer experience
3. **Angular**: Full framework, TypeScript-first, steep learning curve
4. **Lit Web Components**: Standards-based, lightweight, native web components
5. **Vanilla JavaScript**: No framework, full control, high development overhead

Key requirements:
- **Component Isolation**: True encapsulation for reusable UI elements
- **Performance**: Fast loading and rendering for mobile devices (Jeff's kiosk users)
- **Standards Compliance**: Future-proof technology choices
- **Learning Curve**: Reasonable onboarding for new developers
- **Bundle Size**: Minimal overhead for mobile-first experience

**Decision:**

We will use Lit for building modular, reusable web components.

**Implementation:**

```javascript
// Example Lit component structure
import { LitElement, html, css } from 'lit';

export class GuestSongSearch extends LitElement {
  static properties = {
    searchQuery: { state: true },
    results: { state: true }
  };
  
  static styles = css`
    :host {
      display: block;
      background: var(--surface-color);
    }
  `;
  
  render() {
    return html`
      <input .value=${this.searchQuery} @input=${this._handleSearch}>
      ${this.results.map(song => html`<song-card .song=${song}></song-card>`)}
    `;
  }
}

customElements.define('guest-song-search', GuestSongSearch);
```

**Consequences:**

- **Pros:**
  - **Native Web Standards**: Built on Web Components standards (Custom Elements, Shadow DOM, HTML Templates)
  - **Framework Agnostic**: Components work in any framework or vanilla HTML
  - **Lightweight**: Minimal runtime (~5KB) compared to React (~45KB) or Vue (~35KB)
  - **True Encapsulation**: Shadow DOM provides real style and DOM isolation
  - **Future-Proof**: Based on web standards, not proprietary abstractions
  - **Performance**: Efficient updates with reactive properties, no virtual DOM overhead
  - **Developer Experience**: Declarative templates, TypeScript support, good tooling
  - **Component Reusability**: Easy to share components across different applications

- **Cons:**
  - **Smaller Ecosystem**: Fewer third-party components compared to React/Vue
  - **Learning Curve**: Developers may be more familiar with React/Vue patterns
  - **Browser Support**: Requires modern browsers (though polyfills available)
  - **Community Size**: Smaller community compared to React ecosystem
  - **Debugging Tools**: Fewer browser extensions and debugging tools
  - **SSR Complexity**: Server-side rendering more complex than React/Next.js

**Alternatives Considered:**

1. **React**: Rejected due to larger bundle size and unnecessary complexity for this use case
2. **Vue**: Rejected for similar bundle size concerns and framework lock-in
3. **Angular**: Rejected due to steep learning curve and enterprise-focused complexity
4. **Vanilla JS**: Rejected due to high development overhead for component management
5. **Svelte**: Considered but Lit's standards-based approach preferred for longevity

**Technical Benefits for Karaoke MN:**

- **Mobile Performance**: Critical for Jeff's street kiosk where users have varying device capabilities
- **Component Isolation**: Queue displays, search interfaces, and controls can be truly independent
- **Easy Integration**: Can integrate with any future backend or embed in other applications
- **Maintainability**: Standards-based code is easier to understand and maintain long-term

**Related Decisions:**

- Links to ADR-003 (Firebase integration works seamlessly with Lit reactive properties)
- Supports ADR-004 (Lightweight framework doesn't interfere with YouTube launch strategy)