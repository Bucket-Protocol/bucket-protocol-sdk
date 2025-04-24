import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  tsconfig: './tsconfig.json',
  format: ['esm', 'cjs'],
  platform: 'node',
  clean: true,
  sourcemap: true,
  dts: true,
  splitting: true,
  treeshake: true,
  shims: false,
});
