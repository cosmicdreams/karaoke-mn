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
