import { defineConfig } from 'vite';

export default defineConfig({
  // Serve and build the Lit SPA under src/frontend
  root: 'src/frontend',
  build: {
    // Output built assets to ../../public/dist (for Express to serve statically)
    outDir: '../../public/dist',
    emptyOutDir: true,
  },
});
