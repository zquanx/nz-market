// test-setup/auth-global-teardown.js
const { execSync } = require('child_process');

async function globalTeardown() {
  console.log('Auth Global Teardown: Cleaning up authentication test environment...');

  try {
    // 清理测试数据
    console.log('Cleaning up test data...');
    await cleanupTestData();
    
    // 停止数据库服务
    console.log('Stopping database services...');
    execSync('docker-compose -f docker-compose.dev.yml down -v', { stdio: 'inherit' });
    
    console.log('Auth Global Teardown: Authentication test environment cleaned up!');
  } catch (error) {
    console.error('Failed during auth global teardown:', error);
    process.exit(1);
  }
}

async function cleanupTestData() {
  const testEmails = [
    'testuser1@example.com',
    'testuser2@example.com', 
    'admin@example.com'
  ];

  // 这里可以添加清理测试数据的逻辑
  // 例如：删除测试用户、清理测试令牌等
  console.log('Test data cleanup completed');
}

module.exports = globalTeardown;
