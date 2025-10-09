const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test-scripts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  timeout: 30 * 1000,
  // 不使用全局设置
  // globalSetup: require.resolve('./test-setup/global-setup.js'),
  // globalTeardown: require.resolve('./test-setup/global-teardown.js'),
});
