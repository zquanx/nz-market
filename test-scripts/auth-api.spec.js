const { test, expect } = require('@playwright/test');

test.describe('Authentication API Tests', () => {
  
  // ========== 注册API测试用例 ==========
  
  test('API001: 注册API - 正常请求', async ({ request }) => {
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
    expect(data.user.email).toContain('apitest-');
    console.log('✅ API001: 注册API正常请求成功');
  });

  test('API002: 注册API - 无效邮箱格式', async ({ request }) => {
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
    console.log('✅ API002: 注册API无效邮箱格式验证正确');
  });

  test('API003: 注册API - 弱密码', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/auth/register', {
      data: {
        displayName: 'API Test User',
        email: 'test@example.com',
        password: '123'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    console.log('✅ API003: 注册API弱密码验证正确');
  });

  test('API004: 注册API - 重复邮箱', async ({ request }) => {
    const duplicateEmail = `duplicate-api-${Date.now()}@example.com`;
    
    // 第一次注册
    const response1 = await request.post('http://localhost:8080/api/auth/register', {
      data: {
        displayName: 'First User',
        email: duplicateEmail,
        password: 'Password123!'
      }
    });
    expect(response1.status()).toBe(200);
    
    // 第二次注册相同邮箱
    const response2 = await request.post('http://localhost:8080/api/auth/register', {
      data: {
        displayName: 'Second User',
        email: duplicateEmail,
        password: 'Password123!'
      }
    });
    
    expect(response2.status()).toBe(409);
    const data = await response2.json();
    expect(data).toHaveProperty('error');
    console.log('✅ API004: 注册API重复邮箱验证正确');
  });

  test('API005: 注册API - 缺少必填字段', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/auth/register', {
      data: {
        // 缺少 displayName
        email: 'test@example.com',
        password: 'Password123!'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    console.log('✅ API005: 注册API缺少必填字段验证正确');
  });

  // ========== 登录API测试用例 ==========

  test('API006: 登录API - 正常请求', async ({ request }) => {
    const testEmail = `logintest-api-${Date.now()}@example.com`;
    const testPassword = 'Password123!';
    
    // 先注册用户
    await request.post('http://localhost:8080/api/auth/register', {
      data: {
        displayName: 'Login Test User',
        email: testEmail,
        password: testPassword
      }
    });
    
    // 登录
    const response = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: testEmail,
        password: testPassword
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('accessToken');
    expect(data).toHaveProperty('refreshToken');
    expect(data).toHaveProperty('user');
    expect(data.user.email).toBe(testEmail);
    console.log('✅ API006: 登录API正常请求成功');
  });

  test('API007: 登录API - 错误密码', async ({ request }) => {
    const testEmail = `logintest-api-${Date.now()}@example.com`;
    const correctPassword = 'Password123!';
    const wrongPassword = 'WrongPassword123!';
    
    // 先注册用户
    await request.post('http://localhost:8080/api/auth/register', {
      data: {
        displayName: 'Login Test User',
        email: testEmail,
        password: correctPassword
      }
    });
    
    // 用错误密码登录
    const response = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: testEmail,
        password: wrongPassword
      }
    });
    
    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    console.log('✅ API007: 登录API错误密码验证正确');
  });

  test('API008: 登录API - 不存在的邮箱', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: 'nonexistent@example.com',
        password: 'Password123!'
      }
    });
    
    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    console.log('✅ API008: 登录API不存在邮箱验证正确');
  });

  test('API009: 登录API - 缺少凭据', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        // 缺少 email 和 password
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    console.log('✅ API009: 登录API缺少凭据验证正确');
  });

  // ========== 刷新令牌API测试用例 ==========

  test('API010: 刷新令牌API - 正常请求', async ({ request }) => {
    const testEmail = `refreshtest-api-${Date.now()}@example.com`;
    const testPassword = 'Password123!';
    
    // 先注册并登录获取令牌
    const registerResponse = await request.post('http://localhost:8080/api/auth/register', {
      data: {
        displayName: 'Refresh Test User',
        email: testEmail,
        password: testPassword
      }
    });
    
    const registerData = await registerResponse.json();
    const refreshToken = registerData.refreshToken;
    
    // 刷新令牌
    const response = await request.post('http://localhost:8080/api/auth/refresh', {
      data: refreshToken
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('accessToken');
    expect(data).toHaveProperty('refreshToken');
    console.log('✅ API010: 刷新令牌API正常请求成功');
  });

  test('API011: 刷新令牌API - 无效令牌', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/auth/refresh', {
      data: 'invalid-refresh-token'
    });
    
    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    console.log('✅ API011: 刷新令牌API无效令牌验证正确');
  });

  // ========== 邮箱验证API测试用例 ==========

  test('API012: 邮箱验证API - 有效令牌', async ({ request }) => {
    // 这个测试需要模拟有效的验证令牌
    const response = await request.post('http://localhost:8080/api/auth/verify-email', {
      params: {
        token: 'valid-verification-token-12345'
      }
    });
    
    expect(response.status()).toBe(200);
    console.log('✅ API012: 邮箱验证API有效令牌成功');
  });

  test('API013: 邮箱验证API - 无效令牌', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/auth/verify-email', {
      params: {
        token: 'invalid-verification-token'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    console.log('✅ API013: 邮箱验证API无效令牌验证正确');
  });

  // ========== 忘记密码API测试用例 ==========

  test('API014: 忘记密码API - 有效邮箱', async ({ request }) => {
    const testEmail = `forgotpassword-api-${Date.now()}@example.com`;
    
    // 先注册用户
    await request.post('http://localhost:8080/api/auth/register', {
      data: {
        displayName: 'Forgot Password User',
        email: testEmail,
        password: 'Password123!'
      }
    });
    
    // 请求密码重置
    const response = await request.post('http://localhost:8080/api/auth/forgot-password', {
      data: {
        email: testEmail
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('message');
    console.log('✅ API014: 忘记密码API有效邮箱成功');
  });

  test('API015: 忘记密码API - 不存在的邮箱', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/auth/forgot-password', {
      data: {
        email: 'nonexistent@example.com'
      }
    });
    
    expect(response.status()).toBe(404);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    console.log('✅ API015: 忘记密码API不存在邮箱验证正确');
  });

  test('API016: 忘记密码API - 无效邮箱格式', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/auth/forgot-password', {
      data: {
        email: 'invalid-email'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    console.log('✅ API016: 忘记密码API无效邮箱格式验证正确');
  });

  // ========== 密码重置API测试用例 ==========

  test('API017: 密码重置API - 有效令牌', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/auth/reset-password', {
      data: {
        token: 'valid-reset-token-12345',
        password: 'NewPassword123!'
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('message');
    console.log('✅ API017: 密码重置API有效令牌成功');
  });

  test('API018: 密码重置API - 无效令牌', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/auth/reset-password', {
      data: {
        token: 'invalid-reset-token',
        password: 'NewPassword123!'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    console.log('✅ API018: 密码重置API无效令牌验证正确');
  });

  test('API019: 密码重置API - 弱密码', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/auth/reset-password', {
      data: {
        token: 'valid-reset-token-12345',
        password: '123'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    console.log('✅ API019: 密码重置API弱密码验证正确');
  });

  // ========== 综合API测试用例 ==========

  test('API020: 完整认证流程API测试', async ({ request }) => {
    const testEmail = `fullflow-api-${Date.now()}@example.com`;
    const originalPassword = 'OriginalPassword123!';
    const newPassword = 'NewPassword123!';
    
    // 1. 注册用户
    const registerResponse = await request.post('http://localhost:8080/api/auth/register', {
      data: {
        displayName: 'Full Flow User',
        email: testEmail,
        password: originalPassword
      }
    });
    expect(registerResponse.status()).toBe(200);
    const registerData = await registerResponse.json();
    const refreshToken = registerData.refreshToken;
    
    // 2. 登录用户
    const loginResponse = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: testEmail,
        password: originalPassword
      }
    });
    expect(loginResponse.status()).toBe(200);
    const loginData = await loginResponse.json();
    expect(loginData).toHaveProperty('accessToken');
    
    // 3. 刷新令牌
    const refreshResponse = await request.post('http://localhost:8080/api/auth/refresh', {
      data: refreshToken
    });
    expect(refreshResponse.status()).toBe(200);
    const refreshData = await refreshResponse.json();
    expect(refreshData).toHaveProperty('accessToken');
    
    // 4. 忘记密码
    const forgotResponse = await request.post('http://localhost:8080/api/auth/forgot-password', {
      data: {
        email: testEmail
      }
    });
    expect(forgotResponse.status()).toBe(200);
    
    // 5. 重置密码
    const resetResponse = await request.post('http://localhost:8080/api/auth/reset-password', {
      data: {
        token: 'valid-reset-token-12345',
        password: newPassword
      }
    });
    expect(resetResponse.status()).toBe(200);
    
    // 6. 用新密码登录
    const newLoginResponse = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: testEmail,
        password: newPassword
      }
    });
    expect(newLoginResponse.status()).toBe(200);
    
    console.log('✅ API020: 完整认证流程API测试成功');
  });
});
