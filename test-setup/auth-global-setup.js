// test-setup/auth-global-setup.js
const { execSync } = require('child_process');

async function globalSetup() {
  console.log('Auth Global Setup: Initializing authentication test environment...');

  try {
    // 启动数据库服务
    console.log('Starting database services...');
    execSync('docker-compose -f docker-compose.dev.yml up -d postgres redis minio', { stdio: 'inherit' });
    
    // 等待数据库启动
    console.log('Waiting for database services to be ready...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // 检查数据库连接
    console.log('Checking database connection...');
    execSync('docker exec nz-market-postgres-1 pg_isready -U market', { stdio: 'inherit' });
    
    // 创建测试用户和测试数据
    console.log('Creating test users and data...');
    await createTestUsers();
    
    console.log('Auth Global Setup: Authentication test environment ready!');
  } catch (error) {
    console.error('Failed during auth global setup:', error);
    process.exit(1);
  }
}

async function createTestUsers() {
  const testUsers = [
    {
      displayName: 'Test User 1',
      email: 'testuser1@example.com',
      password: 'Password123!'
    },
    {
      displayName: 'Test User 2', 
      email: 'testuser2@example.com',
      password: 'Password123!'
    },
    {
      displayName: 'Admin User',
      email: 'admin@example.com',
      password: 'AdminPassword123!'
    }
  ];

  for (const user of testUsers) {
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      
      if (response.ok) {
        console.log(`Created test user: ${user.email}`);
      } else {
        console.log(`Test user ${user.email} might already exist`);
      }
    } catch (error) {
      console.log(`Could not create test user ${user.email}: ${error.message}`);
    }
  }
}

module.exports = globalSetup;
