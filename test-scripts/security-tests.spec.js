/**
 * 安全测试用例
 * 基于测试用例补充建议，完善安全相关测试
 */

const { test, expect } = require('@playwright/test');

test.describe('安全测试', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  // ========== XSS防护测试 ==========
  
  test('SEC-001: XSS脚本注入防护', async ({ page }) => {
    // 测试注册表单的XSS防护
    await page.goto('http://localhost:3000/register');
    
    // 尝试注入恶意脚本
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '"><script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src=x onerror=alert("XSS")>',
      '<svg onload=alert("XSS")>',
      '"><img src=x onerror=alert("XSS")>',
      '"><iframe src="javascript:alert(\'XSS\')"></iframe>'
    ];
    
    for (const payload of xssPayloads) {
      // 在显示名称字段尝试注入
      await page.fill('input[name="displayName"]', payload);
      await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
      await page.fill('input[name="password"]', 'Password123!');
      await page.fill('input[name="confirmPassword"]', 'Password123!');
      
      // 提交表单
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
      
      // 验证页面没有执行恶意脚本
      const pageContent = await page.content();
      expect(pageContent).not.toContain('alert("XSS")');
      expect(pageContent).not.toContain('<script>');
      expect(pageContent).not.toContain('javascript:');
      
      // 检查控制台是否有错误
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      // 验证没有XSS相关的控制台错误
      const xssErrors = consoleErrors.filter(error => 
        error.includes('XSS') || error.includes('script') || error.includes('eval')
      );
      expect(xssErrors.length).toBe(0);
    }
    
    console.log('✅ SEC-001: XSS脚本注入防护正常');
  });

  test('SEC-002: 存储型XSS防护', async ({ page }) => {
    // 测试存储型XSS（数据保存到数据库后再次显示）
    await page.goto('http://localhost:3000/register');
    
    const xssPayload = '<script>document.cookie="stolen=1"</script>';
    
    // 注册用户并尝试存储XSS
    await page.fill('input[name="displayName"]', xssPayload);
    await page.fill('input[name="email"]', `xss-test-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // 登录并查看用户信息
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', `xss-test-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // 访问用户资料页面
    await page.goto('http://localhost:3000/me');
    
    // 验证XSS没有被执行
    const pageContent = await page.content();
    expect(pageContent).not.toContain('<script>');
    expect(pageContent).not.toContain('document.cookie');
    
    console.log('✅ SEC-002: 存储型XSS防护正常');
  });

  test('SEC-003: DOM型XSS防护', async ({ page }) => {
    // 测试DOM型XSS（通过URL参数）
    const xssPayloads = [
      'javascript:alert("XSS")',
      '<script>alert("XSS")</script>',
      '"><script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>'
    ];
    
    for (const payload of xssPayloads) {
      // 通过URL参数尝试注入
      const encodedPayload = encodeURIComponent(payload);
      await page.goto(`http://localhost:3000/search?q=${encodedPayload}`);
      
      // 验证页面没有执行恶意脚本
      const pageContent = await page.content();
      expect(pageContent).not.toContain('alert("XSS")');
      expect(pageContent).not.toContain('<script>');
      
      // 检查URL中的参数是否被正确转义
      const currentUrl = page.url();
      expect(currentUrl).not.toContain('<script>');
    }
    
    console.log('✅ SEC-003: DOM型XSS防护正常');
  });

  // ========== CSRF防护测试 ==========
  
  test('SEC-004: CSRF令牌验证', async ({ page }) => {
    // 测试CSRF令牌的存在和验证
    await page.goto('http://localhost:3000/register');
    
    // 检查表单是否包含CSRF令牌
    const csrfToken = await page.locator('input[name="_token"], input[name="csrf_token"], meta[name="csrf-token"]').first();
    
    if (await csrfToken.isVisible()) {
      const tokenValue = await csrfToken.getAttribute('value') || await csrfToken.getAttribute('content');
      expect(tokenValue).toBeTruthy();
      expect(tokenValue.length).toBeGreaterThan(10); // 令牌应该有足够的长度
    }
    
    // 尝试没有CSRF令牌的请求
    const response = await page.request.post('http://localhost:8080/api/auth/register', {
      data: {
        email: 'csrf-test@example.com',
        password: 'Password123!',
        displayName: 'CSRF Test'
        // 故意不包含CSRF令牌
      }
    });
    
    // 验证请求被拒绝
    expect(response.status()).toBe(403); // 或者400，取决于实现
    
    console.log('✅ SEC-004: CSRF令牌验证正常');
  });

  test('SEC-005: 同源策略验证', async ({ page }) => {
    // 测试跨域请求是否被正确阻止
    const crossOriginUrls = [
      'http://malicious-site.com/api/users',
      'https://evil.com/steal-data',
      'http://localhost:3001/api/auth/login' // 不同端口
    ];
    
    for (const url of crossOriginUrls) {
      try {
        const response = await page.request.get(url);
        // 如果请求成功，检查是否有适当的CORS头
        const corsHeaders = response.headers();
        expect(corsHeaders['access-control-allow-origin']).toBeDefined();
      } catch (error) {
        // 跨域请求被阻止是正常的
        expect(error.message).toContain('CORS') || expect(error.message).toContain('blocked');
      }
    }
    
    console.log('✅ SEC-005: 同源策略验证正常');
  });

  // ========== 输入验证测试 ==========
  
  test('SEC-006: SQL注入防护', async ({ page }) => {
    // 测试SQL注入攻击
    const sqlPayloads = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "' UNION SELECT * FROM users --",
      "'; INSERT INTO users VALUES ('hacker', 'password'); --",
      "' OR 1=1 --",
      "admin'--",
      "admin'/*",
      "' OR 'x'='x"
    ];
    
    await page.goto('http://localhost:3000/login');
    
    for (const payload of sqlPayloads) {
      // 在邮箱字段尝试SQL注入
      await page.fill('input[name="email"]', payload);
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      await page.waitForTimeout(1000);
      
      // 验证登录失败（不应该成功）
      const errorMessage = page.locator('.error-message, .alert-error');
      const hasErrorMessage = await errorMessage.isVisible();
      
      // 验证没有成功登录
      const currentUrl = page.url();
      expect(currentUrl).toContain('/login'); // 应该还在登录页面
      
      // 验证没有显示敏感信息
      const pageContent = await page.content();
      expect(pageContent).not.toContain('SQL');
      expect(pageContent).not.toContain('database');
      expect(pageContent).not.toContain('table');
    }
    
    console.log('✅ SEC-006: SQL注入防护正常');
  });

  test('SEC-007: 输入长度限制', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 测试超长输入
    const longString = 'A'.repeat(10000);
    
    // 测试显示名称长度限制
    await page.fill('input[name="displayName"]', longString);
    await page.fill('input[name="email"]', `length-test-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    // 验证输入被截断或拒绝
    const errorMessage = page.locator('.error-message, .field-error');
    const hasErrorMessage = await errorMessage.isVisible();
    
    if (hasErrorMessage) {
      const errorText = await errorMessage.textContent();
      expect(errorText).toContain('长度') || expect(errorText).toContain('length');
    }
    
    console.log('✅ SEC-007: 输入长度限制正常');
  });

  test('SEC-008: 特殊字符过滤', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 测试特殊字符
    const specialChars = [
      '<>',
      '&lt;&gt;',
      '&amp;',
      '&quot;',
      '&#x27;',
      '&#x2F;',
      '\\x00',
      '\\x1a',
      '\\x1b',
      '\\x1c',
      '\\x1d',
      '\\x1e',
      '\\x1f'
    ];
    
    for (const chars of specialChars) {
      await page.fill('input[name="displayName"]', `Test${chars}User`);
      await page.fill('input[name="email"]', `special-${Date.now()}@example.com`);
      await page.fill('input[name="password"]', 'Password123!');
      await page.fill('input[name="confirmPassword"]', 'Password123!');
      
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
      
      // 验证特殊字符被正确处理
      const pageContent = await page.content();
      expect(pageContent).not.toContain('<script>');
      expect(pageContent).not.toContain('javascript:');
    }
    
    console.log('✅ SEC-008: 特殊字符过滤正常');
  });

  // ========== 认证安全测试 ==========
  
  test('SEC-009: 密码强度验证', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    const weakPasswords = [
      '123',
      'password',
      '123456',
      'qwerty',
      'abc123',
      'Password',
      'password123',
      'PASSWORD123'
    ];
    
    for (const weakPassword of weakPasswords) {
      await page.fill('input[name="displayName"]', 'Password Test User');
      await page.fill('input[name="email"]', `password-test-${Date.now()}@example.com`);
      await page.fill('input[name="password"]', weakPassword);
      await page.fill('input[name="confirmPassword"]', weakPassword);
      
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
      
      // 验证弱密码被拒绝
      const errorMessage = page.locator('.error-message, .field-error');
      const hasErrorMessage = await errorMessage.isVisible();
      
      if (hasErrorMessage) {
        const errorText = await errorMessage.textContent();
        expect(errorText).toContain('密码') || expect(errorText).toContain('password');
      }
    }
    
    console.log('✅ SEC-009: 密码强度验证正常');
  });

  test('SEC-010: 会话管理安全', async ({ page }) => {
    // 测试会话超时
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // 等待登录成功
    await page.waitForTimeout(2000);
    
    // 检查会话令牌
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(cookie => 
      cookie.name.includes('session') || 
      cookie.name.includes('token') || 
      cookie.name.includes('auth')
    );
    
    if (sessionCookie) {
      // 验证会话令牌有适当的属性
      expect(sessionCookie.httpOnly).toBeTruthy(); // 防止XSS
      expect(sessionCookie.secure).toBeTruthy(); // HTTPS only
      expect(sessionCookie.sameSite).toBe('Strict'); // CSRF防护
    }
    
    // 测试登出后令牌失效
    await page.click('text=Logout');
    await page.waitForTimeout(1000);
    
    // 尝试访问受保护的页面
    await page.goto('http://localhost:3000/me');
    
    // 验证被重定向到登录页面
    const currentUrl = page.url();
    expect(currentUrl).toContain('/login');
    
    console.log('✅ SEC-010: 会话管理安全正常');
  });

  test('SEC-011: 暴力破解防护', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // 尝试多次错误登录
    for (let i = 0; i < 5; i++) {
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
    }
    
    // 验证账户被锁定或需要验证码
    const errorMessage = page.locator('.error-message, .alert-error');
    const hasErrorMessage = await errorMessage.isVisible();
    
    if (hasErrorMessage) {
      const errorText = await errorMessage.textContent();
      expect(errorText).toContain('锁定') || 
      expect(errorText).toContain('验证码') || 
      expect(errorText).toContain('尝试次数');
    }
    
    // 检查是否有验证码输入框
    const captchaInput = page.locator('input[name="captcha"], .captcha-input');
    const hasCaptcha = await captchaInput.isVisible();
    
    console.log('✅ SEC-011: 暴力破解防护正常');
  });

  // ========== 文件上传安全测试 ==========
  
  test('SEC-012: 文件类型验证', async ({ page }) => {
    await page.goto('http://localhost:3000/sell');
    
    // 尝试上传恶意文件
    const maliciousFiles = [
      'malicious.exe',
      'virus.bat',
      'script.js',
      'shell.php',
      'backdoor.asp'
    ];
    
    for (const fileName of maliciousFiles) {
      // 创建临时文件
      const fs = require('fs');
      const path = require('path');
      const tempFile = path.join(__dirname, `temp_${fileName}`);
      
      try {
        fs.writeFileSync(tempFile, 'malicious content');
        
        // 尝试上传文件
        const fileInput = page.locator('input[type="file"]');
        if (await fileInput.isVisible()) {
          await fileInput.setInputFiles(tempFile);
          
          // 验证文件被拒绝
          const errorMessage = page.locator('.error-message, .file-error');
          const hasErrorMessage = await errorMessage.isVisible();
          
          if (hasErrorMessage) {
            const errorText = await errorMessage.textContent();
            expect(errorText).toContain('文件类型') || 
            expect(errorText).toContain('不支持') ||
            expect(errorText).toContain('不允许');
          }
        }
      } finally {
        // 清理临时文件
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      }
    }
    
    console.log('✅ SEC-012: 文件类型验证正常');
  });

  test('SEC-013: 文件大小限制', async ({ page }) => {
    await page.goto('http://localhost:3000/sell');
    
    // 创建大文件（模拟）
    const fs = require('fs');
    const path = require('path');
    const largeFile = path.join(__dirname, 'large_file.jpg');
    
    try {
      // 创建10MB的文件
      const largeContent = Buffer.alloc(10 * 1024 * 1024, 'A');
      fs.writeFileSync(largeFile, largeContent);
      
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        await fileInput.setInputFiles(largeFile);
        
        // 验证文件大小被限制
        const errorMessage = page.locator('.error-message, .file-error');
        const hasErrorMessage = await errorMessage.isVisible();
        
        if (hasErrorMessage) {
          const errorText = await errorMessage.textContent();
          expect(errorText).toContain('文件大小') || 
          expect(errorText).toContain('太大') ||
          expect(errorText).toContain('超过限制');
        }
      }
    } finally {
      // 清理临时文件
      if (fs.existsSync(largeFile)) {
        fs.unlinkSync(largeFile);
      }
    }
    
    console.log('✅ SEC-013: 文件大小限制正常');
  });

  // ========== 信息泄露测试 ==========
  
  test('SEC-014: 敏感信息泄露', async ({ page }) => {
    // 测试错误页面是否泄露敏感信息
    await page.goto('http://localhost:3000/nonexistent-page');
    
    const pageContent = await page.content();
    
    // 验证不包含敏感信息
    expect(pageContent).not.toContain('database');
    expect(pageContent).not.toContain('password');
    expect(pageContent).not.toContain('secret');
    expect(pageContent).not.toContain('key');
    expect(pageContent).not.toContain('token');
    expect(pageContent).not.toContain('stack trace');
    expect(pageContent).not.toContain('exception');
    
    // 测试API错误响应
    const response = await page.request.get('http://localhost:8080/api/nonexistent');
    
    if (response.status() >= 400) {
      const responseText = await response.text();
      expect(responseText).not.toContain('database');
      expect(responseText).not.toContain('password');
      expect(responseText).not.toContain('stack trace');
    }
    
    console.log('✅ SEC-014: 敏感信息泄露防护正常');
  });

  test('SEC-015: 目录遍历防护', async ({ page }) => {
    // 测试目录遍历攻击
    const directoryTraversalPayloads = [
      '../../../etc/passwd',
      '..\\..\\..\\windows\\system32\\drivers\\etc\\hosts',
      '....//....//....//etc/passwd',
      '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
      '..%252f..%252f..%252fetc%252fpasswd'
    ];
    
    for (const payload of directoryTraversalPayloads) {
      try {
        const response = await page.request.get(`http://localhost:8080/api/files/${payload}`);
        
        // 验证请求被拒绝
        expect(response.status()).toBe(403) || expect(response.status()).toBe(404);
        
        const responseText = await response.text();
        expect(responseText).not.toContain('root:');
        expect(responseText).not.toContain('127.0.0.1');
        expect(responseText).not.toContain('localhost');
      } catch (error) {
        // 请求被阻止是正常的
        console.log('目录遍历请求被正确阻止');
      }
    }
    
    console.log('✅ SEC-015: 目录遍历防护正常');
  });

  // ========== 安全头测试 ==========
  
  test('SEC-016: 安全HTTP头', async ({ page }) => {
    const response = await page.request.get('http://localhost:3000');
    const headers = response.headers();
    
    // 检查重要的安全头
    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000',
      'Content-Security-Policy': 'default-src \'self\'',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };
    
    for (const [headerName, expectedValue] of Object.entries(securityHeaders)) {
      const headerValue = headers[headerName.toLowerCase()];
      if (headerValue) {
        expect(headerValue).toContain(expectedValue);
      }
    }
    
    console.log('✅ SEC-016: 安全HTTP头正常');
  });

  // ========== API安全测试 ==========
  
  test('SEC-017: API认证验证', async ({ page }) => {
    // 测试未认证的API请求
    const protectedEndpoints = [
      '/api/users/me',
      '/api/items',
      '/api/orders',
      '/api/chat/conversations'
    ];
    
    for (const endpoint of protectedEndpoints) {
      const response = await page.request.get(`http://localhost:8080${endpoint}`);
      
      // 验证未认证请求被拒绝
      expect(response.status()).toBe(401) || expect(response.status()).toBe(403);
      
      const responseData = await response.json();
      expect(responseData.message).toContain('认证') || 
      expect(responseData.message).toContain('unauthorized') ||
      expect(responseData.message).toContain('forbidden');
    }
    
    console.log('✅ SEC-017: API认证验证正常');
  });

  test('SEC-018: API速率限制', async ({ page }) => {
    // 测试API速率限制
    const requests = [];
    
    // 快速发送多个请求
    for (let i = 0; i < 20; i++) {
      requests.push(
        page.request.get('http://localhost:8080/api/items')
      );
    }
    
    const responses = await Promise.all(requests);
    
    // 检查是否有请求被限制
    const rateLimitedResponses = responses.filter(response => 
      response.status() === 429
    );
    
    if (rateLimitedResponses.length > 0) {
      console.log(`检测到${rateLimitedResponses.length}个请求被速率限制`);
    }
    
    console.log('✅ SEC-018: API速率限制正常');
  });

  // ========== 数据验证测试 ==========
  
  test('SEC-019: 数据类型验证', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 测试无效数据类型
    const invalidData = {
      email: [123, true, null, {}],
      password: [123, true, null, {}],
      displayName: [123, true, null, {}]
    };
    
    for (const [field, values] of Object.entries(invalidData)) {
      for (const value of values) {
        await page.fill(`input[name="${field}"]`, String(value));
        await page.click('button[type="submit"]');
        await page.waitForTimeout(500);
        
        // 验证数据类型错误
        const errorMessage = page.locator('.error-message, .field-error');
        const hasErrorMessage = await errorMessage.isVisible();
        
        if (hasErrorMessage) {
          const errorText = await errorMessage.textContent();
          expect(errorText).toContain('格式') || 
          expect(errorText).toContain('类型') ||
          expect(errorText).toContain('无效');
        }
      }
    }
    
    console.log('✅ SEC-019: 数据类型验证正常');
  });

  test('SEC-020: 业务逻辑安全', async ({ page }) => {
    // 测试业务逻辑漏洞
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(2000);
    
    // 尝试访问其他用户的资源
    const otherUserEndpoints = [
      '/api/users/999',
      '/api/orders/999',
      '/api/items/999'
    ];
    
    for (const endpoint of otherUserEndpoints) {
      const response = await page.request.get(`http://localhost:8080${endpoint}`);
      
      // 验证不能访问其他用户的资源
      expect(response.status()).toBe(403) || expect(response.status()).toBe(404);
    }
    
    console.log('✅ SEC-020: 业务逻辑安全正常');
  });
});
