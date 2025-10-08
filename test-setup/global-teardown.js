/**
 * 全局测试清理
 * 在测试运行后清理测试环境
 */

const { execSync } = require('child_process');

async function globalTeardown(config) {
  console.log('🧹 开始全局测试清理...');
  
  try {
    // 1. 清理测试数据
    console.log('🗑️ 清理测试数据...');
    await cleanupTestData();
    
    // 2. 停止开发服务器（如果由测试启动）
    if (process.env.CI) {
      console.log('🛑 停止开发服务器...');
      try {
        execSync('pkill -f "npm run dev"', { stdio: 'ignore' });
        execSync('pkill -f "mvn spring-boot:run"', { stdio: 'ignore' });
      } catch (error) {
        // 忽略进程不存在的错误
      }
    }
    
    // 3. 清理Docker容器（可选）
    if (process.env.CLEANUP_DOCKER === 'true') {
      console.log('🐳 清理Docker容器...');
      try {
        execSync('docker-compose -f docker-compose.dev.yml down', { 
          stdio: 'inherit',
          cwd: process.cwd()
        });
      } catch (error) {
        console.log('⚠️ Docker清理失败:', error.message);
      }
    }
    
    console.log('✅ 全局测试清理完成');
    
  } catch (error) {
    console.error('❌ 全局测试清理失败:', error);
    // 不抛出错误，避免影响测试结果
  }
}

async function cleanupTestData() {
  const { chromium } = require('@playwright/test');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
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
      
      // 清理测试用户
      const testEmails = ['buyer@test.com', 'seller@test.com', 'test@example.com', 'apitest@example.com'];
      
      for (const email of testEmails) {
        try {
          const response = await page.request.delete(`http://localhost:8080/api/admin/users/${email}`, {
            headers: {
              'Authorization': `Bearer ${adminToken}`
            }
          });
          
          if (response.ok()) {
            console.log(`✅ 删除测试用户: ${email}`);
          }
        } catch (error) {
          console.log(`⚠️ 删除用户失败: ${email}`);
        }
      }
      
      // 清理测试商品
      try {
        const itemsResponse = await page.request.get('http://localhost:8080/api/items/search', {
          params: {
            query: '测试',
            size: 100
          }
        });
        
        if (itemsResponse.ok()) {
          const itemsData = await itemsResponse.json();
          
          for (const item of itemsData.content) {
            try {
              const deleteResponse = await page.request.delete(`http://localhost:8080/api/admin/items/${item.id}`, {
                headers: {
                  'Authorization': `Bearer ${adminToken}`
                }
              });
              
              if (deleteResponse.ok()) {
                console.log(`✅ 删除测试商品: ${item.title}`);
              }
            } catch (error) {
              console.log(`⚠️ 删除商品失败: ${item.title}`);
            }
          }
        }
      } catch (error) {
        console.log('⚠️ 获取测试商品失败');
      }
    }
    
  } catch (error) {
    console.error('❌ 清理测试数据失败:', error);
  } finally {
    await browser.close();
  }
}

module.exports = globalTeardown;
