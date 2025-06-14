import { expect } from '@storybook/test-runner';
import './toggle-view-button.js';

export default {
  title: 'Components/Toggle View Button',
  component: 'toggle-view-button',
};

export const Default = () => {
  const el = document.createElement('toggle-view-button');
  return el;
};

Default.play = async ({ canvasElement }) => {
  await expect(canvasElement).toBeAccessible();
};
