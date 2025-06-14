import { expect } from '@storybook/test-runner';
import '../src/frontend/guest-song-search.js';

export default {
  title: 'Responsive/Guest Song Search',
  component: 'guest-song-search',
  parameters: { chromatic: { viewports: [320, 768, 1280] } },
};

export const Default = () => {
  const el = document.createElement('guest-song-search');
  return el;
};

Default.play = async ({ canvasElement }) => {
  await expect(canvasElement).toBeAccessible();
};
