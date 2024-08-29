import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000, // You can specify the port here
  },
  build: {
    outDir: 'dist', // Output directory for the build
    sourcemap: true, // Generate source maps
  },
  resolve: {
    alias: {
      '@': '/src', // Example alias
    },
  },
});
