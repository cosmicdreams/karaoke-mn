import { css } from 'lit';

export const spacingStyles = css`
  :host {
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 2rem;
  }
`;

export const surfaceStyles = css`
  background: var(--surface-color);
  color: var(--text-color);
`;

export const containerStyles = css`
  .container {
    background: var(--surface-color);
    padding: var(--spacing-lg);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

export const mobileLandscapeStyles = css`
  @media (orientation: landscape) and (max-width: var(--breakpoint-phone)) {
    .container {
      width: 100%;
      border-radius: 0;
    }
  }
`;
