const style = document.createElement('style');
style.textContent = `
  :root {
    --bg-color: #111;
    --text-color: #fff;
    --accent-color: #ff4081;
    --surface-color: #222;
  }
  body {
    margin: 0;
    background: var(--bg-color);
    color: var(--text-color);
    font-family: Arial, Helvetica, sans-serif;
  }
  button {
    background: var(--accent-color);
    color: var(--text-color);
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 4px;
  }
`;
document.head.appendChild(style);
