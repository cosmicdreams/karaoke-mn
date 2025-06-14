import { expect } from '@storybook/test-runner';
import './search-bar-with-status.js';

export default {
  title: 'Components/Search Bar With Status',
  component: 'search-bar-with-status',
};

export const Default = () => {
  const el = document.createElement('search-bar-with-status');
  return el;
};

Default.play = async ({ canvasElement }) => {
  await expect(canvasElement).toBeAccessible();
};
