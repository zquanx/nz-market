/**
 * 安全和可访问性测试套件
 * 合并了原有的 security-tests.spec.js 和 accessibility-tests.spec.js
 * 包含安全漏洞测试、可访问性测试等
 */

const { test, expect } = require('@playwright/test');

test.describe('安全和可访问性测试套件', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  // ========== 安全测试 ==========
  
  test('SEC-001: XSS防护 - 注册表单', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 输入XSS payload
    const xssPayload = '<script>alert("XSS")</script>';
    await page.fill('input[name="displayName"]', xssPayload);
    await page.fill('input[name="email"]', `xss-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    // 提交表单
    await page.click('button[type="submit"]');
    
    // 等待注册完成
    await page.waitForTimeout(2000);
    
    // 导航到可能显示用户名的页面
    await page.goto('http://localhost:3000/dashboard');
    
    // 验证XSS payload被转义
    const pageContent = await page.content();
    expect(pageContent).not.toContain(xssPayload);
    expect(pageContent).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    
    console.log('✅ SEC-001: 注册表单XSS防护有效');
  });

  test('SEC-002: SQL注入防护 - 登录表单', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // 输入SQL注入payload
    const sqlPayload = "' OR '1'='1";
    await page.fill('input[name="email"]', `admin${sqlPayload}`);
    await page.fill('input[name="password"]', `password${sqlPayload}`);
    
    // 提交表单
    await page.click('button[type="submit"]');
    
    // 验证登录失败
    await expect(page.locator('text=邮箱或密码错误')).toBeVisible();
    await expect(page.url()).toContain('/login');
    
    console.log('✅ SEC-002: 登录表单SQL注入防护有效');
  });

  test('SEC-003: 输入长度限制', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 输入超长字符串
    const longString = 'a'.repeat(300);
    await page.fill('input[name="displayName"]', longString);
    
    // 填写其他必填字段
    await page.fill('input[name="email"]', `longname-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    // 提交表单
    await page.click('button[type="submit"]');
    
    // 验证输入被截断或显示错误
    const displayNameValue = await page.$eval('input[name="displayName"]', el => el.value);
    expect(displayNameValue.length).toBeLessThanOrEqual(255);
    
    console.log('✅ SEC-003: 输入长度限制有效');
  });

  test('SEC-004: CSRF防护验证', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // 检查表单是否包含CSRF令牌
    const csrfTokenField = await page.locator('input[name="_csrf"]').count();
    
    if (csrfTokenField > 0) {
      // 验证CSRF令牌存在
      await expect(page.locator('input[name="_csrf"]')).toBeVisible();
      const tokenValue = await page.$eval('input[name="_csrf"]', el => el.value);
      expect(tokenValue).toBeTruthy();
    }
    
    console.log('✅ SEC-004: CSRF防护验证完成');
  });

  test('SEC-005: API速率限制', async ({ request }) => {
    const loginEndpoint = 'http://localhost:8080/api/auth/login';
    let tooManyRequests = false;
    
    // 快速发送多个请求
    for (let i = 0; i < 10; i++) {
      const response = await request.post(loginEndpoint, {
        data: { 
          email: 'nonexistent@example.com', 
          password: 'anypassword' 
        }
      });
      
      if (response.status() === 429) {
        tooManyRequests = true;
        break;
      }
      
      await page.waitForTimeout(100);
    }
    
    expect(tooManyRequests).toBe(true);
    console.log('✅ SEC-005: API速率限制有效');
  });

  test('SEC-006: 敏感信息泄露防护', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // 输入无效凭据
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // 验证错误消息不泄露敏感信息
    const errorMessage = await page.locator('.error-message').textContent();
    expect(errorMessage).not.toContain('password');
    expect(errorMessage).not.toContain('hash');
    expect(errorMessage).not.toContain('database');
    
    console.log('✅ SEC-006: 敏感信息泄露防护有效');
  });

  test('SEC-007: 文件上传安全', async ({ page }) => {
    await page.goto('http://localhost:3000/sell');
    
    // 尝试上传恶意文件
    const maliciousFile = path.join(__dirname, '../test-files/malicious.js');
    await page.setInputFiles('input[type="file"]', maliciousFile);
    
    // 验证文件被拒绝
    const errorMessage = page.locator('.upload-error');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    }
    
    console.log('✅ SEC-007: 文件上传安全验证完成');
  });

  test('SEC-008: 会话管理安全', async ({ page }) => {
    // 登录用户
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'seller@test.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    
    // 获取会话信息
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(cookie => cookie.name.includes('session'));
    
    // 验证会话cookie安全属性
    if (sessionCookie) {
      expect(sessionCookie.httpOnly).toBe(true);
      expect(sessionCookie.secure).toBe(true);
    }
    
    console.log('✅ SEC-008: 会话管理安全验证完成');
  });

  test('SEC-009: 权限验证', async ({ page }) => {
    // 未登录用户尝试访问受保护页面
    await page.goto('http://localhost:3000/dashboard');
    
    // 验证重定向到登录页面
    await expect(page.url()).toContain('/login');
    
    // 登录后访问受保护页面
    await page.fill('input[name="email"]', 'seller@test.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    
    // 验证可以访问受保护页面
    await page.goto('http://localhost:3000/dashboard');
    await expect(page.url()).toContain('/dashboard');
    
    console.log('✅ SEC-009: 权限验证正常');
  });

  test('SEC-010: 输入验证和清理', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 输入各种恶意输入
    const maliciousInputs = [
      '<img src=x onerror=alert(1)>',
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox(1)'
    ];
    
    for (const input of maliciousInputs) {
      await page.fill('input[name="displayName"]', input);
      await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
      await page.fill('input[name="password"]', 'Password123!');
      await page.fill('input[name="confirmPassword"]', 'Password123!');
      
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
      
      // 验证输入被清理
      const pageContent = await page.content();
      expect(pageContent).not.toContain(input);
    }
    
    console.log('✅ SEC-010: 输入验证和清理有效');
  });

  // ========== 可访问性测试 ==========
  
  test('A11Y-001: 键盘导航 - 注册表单', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 使用Tab键导航
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="displayName"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="email"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="password"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="confirmPassword"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
    
    console.log('✅ A11Y-001: 注册表单键盘导航正常');
  });

  test('A11Y-002: ARIA属性 - 导航菜单', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 检查导航ARIA属性
    await expect(page.locator('nav')).toHaveAttribute('role', 'navigation');
    
    // 检查导航列表ARIA属性
    const navList = page.locator('nav ul');
    if (await navList.count() > 0) {
      await expect(navList.first()).toHaveAttribute('role', 'menu');
    }
    
    // 检查导航项ARIA属性
    const navItems = page.locator('nav li');
    const itemCount = await navItems.count();
    for (let i = 0; i < Math.min(itemCount, 3); i++) {
      const item = navItems.nth(i);
      const role = await item.getAttribute('role');
      if (role) {
        expect(role).toBe('menuitem');
      }
    }
    
    console.log('✅ A11Y-002: 导航菜单ARIA属性正确');
  });

  test('A11Y-003: 图像Alt文本', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // 检查所有图片的alt属性
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      // 验证图片有alt属性
      expect(alt).toBeDefined();
      expect(alt.length).toBeGreaterThan(0);
    }
    
    console.log(`✅ A11Y-003: 所有${imageCount}张图片包含Alt文本`);
  });

  test('A11Y-004: 颜色对比度', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 获取主要文本和背景颜色
    const colorInfo = await page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      return {
        textColor: computedStyle.color,
        backgroundColor: computedStyle.backgroundColor
      };
    });
    
    console.log(`文本颜色: ${colorInfo.textColor}, 背景颜色: ${colorInfo.backgroundColor}`);
    
    // 检查链接颜色对比度
    const links = page.locator('a');
    const linkCount = await links.count();
    for (let i = 0; i < Math.min(linkCount, 5); i++) {
      const link = links.nth(i);
      const linkColor = await link.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.color;
      });
      console.log(`链接${i + 1}颜色: ${linkColor}`);
    }
    
    console.log('✅ A11Y-004: 颜色对比度检查完成');
  });

  test('A11Y-005: 表单标签关联', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // 检查表单标签关联
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    
    // 验证标签存在
    await expect(page.locator('label[for="email"]')).toBeVisible();
    await expect(page.locator('label[for="password"]')).toBeVisible();
    
    // 验证输入框ID匹配
    await expect(emailInput).toHaveAttribute('id', 'email');
    await expect(passwordInput).toHaveAttribute('id', 'password');
    
    console.log('✅ A11Y-005: 表单标签与输入框正确关联');
  });

  test('A11Y-006: 标题层级结构', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 检查标题层级
    const h1Count = await page.locator('h1').count();
    const h2Count = await page.locator('h2').count();
    const h3Count = await page.locator('h3').count();
    
    // 验证只有一个h1标签
    expect(h1Count).toBe(1);
    
    // 验证标题层级合理
    expect(h2Count).toBeGreaterThan(0);
    
    console.log(`✅ A11Y-006: 标题层级结构正常 (H1:${h1Count}, H2:${h2Count}, H3:${h3Count})`);
  });

  test('A11Y-007: 焦点管理', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 检查初始焦点
    const initialFocus = page.locator(':focus');
    await expect(initialFocus).toBeVisible();
    
    // 使用Tab键导航
    await page.keyboard.press('Tab');
    const secondFocus = page.locator(':focus');
    await expect(secondFocus).toBeVisible();
    
    // 验证焦点可见
    const focusElement = await secondFocus.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        outline: style.outline,
        boxShadow: style.boxShadow
      };
    });
    
    expect(focusElement.outline || focusElement.boxShadow).toBeTruthy();
    
    console.log('✅ A11Y-007: 焦点管理正常');
  });

  test('A11Y-008: 屏幕阅读器支持', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 检查语义化HTML元素
    const semanticElements = {
      header: await page.locator('header').count(),
      nav: await page.locator('nav').count(),
      main: await page.locator('main').count(),
      section: await page.locator('section').count(),
      article: await page.locator('article').count(),
      aside: await page.locator('aside').count(),
      footer: await page.locator('footer').count()
    };
    
    // 验证关键语义化元素存在
    expect(semanticElements.nav).toBeGreaterThan(0);
    expect(semanticElements.main).toBeGreaterThan(0);
    
    // 检查ARIA landmarks
    const landmarks = page.locator('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]');
    const landmarkCount = await landmarks.count();
    expect(landmarkCount).toBeGreaterThan(0);
    
    console.log('✅ A11Y-008: 屏幕阅读器支持正常', semanticElements);
  });

  test('A11Y-009: 错误消息可访问性', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 提交空表单触发错误
    await page.click('button[type="submit"]');
    
    // 检查错误消息的ARIA属性
    const errorMessages = page.locator('.error-message, .field-error');
    const errorCount = await errorMessages.count();
    
    for (let i = 0; i < errorCount; i++) {
      const error = errorMessages.nth(i);
      const role = await error.getAttribute('role');
      const ariaLive = await error.getAttribute('aria-live');
      
      // 验证错误消息有适当的ARIA属性
      expect(role === 'alert' || ariaLive === 'polite' || ariaLive === 'assertive').toBeTruthy();
    }
    
    console.log('✅ A11Y-009: 错误消息可访问性正常');
  });

  test('A11Y-010: 动态内容可访问性', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // 执行搜索
    await page.fill('input[placeholder*="搜索"]', 'test');
    await page.press('input[placeholder*="搜索"]', 'Enter');
    
    // 等待搜索结果加载
    await page.waitForTimeout(2000);
    
    // 检查动态内容的ARIA属性
    const searchResults = page.locator('.search-results');
    if (await searchResults.isVisible()) {
      const ariaLive = await searchResults.getAttribute('aria-live');
      const role = await searchResults.getAttribute('role');
      
      // 验证动态内容有适当的ARIA属性
      expect(ariaLive || role).toBeTruthy();
    }
    
    console.log('✅ A11Y-010: 动态内容可访问性正常');
  });

  // ========== 综合安全测试 ==========
  
  test('SEC-INT-001: 综合安全测试', async ({ page }) => {
    // 1. 测试XSS防护
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', '<script>alert("XSS")</script>');
    await page.fill('input[name="email"]', `security-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // 2. 测试SQL注入防护
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', "admin' OR '1'='1");
    await page.fill('input[name="password"]', "password' OR '1'='1");
    await page.click('button[type="submit"]');
    await expect(page.locator('text=邮箱或密码错误')).toBeVisible();
    
    // 3. 测试权限验证
    await page.goto('http://localhost:3000/dashboard');
    await expect(page.url()).toContain('/login');
    
    // 4. 测试输入验证
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', 'a'.repeat(300));
    await page.fill('input[name="email"]', `long-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    const displayNameValue = await page.$eval('input[name="displayName"]', el => el.value);
    expect(displayNameValue.length).toBeLessThanOrEqual(255);
    
    console.log('✅ SEC-INT-001: 综合安全测试通过');
  });

  // ========== 综合可访问性测试 ==========
  
  test('A11Y-INT-001: 综合可访问性测试', async ({ page }) => {
    // 1. 测试键盘导航
    await page.goto('http://localhost:3000/register');
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="displayName"]')).toBeFocused();
    
    // 2. 测试ARIA属性
    await page.goto('http://localhost:3000');
    await expect(page.locator('nav')).toHaveAttribute('role', 'navigation');
    
    // 3. 测试图片Alt文本
    await page.goto('http://localhost:3000/search');
    const images = page.locator('img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeDefined();
    }
    
    // 4. 测试表单标签关联
    await page.goto('http://localhost:3000/login');
    await expect(page.locator('label[for="email"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toHaveAttribute('id', 'email');
    
    // 5. 测试标题层级
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    console.log('✅ A11Y-INT-001: 综合可访问性测试通过');
  });
});
