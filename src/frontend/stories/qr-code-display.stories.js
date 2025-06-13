import '../frontend/qr-code-display.js';

export default {
  title: 'Components/QR Code Display',
  component: 'qr-code-display',
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text', description: 'Text to encode as QR code' },
  },
};

const Template = (args) => {
  const el = document.createElement('qr-code-display');
  if (args.text) el.text = args.text;
  return el;
};

export const Default = Template.bind({});
Default.args = {
  text: 'https://karaoke.mn/join/ROOM123',
}; 