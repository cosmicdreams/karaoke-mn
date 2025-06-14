import '../src/frontend/login-form.js';

export default {
  title: 'Responsive/Login Form',
  component: 'login-form',
  parameters: {
    chromatic: { viewports: [320, 768, 1280] },
  },
};

export const Default = () => {
  const el = document.createElement('login-form');
  return el;
};
