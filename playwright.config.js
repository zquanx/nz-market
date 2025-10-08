/**
 * Playwright 测试配置文件
 * 用于 Kiwi Market 二手商品交易平台自动化测试
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // 测试目录
  testDir: './test-scripts',
  
  // 全局测试配置
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // 报告配置
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  
  // 全局设置
  use: {
    // 基础URL
    baseURL: 'http://localhost:3001',
    
    // 浏览器配置
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // 超时设置
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    // 忽略HTTPS错误
    ignoreHTTPSErrors: true,
    
    // 用户代理
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },

  // 项目配置 - 多浏览器测试
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // 移动端测试
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // 开发服务器配置
  webServer: [
    {
      command: 'cd nz-market-frontend && npm run dev',
      port: 3001,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      command: 'cd nz-market-backend && mvn spring-boot:run -DskipTests',
      port: 8080,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    }
  ],

  // 测试环境变量
  env: {
    API_BASE_URL: 'http://localhost:8080/api',
    FRONTEND_URL: 'http://localhost:3001',
    TEST_USER_EMAIL: 'test@example.com',
    TEST_USER_PASSWORD: 'Test123!',
    ADMIN_EMAIL: 'admin@example.com',
    ADMIN_PASSWORD: 'Admin123!'
  },

  // 测试超时
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },

  // 输出目录
  outputDir: 'test-results/',
  
  // 全局设置和清理
  globalSetup: require.resolve('./test-setup/global-setup.js'),
  globalTeardown: require.resolve('./test-setup/global-teardown.js'),
});
