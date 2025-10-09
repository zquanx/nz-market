const { test, expect } = require('@playwright/test');

test.describe('Authentication Functionality Tests', () => {
  
  // ========== 用户注册测试用例 ==========
  
  test('TC001: 正常用户注册 - 有效邮箱和密码', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 填写注册表单
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[name="email"]', `testuser-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    // 提交注册
    await page.click('button[type="submit"]');
    
    // 验证注册成功
    await expect(page.locator('text=Registration successful')).toBeVisible();
    console.log('✅ TC001: 正常用户注册成功');
  });

  test('TC002: 注册失败 - 邮箱格式无效', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 填写无效邮箱
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    // 提交注册
    await page.click('button[type="submit"]');
    
    // 验证错误消息
    await expect(page.locator('text=Invalid email format')).toBeVisible();
    console.log('✅ TC002: 邮箱格式验证正确');
  });

  test('TC003: 注册失败 - 密码强度不足', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 填写弱密码
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', '123');
    await page.fill('input[name="confirmPassword"]', '123');
    
    // 提交注册
    await page.click('button[type="submit"]');
    
    // 验证密码强度错误
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
    console.log('✅ TC003: 密码强度验证正确');
  });

  test('TC004: 注册失败 - 密码确认不匹配', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 填写不匹配的密码
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!');
    
    // 提交注册
    await page.click('button[type="submit"]');
    
    // 验证密码不匹配错误
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
    console.log('✅ TC004: 密码确认验证正确');
  });

  test('TC005: 注册失败 - 重复邮箱', async ({ page }) => {
    const duplicateEmail = 'duplicate@example.com';
    
    // 先注册一个用户
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', 'First User');
    await page.fill('input[name="email"]', duplicateEmail);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // 等待注册完成
    await page.waitForTimeout(2000);
    
    // 尝试用相同邮箱注册
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', 'Second User');
    await page.fill('input[name="email"]', duplicateEmail);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // 验证重复邮箱错误
    await expect(page.locator('text=Email already exists')).toBeVisible();
    console.log('✅ TC005: 重复邮箱验证正确');
  });

  test('TC006: 注册失败 - 必填字段为空', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 不填写任何字段，直接提交
    await page.click('button[type="submit"]');
    
    // 验证必填字段错误
    await expect(page.locator('text=Display name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
    console.log('✅ TC006: 必填字段验证正确');
  });

  // ========== 用户登录测试用例 ==========

  test('TC007: 正常用户登录 - 有效凭据', async ({ page }) => {
    const testEmail = `logintest-${Date.now()}@example.com`;
    const testPassword = 'Password123!';
    
    // 先注册用户
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', 'Login Test User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // 登录
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    // 验证登录成功
    await expect(page.locator('text=Welcome')).toBeVisible();
    console.log('✅ TC007: 正常用户登录成功');
  });

  test('TC008: 登录失败 - 错误密码', async ({ page }) => {
    const testEmail = `logintest-${Date.now()}@example.com`;
    const correctPassword = 'Password123!';
    const wrongPassword = 'WrongPassword123!';
    
    // 先注册用户
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', 'Login Test User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', correctPassword);
    await page.fill('input[name="confirmPassword"]', correctPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // 用错误密码登录
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', wrongPassword);
    await page.click('button[type="submit"]');
    
    // 验证登录失败
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
    console.log('✅ TC008: 错误密码验证正确');
  });

  test('TC009: 登录失败 - 不存在的邮箱', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // 使用不存在的邮箱登录
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // 验证登录失败
    await expect(page.locator('text=User not found')).toBeVisible();
    console.log('✅ TC009: 不存在邮箱验证正确');
  });

  test('TC010: 登录失败 - 空凭据', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // 不填写任何字段，直接提交
    await page.click('button[type="submit"]');
    
    // 验证必填字段错误
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
    console.log('✅ TC010: 空凭据验证正确');
  });

  test('TC011: 登录成功 - 记住我功能', async ({ page }) => {
    const testEmail = `rememberme-${Date.now()}@example.com`;
    const testPassword = 'Password123!';
    
    // 先注册用户
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', 'Remember Me User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // 登录并勾选记住我
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.check('input[name="remember-me"]');
    await page.click('button[type="submit"]');
    
    // 验证登录成功
    await expect(page.locator('text=Welcome')).toBeVisible();
    console.log('✅ TC011: 记住我功能正常');
  });

  // ========== 忘记密码测试用例 ==========

  test('TC012: 忘记密码 - 有效邮箱', async ({ page }) => {
    const testEmail = `forgotpassword-${Date.now()}@example.com`;
    const testPassword = 'Password123!';
    
    // 先注册用户
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', 'Forgot Password User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // 访问忘记密码页面
    await page.goto('http://localhost:3000/login');
    await page.click('text=Forgot your password?');
    
    // 填写邮箱
    await page.fill('input[name="email"]', testEmail);
    await page.click('button[type="submit"]');
    
    // 验证重置邮件发送成功
    await expect(page.locator('text=Password reset email sent')).toBeVisible();
    console.log('✅ TC012: 忘记密码邮件发送成功');
  });

  test('TC013: 忘记密码 - 无效邮箱', async ({ page }) => {
    await page.goto('http://localhost:3000/forgot-password');
    
    // 填写不存在的邮箱
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.click('button[type="submit"]');
    
    // 验证错误消息
    await expect(page.locator('text=Email not found')).toBeVisible();
    console.log('✅ TC013: 无效邮箱验证正确');
  });

  test('TC014: 忘记密码 - 邮箱格式无效', async ({ page }) => {
    await page.goto('http://localhost:3000/forgot-password');
    
    // 填写无效邮箱格式
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    
    // 验证邮箱格式错误
    await expect(page.locator('text=Invalid email format')).toBeVisible();
    console.log('✅ TC014: 邮箱格式验证正确');
  });

  test('TC015: 密码重置 - 有效重置令牌', async ({ page }) => {
    // 这个测试需要模拟有效的重置令牌
    // 在实际环境中，这需要从邮件中获取真实的令牌
    const resetToken = 'valid-reset-token-12345';
    
    await page.goto(`http://localhost:3000/reset-password?token=${resetToken}`);
    
    // 填写新密码
    await page.fill('input[name="password"]', 'NewPassword123!');
    await page.fill('input[name="confirmPassword"]', 'NewPassword123!');
    await page.click('button[type="submit"]');
    
    // 验证密码重置成功
    await expect(page.locator('text=Password reset successful')).toBeVisible();
    console.log('✅ TC015: 密码重置成功');
  });

  test('TC016: 密码重置 - 无效重置令牌', async ({ page }) => {
    const invalidToken = 'invalid-token-12345';
    
    await page.goto(`http://localhost:3000/reset-password?token=${invalidToken}`);
    
    // 验证无效令牌错误
    await expect(page.locator('text=Invalid or expired reset token')).toBeVisible();
    console.log('✅ TC016: 无效令牌验证正确');
  });

  test('TC017: 密码重置 - 新密码强度不足', async ({ page }) => {
    const resetToken = 'valid-reset-token-12345';
    
    await page.goto(`http://localhost:3000/reset-password?token=${resetToken}`);
    
    // 填写弱密码
    await page.fill('input[name="password"]', '123');
    await page.fill('input[name="confirmPassword"]', '123');
    await page.click('button[type="submit"]');
    
    // 验证密码强度错误
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
    console.log('✅ TC017: 新密码强度验证正确');
  });

  test('TC018: 密码重置 - 确认密码不匹配', async ({ page }) => {
    const resetToken = 'valid-reset-token-12345';
    
    await page.goto(`http://localhost:3000/reset-password?token=${resetToken}`);
    
    // 填写不匹配的密码
    await page.fill('input[name="password"]', 'NewPassword123!');
    await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!');
    await page.click('button[type="submit"]');
    
    // 验证密码不匹配错误
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
    console.log('✅ TC018: 确认密码验证正确');
  });

  // ========== 综合测试用例 ==========

  test('TC019: 完整用户流程 - 注册→登录→忘记密码→重置密码', async ({ page }) => {
    const testEmail = `fullflow-${Date.now()}@example.com`;
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
    await expect(page.locator('text=Welcome')).toBeVisible();
    
    // 3. 登出
    await page.click('text=Logout');
    
    // 4. 忘记密码
    await page.goto('http://localhost:3000/login');
    await page.click('text=Forgot your password?');
    await page.fill('input[name="email"]', testEmail);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Password reset email sent')).toBeVisible();
    
    // 5. 重置密码（模拟）
    const resetToken = 'valid-reset-token-12345';
    await page.goto(`http://localhost:3000/reset-password?token=${resetToken}`);
    await page.fill('input[name="password"]', newPassword);
    await page.fill('input[name="confirmPassword"]', newPassword);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Password reset successful')).toBeVisible();
    
    // 6. 用新密码登录
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', newPassword);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Welcome')).toBeVisible();
    
    console.log('✅ TC019: 完整用户流程测试成功');
  });

  test('TC020: 多语言支持 - 中英文切换', async ({ page }) => {
    // 测试注册页面的多语言支持
    await page.goto('http://localhost:3000/register');
    
    // 检查英文界面
    await expect(page.locator('text=Create a new account')).toBeVisible();
    await expect(page.locator('text=Display Name')).toBeVisible();
    await expect(page.locator('text=Email address')).toBeVisible();
    await expect(page.locator('text=Password')).toBeVisible();
    await expect(page.locator('text=Confirm Password')).toBeVisible();
    
    // 切换到中文
    await page.click('button:has-text("EN")');
    
    // 检查中文界面
    await expect(page.locator('text=创建新账户')).toBeVisible();
    await expect(page.locator('text=显示名称')).toBeVisible();
    await expect(page.locator('text=电子邮件地址')).toBeVisible();
    await expect(page.locator('text=密码')).toBeVisible();
    await expect(page.locator('text=确认密码')).toBeVisible();
    
    // 切换回英文
    await page.click('button:has-text("中文")');
    
    // 再次检查英文界面
    await expect(page.locator('text=Create a new account')).toBeVisible();
    
    console.log('✅ TC020: 多语言支持测试成功');
  });
});
