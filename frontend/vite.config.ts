import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const config = {
    plugins: [react()],
    base: '/',
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };

  const deployment = process.env.VITE_DEPLOYMENT.toString();

  if (command !== 'serve' && deployment === 'github-page') {
    config.base = '/luna-eprocurement-system/';
  }

  return config;
});
