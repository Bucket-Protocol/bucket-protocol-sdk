import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    include: ['./test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    pool: 'forks', // 使用 child_process 避免 tinypool worker.js 路徑解析問題
    testTimeout: 10_000,
    hookTimeout: 30_000,
    retry: 1,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/_generated/**', '**/*.d.ts'],
    },
  },
});
