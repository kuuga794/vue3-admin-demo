/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 8081,
    proxy: {
      '/api': {
        // target: 'http://192.168.169.23:19293', // 域名
        target: 'https://tanjinyi.51vip.biz/', // 域名
        // target: 'http://10.40.12.45:19293', // 域名
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api/, ''),
      },
    },
  },
  // 定义别名
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  plugins: [vue(), VueSetupExtend()],
  build: {
    assetsDir: 'assets/',
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/[name].js',
        assetFileNames: 'assets/[ext]/[name].[ext]',
      },
    },
  },
});
