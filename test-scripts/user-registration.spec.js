/**
 * 用户注册和登录流程自动化测试
 * 使用 Playwright 进行端到端测试
 */

const { test, expect } = require('@playwright/test');

// 测试数据
const testUser = {
  email: 'testuser@example.com',
  password: 'Test123!',
  displayName: '测试用户',
  phone: '+64 21 123 4567'
};

test.describe('用户注册和登录流程', () => {
  
  test.beforeEach(async ({ page }) => {
    // 访问首页
    await page.goto('http://localhost:3001');
  });

  test('用户注册流程', async ({ page }) => {
    // 点击注册按钮
    await page.click('text=注册');
    
    // 填写注册表单
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    await page.fill('input[name="displayName"]', testUser.displayName);
    await page.fill('input[name="phone"]', testUser.phone);
    
    // 提交表单
    await page.click('button[type="submit"]');
    
    // 验证注册成功
    await expect(page.locator('text=注册成功')).toBeVisible();
    await expect(page.locator('text=请检查您的邮箱进行验证')).toBeVisible();
    
    // 验证自动登录
    await expect(page.locator('text=欢迎, ' + testUser.displayName)).toBeVisible();
  });

  test('用户登录流程', async ({ page }) => {
    // 点击登录按钮
    await page.click('text=登录');
    
    // 填写登录表单
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    
    // 提交表单
    await page.click('button[type="submit"]');
    
    // 验证登录成功
    await expect(page.locator('text=欢迎, ' + testUser.displayName)).toBeVisible();
    
    // 验证可以访问受保护的页面
    await page.click('text=个人中心');
    await expect(page.url()).toContain('/dashboard');
  });

  test('JWT令牌管理', async ({ page }) => {
    // 登录用户
    await page.click('text=登录');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // 检查localStorage中的令牌
    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    const refreshToken = await page.evaluate(() => localStorage.getItem('refreshToken'));
    
    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();
    
    // 验证API请求包含Authorization头
    const response = await page.request.get('http://localhost:8080/api/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    expect(response.status()).toBe(200);
  });

  test('表单验证', async ({ page }) => {
    await page.click('text=注册');
    
    // 测试空表单提交
    await page.click('button[type="submit"]');
    await expect(page.locator('text=邮箱不能为空')).toBeVisible();
    await expect(page.locator('text=密码不能为空')).toBeVisible();
    
    // 测试无效邮箱格式
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', '123');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=请输入有效的邮箱地址')).toBeVisible();
    await expect(page.locator('text=密码至少8位')).toBeVisible();
    
    // 测试密码不匹配
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', 'different-password');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=密码不匹配')).toBeVisible();
  });

  test('错误处理', async ({ page }) => {
    // 测试重复邮箱注册
    await page.click('text=注册');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    await page.fill('input[name="displayName"]', testUser.displayName);
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=该邮箱已被注册')).toBeVisible();
    
    // 测试错误密码登录
    await page.click('text=登录');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', 'wrong-password');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=邮箱或密码错误')).toBeVisible();
  });
});

// API测试
test.describe('认证API测试', () => {
  
  test('注册API', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/auth/register', {
      data: {
        email: 'apitest@example.com',
        password: 'Test123!',
        displayName: 'API测试用户'
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.accessToken).toBeTruthy();
    expect(data.refreshToken).toBeTruthy();
    expect(data.user.email).toBe('apitest@example.com');
  });

  test('登录API', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: testUser.email,
        password: testUser.password
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.accessToken).toBeTruthy();
    expect(data.user.email).toBe(testUser.email);
  });

  test('令牌刷新API', async ({ request }) => {
    // 先登录获取refresh token
    const loginResponse = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: testUser.email,
        password: testUser.password
      }
    });
    
    const loginData = await loginResponse.json();
    
    // 使用refresh token刷新access token
    const refreshResponse = await request.post('http://localhost:8080/api/auth/refresh', {
      data: loginData.refreshToken
    });
    
    expect(refreshResponse.status()).toBe(200);
    const refreshData = await refreshResponse.json();
    expect(refreshData.accessToken).toBeTruthy();
    expect(refreshData.accessToken).not.toBe(loginData.accessToken);
  });
});
