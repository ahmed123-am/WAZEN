import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/WAZEN/', // اسم المستودع الخاص بك على GitHub
  build: {
    chunkSizeWarningLimit: 1000,
  },
});