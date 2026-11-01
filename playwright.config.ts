import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  use: { baseURL: 'http://localhost:3000', reducedMotion: 'reduce' },
  webServer: {
    command: 'pnpm start',
    env: {
      LEAD_INTAKE_ENABLED: 'false',
      DATABASE_URL: '',
      LEAD_HASH_SECRET: '',
      LEAD_INTAKE_URL: '',
      LEAD_INTAKE_TOKEN: '',
    },
    url: 'http://localhost:3000',
    reuseExistingServer: false,
  },
  reporter: 'list',
})
