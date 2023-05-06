// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest" />

import * as path from 'path'

// Configure Vitest (https://vitest.dev/config/)

import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@/': path.join(__dirname, 'src/'),
    },
  },
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    globals: false,
  },
})
