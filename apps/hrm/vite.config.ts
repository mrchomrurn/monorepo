/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { fileURLToPath } from 'url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_DISCOVERY_URL, VITE_APP_BASE_PATH } = env

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/hrm',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 4400,
      host: 'localhost',
      proxy: {
        '/hrm/discovery': {
          target: VITE_APP_DISCOVERY_URL,
          changeOrigin: true,
          rewrite: path => path.replace('/hrm/discovery', ''),
        },
        '/hrm/api': {
          target: VITE_APP_DISCOVERY_URL,
          changeOrigin: true,
          rewrite: path => path.replace('/hrm/api', '/hrm'),
        },
        '/hrm/oauth': {
          target: VITE_APP_DISCOVERY_URL,
          changeOrigin: true,
          rewrite: path => path.replace('/hrm', ''),
        },
      },
    },
    base: `${VITE_APP_BASE_PATH}/`,
    preview: {
      port: 4300,
      host: 'localhost',
    },
  
    plugins: [vue(), nxViteTsPaths()],
  
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
  
    build: {
      outDir: '../../dist/apps/hrm',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  
    test: {
      watch: false,
      globals: true,
      cache: {
        dir: '../../node_modules/.vitest/apps/hrm',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  
      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/hrm',
        provider: 'v8',
      },
    },
  }
});
