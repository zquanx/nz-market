/**
 * 认证功能测试套件
 * 合并了原有的 auth-functionality.spec.js, user-registration.spec.js, auth-api.spec.js
 * 包含用户注册、登录、密码重置等完整认证流程
 */

const { test, expect } = require('@playwright/test');

// 测试数据
const testUsers = {
  valid: {
    email: `testuser-${Date.now()}@example.com`,
    password: 'Password123!',
    displayName: '测试用户',
    phone: '+64 21 123 4567'
  },
  duplicate: {
    email: 'duplicate@example.com',
    password: 'Password123!',
    displayName: '重复用户'
  }
};

test.describe('认证功能测试套件', () => {
  
  // ========== 用户注册测试 ==========
  
  test('AUTH-001: 正常用户注册流程', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 填写注册表单
    await page.fill('input[name="displayName"]', testUsers.valid.displayName);
    await page.fill('input[name="email"]', testUsers.valid.email);
    await page.fill('input[name="password"]', testUsers.valid.password);
    await page.fill('input[name="confirmPassword"]', testUsers.valid.password);
    
    // 提交注册
    await page.click('button[type="submit"]');
    
    // 验证注册成功
    await expect(page.locator('text=注册成功')).toBeVisible();
    console.log('✅ AUTH-001: 正常用户注册成功');
  });

  test('AUTH-002: 注册失败 - 邮箱格式无效', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 填写无效邮箱
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    // 提交注册
    await page.click('button[type="submit"]');
    
    // 验证错误消息
    await expect(page.locator('text=请输入有效的邮箱地址')).toBeVisible();
    console.log('✅ AUTH-002: 邮箱格式验证正确');
  });

  test('AUTH-003: 注册失败 - 密码强度不足', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 填写弱密码
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', '123');
    await page.fill('input[name="confirmPassword"]', '123');
    
    // 提交注册
    await page.click('button[type="submit"]');
    
    // 验证密码强度错误
    await expect(page.locator('text=密码至少6位')).toBeVisible();
    console.log('✅ AUTH-003: 密码强度验证正确');
  });

  test('AUTH-004: 注册失败 - 密码确认不匹配', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 填写不匹配的密码
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!');
    
    // 提交注册
    await page.click('button[type="submit"]');
    
    // 验证密码不匹配错误
    await expect(page.locator('text=密码不匹配')).toBeVisible();
    console.log('✅ AUTH-004: 密码确认验证正确');
  });

  test('AUTH-005: 注册失败 - 重复邮箱', async ({ page }) => {
    // 先注册一个用户
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', 'First User');
    await page.fill('input[name="email"]', testUsers.duplicate.email);
    await page.fill('input[name="password"]', testUsers.duplicate.password);
    await page.fill('input[name="confirmPassword"]', testUsers.duplicate.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // 尝试用相同邮箱注册
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', 'Second User');
    await page.fill('input[name="email"]', testUsers.duplicate.email);
    await page.fill('input[name="password"]', testUsers.duplicate.password);
    await page.fill('input[name="confirmPassword"]', testUsers.duplicate.password);
    await page.click('button[type="submit"]');
    
    // 验证重复邮箱错误
    await expect(page.locator('text=该邮箱已被注册')).toBeVisible();
    console.log('✅ AUTH-005: 重复邮箱验证正确');
  });

  test('AUTH-006: 注册失败 - 必填字段为空', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 不填写任何字段，直接提交
    await page.click('button[type="submit"]');
    
    // 验证必填字段错误
    await expect(page.locator('text=显示名称不能为空')).toBeVisible();
    await expect(page.locator('text=邮箱不能为空')).toBeVisible();
    await expect(page.locator('text=密码不能为空')).toBeVisible();
    console.log('✅ AUTH-006: 必填字段验证正确');
  });

  // ========== 用户登录测试 ==========

  test('AUTH-007: 正常用户登录流程', async ({ page }) => {
    // 先注册用户
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', 'Login Test User');
    await page.fill('input[name="email"]', testUsers.valid.email);
    await page.fill('input[name="password"]', testUsers.valid.password);
    await page.fill('input[name="confirmPassword"]', testUsers.valid.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // 登录
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', testUsers.valid.email);
    await page.fill('input[name="password"]', testUsers.valid.password);
    await page.click('button[type="submit"]');
    
    // 验证登录成功
    await expect(page.locator('text=欢迎')).toBeVisible();
    console.log('✅ AUTH-007: 正常用户登录成功');
  });

  test('AUTH-008: 登录失败 - 错误密码', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // 使用错误密码登录
    await page.fill('input[name="email"]', testUsers.valid.email);
    await page.fill('input[name="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');
    
    // 验证登录失败
    await expect(page.locator('text=邮箱或密码错误')).toBeVisible();
    console.log('✅ AUTH-008: 错误密码验证正确');
  });

  test('AUTH-009: 登录失败 - 不存在的邮箱', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // 使用不存在的邮箱登录
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // 验证登录失败
    await expect(page.locator('text=用户不存在')).toBeVisible();
    console.log('✅ AUTH-009: 不存在邮箱验证正确');
  });

  test('AUTH-010: 登录失败 - 空凭据', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // 不填写任何字段，直接提交
    await page.click('button[type="submit"]');
    
    // 验证必填字段错误
    await expect(page.locator('text=邮箱不能为空')).toBeVisible();
    await expect(page.locator('text=密码不能为空')).toBeVisible();
    console.log('✅ AUTH-010: 空凭据验证正确');
  });

  test('AUTH-011: 记住我功能', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // 填写登录信息并勾选记住我
    await page.fill('input[name="email"]', testUsers.valid.email);
    await page.fill('input[name="password"]', testUsers.valid.password);
    await page.check('input[name="remember-me"]');
    await page.click('button[type="submit"]');
    
    // 验证登录成功
    await expect(page.locator('text=欢迎')).toBeVisible();
    console.log('✅ AUTH-011: 记住我功能正常');
  });

  // ========== 密码重置测试 ==========

  test('AUTH-012: 忘记密码流程', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.click('text=忘记密码');
    
    // 填写邮箱
    await page.fill('input[name="email"]', testUsers.valid.email);
    await page.click('button[type="submit"]');
    
    // 验证重置邮件发送成功
    await expect(page.locator('text=密码重置邮件已发送')).toBeVisible();
    console.log('✅ AUTH-012: 忘记密码邮件发送成功');
  });

  test('AUTH-013: 忘记密码 - 无效邮箱', async ({ page }) => {
    await page.goto('http://localhost:3000/forgot-password');
    
    // 填写不存在的邮箱
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.click('button[type="submit"]');
    
    // 验证错误消息
    await expect(page.locator('text=邮箱不存在')).toBeVisible();
    console.log('✅ AUTH-013: 无效邮箱验证正确');
  });

  test('AUTH-014: 密码重置 - 有效重置令牌', async ({ page }) => {
    const resetToken = 'valid-reset-token-12345';
    
    await page.goto(`http://localhost:3000/reset-password?token=${resetToken}`);
    
    // 填写新密码
    await page.fill('input[name="password"]', 'NewPassword123!');
    await page.fill('input[name="confirmPassword"]', 'NewPassword123!');
    await page.click('button[type="submit"]');
    
    // 验证密码重置成功
    await expect(page.locator('text=密码重置成功')).toBeVisible();
    console.log('✅ AUTH-014: 密码重置成功');
  });

  test('AUTH-015: 密码重置 - 无效重置令牌', async ({ page }) => {
    const invalidToken = 'invalid-token-12345';
    
    await page.goto(`http://localhost:3000/reset-password?token=${invalidToken}`);
    
    // 验证无效令牌错误
    await expect(page.locator('text=无效或过期令牌')).toBeVisible();
    console.log('✅ AUTH-015: 无效令牌验证正确');
  });

  // ========== API测试 ==========

  test('AUTH-016: 注册API - 正常请求', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/auth/register', {
      data: {
        displayName: 'API Test User',
        email: `apitest-${Date.now()}@example.com`,
        password: 'Password123!'
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('accessToken');
    expect(data).toHaveProperty('refreshToken');
    expect(data).toHaveProperty('user');
    console.log('✅ AUTH-016: 注册API正常请求成功');
  });

  test('AUTH-017: 注册API - 无效邮箱格式', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/auth/register', {
      data: {
        displayName: 'API Test User',
        email: 'invalid-email',
        password: 'Password123!'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    console.log('✅ AUTH-017: 注册API无效邮箱格式验证正确');
  });

  test('AUTH-018: 登录API - 正常请求', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: testUsers.valid.email,
        password: testUsers.valid.password
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('accessToken');
    expect(data).toHaveProperty('user');
    console.log('✅ AUTH-018: 登录API正常请求成功');
  });

  test('AUTH-019: 令牌刷新API', async ({ request }) => {
    // 先登录获取refresh token
    const loginResponse = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: testUsers.valid.email,
        password: testUsers.valid.password
      }
    });
    
    const loginData = await loginResponse.json();
    
    // 使用refresh token刷新access token
    const refreshResponse = await request.post('http://localhost:8080/api/auth/refresh', {
      data: loginData.refreshToken
    });
    
    expect(refreshResponse.status()).toBe(200);
    const refreshData = await refreshResponse.json();
    expect(refreshData).toHaveProperty('accessToken');
    console.log('✅ AUTH-019: 令牌刷新API正常');
  });

  test('AUTH-020: 完整认证流程集成测试', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `fullflow-${timestamp}@example.com`;
    const originalPassword = 'OriginalPassword123!';
    const newPassword = 'NewPassword123!';
    
    // 1. 注册用户
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', 'Full Flow User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', originalPassword);
    await page.fill('input[name="confirmPassword"]', originalPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // 2. 登录用户
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', originalPassword);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=欢迎')).toBeVisible();
    
    // 3. 登出
    await page.click('text=登出');
    
    // 4. 忘记密码
    await page.goto('http://localhost:3000/login');
    await page.click('text=忘记密码');
    await page.fill('input[name="email"]', testEmail);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=密码重置邮件已发送')).toBeVisible();
    
    // 5. 重置密码（模拟）
    const resetToken = 'valid-reset-token-12345';
    await page.goto(`http://localhost:3000/reset-password?token=${resetToken}`);
    await page.fill('input[name="password"]', newPassword);
    await page.fill('input[name="confirmPassword"]', newPassword);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=密码重置成功')).toBeVisible();
    
    // 6. 用新密码登录
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', newPassword);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=欢迎')).toBeVisible();
    
    console.log('✅ AUTH-020: 完整认证流程测试成功');
  });
});
