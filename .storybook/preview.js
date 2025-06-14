/** @type { import('@storybook/web-components-vite').Preview } */
import '../src/frontend/app-theme.js';
import.meta.glob('../src/frontend/**/*.js', { eager: true });

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'error',
    },
  },
};

export default preview;
