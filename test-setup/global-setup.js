/**
 * 全局测试设置
 * 在测试运行前准备测试环境
 */

const { chromium } = require('@playwright/test');
const { execSync } = require('child_process');

async function globalSetup(config) {
  console.log('🚀 开始全局测试设置...');
  
  try {
    // 1. 启动数据库服务
    console.log('📊 启动数据库服务...');
    execSync('docker-compose -f docker-compose.dev.yml up -d postgres redis minio', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    // 等待数据库启动
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // 2. 检查服务状态
    console.log('🔍 检查服务状态...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // 检查前端服务
    try {
      await page.goto('http://localhost:3001', { timeout: 30000 });
      console.log('✅ 前端服务运行正常');
    } catch (error) {
      console.log('⚠️ 前端服务未启动，将在测试中自动启动');
    }
    
    // 检查后端API
    try {
      const response = await page.request.get('http://localhost:8080/api/actuator/health');
      if (response.ok()) {
        console.log('✅ 后端API服务运行正常');
      } else {
        console.log('⚠️ 后端API服务响应异常');
      }
    } catch (error) {
      console.log('⚠️ 后端API服务未启动，将在测试中自动启动');
    }
    
    await browser.close();
    
    // 3. 创建测试数据
    console.log('📝 创建测试数据...');
    await createTestData();
    
    console.log('✅ 全局测试设置完成');
    
  } catch (error) {
    console.error('❌ 全局测试设置失败:', error);
    throw error;
  }
}

async function createTestData() {
  const { chromium } = require('@playwright/test');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // 创建测试用户
    const testUsers = [
      {
        email: 'buyer@test.com',
        password: 'Test123!',
        displayName: '测试买家',
        role: 'USER'
      },
      {
        email: 'seller@test.com',
        password: 'Test123!',
        displayName: '测试卖家',
        role: 'USER'
      },
      {
        email: 'admin@test.com',
        password: 'Admin123!',
        displayName: '测试管理员',
        role: 'ADMIN'
      }
    ];
    
    for (const user of testUsers) {
      try {
        const response = await page.request.post('http://localhost:8080/api/auth/register', {
          data: user
        });
        
        if (response.ok()) {
          console.log(`✅ 创建测试用户: ${user.email}`);
        } else {
          console.log(`⚠️ 用户可能已存在: ${user.email}`);
        }
      } catch (error) {
        console.log(`⚠️ 创建用户失败: ${user.email}`, error.message);
      }
    }
    
    // 创建测试商品分类
    const categories = [
      { name: '电子产品', slug: 'electronics' },
      { name: '服装配饰', slug: 'clothing' },
      { name: '家具家居', slug: 'furniture' },
      { name: '运动户外', slug: 'sports' },
      { name: '图书文具', slug: 'books' }
    ];
    
    // 获取管理员令牌
    const adminLoginResponse = await page.request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: 'admin@test.com',
        password: 'Admin123!'
      }
    });
    
    if (adminLoginResponse.ok()) {
      const adminData = await adminLoginResponse.json();
      const adminToken = adminData.accessToken;
      
      for (const category of categories) {
        try {
          const response = await page.request.post('http://localhost:8080/api/admin/categories', {
            headers: {
              'Authorization': `Bearer ${adminToken}`
            },
            data: category
          });
          
          if (response.ok()) {
            console.log(`✅ 创建分类: ${category.name}`);
          }
        } catch (error) {
          console.log(`⚠️ 创建分类失败: ${category.name}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ 创建测试数据失败:', error);
  } finally {
    await browser.close();
  }
}

module.exports = globalSetup;
