/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';

// https://vitejs.dev/config/
export default defineConfig({
  // 定义别名
  resolve: {
    extensions: ['.ts', '.js', '.jsx', '.tsx', '.json', '.vue'],
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
      {
        find: '#',
        replacement: path.resolve(__dirname, 'types'),
      },
    ],
  },

  plugins: [
    vue(),
    VueSetupExtend(),

  ],
});
