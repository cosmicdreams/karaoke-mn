import { expect } from '@storybook/test-runner';
import '../src/frontend/settings-profile.js';

export default {
  title: 'Responsive/Settings Profile',
  component: 'settings-profile',
  parameters: { chromatic: { viewports: [320, 768, 1280] } },
};

export const Default = () => {
  const el = document.createElement('settings-profile');
  return el;
};

Default.play = async ({ canvasElement }) => {
  await expect(canvasElement).toBeAccessible();
};
