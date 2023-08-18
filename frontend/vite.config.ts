import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: '/',
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };

  if (command !== 'serve') {
    config.base = '/lunar-eprocurement-system/';
  }

  return config;
});
