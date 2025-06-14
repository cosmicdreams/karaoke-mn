const style = document.createElement('style');
style.textContent = `
  :root {
    --bg-color: #111;
    --text-color: #fff;
    --accent-color: #ff4081;
    --surface-color: #222;
    --error-color: #ff5252;
    --font-family: Arial, Helvetica, sans-serif;
    --font-size-base: 16px;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 2rem;
    --breakpoint-phone: 480px;
    --breakpoint-tablet: 768px;
    --breakpoint-tv: 1280px;
  }

  :root[data-theme='light'] {
    --bg-color: #fafafa;
    --text-color: #111;
    --surface-color: #fff;
    --accent-color: #6200ee;
    --error-color: #b00020;
  }
  body {
    margin: 0;
    background: var(--bg-color);
    color: var(--text-color);
    font-family: var(--font-family);
    font-size: var(--font-size-base);
  }
  button {
    background: var(--accent-color);
    color: var(--text-color);
    border: none;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 1rem;
    border-radius: 4px;
  }
`;
document.head.appendChild(style);
