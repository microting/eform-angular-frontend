import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import path from 'path';

export default defineConfig({
  plugins: [
    angular({
      tsconfig: path.resolve(__dirname, './tsconfig.json'),
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setup-vitest.ts'],
    include: ['src/**/*.spec.ts'],
    exclude: [
      'node_modules',
      'dist',
      'e2e',
      'cypress',
      'tests-examples'
    ],
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['html', 'text', 'text-summary', 'lcov'],
      exclude: [
        'src/**/*.spec.ts',
        'src/**/*.module.ts',
        'src/**/*.interface.ts',
        'src/**/*.model.ts'
      ],
      include: ['src/app/**/*.ts']
    }
  },
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      'ng-gallery': path.resolve(__dirname, './src/__mocks__/ng-gallery.ts'),
      'ng-gallery/lightbox': path.resolve(__dirname, './src/__mocks__/ng-gallery/lightbox.ts')
    }
  }
});
