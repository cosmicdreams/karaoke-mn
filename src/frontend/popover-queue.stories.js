import { expect } from '@storybook/test-runner';
import './popover-queue.js';

export default {
  title: 'Components/Popover Queue',
  component: 'popover-queue',
};

export const Default = () => {
  const el = document.createElement('popover-queue');
  return el;
};

Default.play = async ({ canvasElement }) => {
  await expect(canvasElement).toBeAccessible();
};
