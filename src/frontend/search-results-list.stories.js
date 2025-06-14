import { expect } from '@storybook/test-runner';
import './search-results-list.js';

export default {
  title: 'Components/Search Results List',
  component: 'search-results-list',
};

export const Default = () => {
  const el = document.createElement('search-results-list');
  return el;
};

Default.play = async ({ canvasElement }) => {
  await expect(canvasElement).toBeAccessible();
};
