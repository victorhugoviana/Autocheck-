import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(projectDir, 'index.html'),
        login: resolve(projectDir, 'login.html'),
        refueling: resolve(projectDir, 'refueling.html'),
        maintenance: resolve(projectDir, 'maintenance.html'),
      },
    },
  },
});