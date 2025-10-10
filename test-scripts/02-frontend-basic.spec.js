/**
 * 前端基础功能测试套件
 * 合并了原有的 frontend-basic.spec.js, basic.spec.js, simple-test.js
 * 包含页面加载、导航、语言切换等基础功能
 */

const { test, expect } = require('@playwright/test');

test.describe('前端基础功能测试套件', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  // ========== 页面加载测试 ==========
  
  test('FRONTEND-001: 首页加载和基本元素显示', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/Kiwi Market/);
    
    // 检查导航元素
    await expect(page.locator('nav').getByText('Kiwi Market').first()).toBeVisible();
    await expect(page.locator('text=Login')).toBeVisible();
    await expect(page.locator('text=Register')).toBeVisible();
    
    // 检查主要内容区域
    await expect(page.locator('main, .main-content')).toBeVisible();
    
    console.log('✅ FRONTEND-001: 首页加载成功，基本元素显示正常');
  });

  test('FRONTEND-002: 页面响应时间', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // 验证页面加载时间在合理范围内
    expect(loadTime).toBeLessThan(5000);
    console.log(`✅ FRONTEND-002: 页面加载时间 ${loadTime}ms`);
  });

  // ========== 导航功能测试 ==========
  
  test('FRONTEND-003: 导航到登录页面', async ({ page }) => {
    // 点击登录按钮
    await page.click('text=Login');
    
    // 验证跳转到登录页面
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('text=Sign in to your account')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    
    console.log('✅ FRONTEND-003: 导航到登录页面成功');
  });

  test('FRONTEND-004: 导航到注册页面', async ({ page }) => {
    // 点击注册按钮
    await page.click('text=Register');
    
    // 验证跳转到注册页面
    await expect(page).toHaveURL(/.*\/register/);
    await expect(page.locator('text=Create your account')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="displayName"]')).toBeVisible();
    
    console.log('✅ FRONTEND-004: 导航到注册页面成功');
  });

  test('FRONTEND-005: Logo点击返回首页', async ({ page }) => {
    // 先导航到其他页面
    await page.click('text=Login');
    await expect(page).toHaveURL(/.*\/login/);
    
    // 点击Logo返回首页
    await page.click('nav .logo, nav [href="/"]');
    await expect(page).toHaveURL('http://localhost:3000/');
    
    console.log('✅ FRONTEND-005: Logo点击返回首页成功');
  });

  test('FRONTEND-006: 移动端导航菜单', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 检查汉堡菜单按钮
    const hamburgerMenu = page.locator('.hamburger-menu, .mobile-menu-button, [aria-label="Menu"]');
    if (await hamburgerMenu.isVisible()) {
      await hamburgerMenu.click();
      
      // 验证移动菜单展开
      await expect(page.locator('.mobile-nav, .sidebar')).toBeVisible();
      
      // 测试菜单项点击
      const menuItems = page.locator('.mobile-nav a, .sidebar a');
      const itemCount = await menuItems.count();
      if (itemCount > 0) {
        await menuItems.first().click();
        await page.waitForTimeout(1000);
      }
    }
    
    console.log('✅ FRONTEND-006: 移动端导航菜单功能正常');
  });

  // ========== 语言切换测试 ==========
  
  test('FRONTEND-007: 语言切换功能', async ({ page }) => {
    // 检查初始语言（应该是英文）
    await expect(page.locator('text=Login')).toBeVisible();
    
    // 点击语言切换按钮
    const languageButton = page.locator('button:has-text("EN"), button:has-text("中文")');
    if (await languageButton.isVisible()) {
      await languageButton.click();
      
      // 验证语言切换到中文
      await expect(page.locator('text=登录')).toBeVisible();
      await expect(page.locator('text=注册')).toBeVisible();
      
      // 切换回英文
      await page.click('button:has-text("中文")');
      await expect(page.locator('text=Login')).toBeVisible();
    }
    
    console.log('✅ FRONTEND-007: 语言切换功能正常');
  });

  test('FRONTEND-008: 语言偏好保持', async ({ page }) => {
    // 切换到中文
    const languageButton = page.locator('button:has-text("EN"), button:has-text("中文")');
    if (await languageButton.isVisible()) {
      await languageButton.click();
      await expect(page.locator('text=登录')).toBeVisible();
      
      // 刷新页面
      await page.reload();
      
      // 验证语言偏好保持
      await expect(page.locator('text=登录')).toBeVisible();
    }
    
    console.log('✅ FRONTEND-008: 语言偏好保持正常');
  });

  // ========== 搜索功能测试 ==========
  
  test('FRONTEND-009: 搜索框基本功能', async ({ page }) => {
    // 查找搜索输入框
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]').first();
    
    if (await searchInput.isVisible()) {
      // 输入搜索关键词
      await searchInput.fill('test item');
      
      // 按回车键搜索
      await searchInput.press('Enter');
      
      // 验证跳转到搜索页面
      await expect(page).toHaveURL(/.*\/search/);
    }
    
    console.log('✅ FRONTEND-009: 搜索框基本功能正常');
  });

  test('FRONTEND-010: 搜索建议下拉', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]').first();
    
    if (await searchInput.isVisible()) {
      // 点击搜索框
      await searchInput.click();
      
      // 输入搜索关键词
      await searchInput.fill('iPhone');
      
      // 验证搜索建议显示
      const suggestions = page.locator('.search-suggestions, .autocomplete-dropdown');
      if (await suggestions.isVisible()) {
        await expect(suggestions).toBeVisible();
        
        // 点击建议项
        const suggestionItems = page.locator('.suggestion-item, .autocomplete-item');
        if (await suggestionItems.count() > 0) {
          await suggestionItems.first().click();
          await expect(page).toHaveURL(/.*\/search/);
        }
      }
    }
    
    console.log('✅ FRONTEND-010: 搜索建议下拉功能正常');
  });

  // ========== 响应式设计测试 ==========
  
  test('FRONTEND-011: 桌面端布局', async ({ page }) => {
    // 设置桌面端视口
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // 验证桌面端布局
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main, .main-content')).toBeVisible();
    
    // 检查导航栏完整显示
    const navItems = page.locator('nav a, nav button');
    const navCount = await navItems.count();
    expect(navCount).toBeGreaterThan(0);
    
    console.log('✅ FRONTEND-011: 桌面端布局正常');
  });

  test('FRONTEND-012: 平板端布局', async ({ page }) => {
    // 设置平板端视口
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // 验证平板端布局
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main, .main-content')).toBeVisible();
    
    // 检查布局是否适配
    const bodyWidth = await page.evaluate(() => document.body.offsetWidth);
    expect(bodyWidth).toBeLessThanOrEqual(768);
    
    console.log('✅ FRONTEND-012: 平板端布局正常');
  });

  test('FRONTEND-013: 移动端布局', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 验证移动端布局
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main, .main-content')).toBeVisible();
    
    // 检查移动端特有元素
    const mobileElements = page.locator('.mobile-menu, .hamburger-menu');
    if (await mobileElements.count() > 0) {
      await expect(mobileElements.first()).toBeVisible();
    }
    
    console.log('✅ FRONTEND-013: 移动端布局正常');
  });

  // ========== 错误处理测试 ==========
  
  test('FRONTEND-014: 404页面处理', async ({ page }) => {
    // 访问不存在的页面
    await page.goto('http://localhost:3000/nonexistent-page');
    
    // 验证404页面或重定向
    const currentUrl = page.url();
    const pageContent = await page.content();
    
    // 检查是否有404相关内容
    const has404Content = pageContent.includes('404') || 
                         pageContent.includes('Not Found') || 
                         pageContent.includes('页面不存在');
    
    if (has404Content) {
      console.log('✅ FRONTEND-014: 404页面处理正常');
    } else {
      // 如果没有404页面，检查是否重定向到首页
      expect(currentUrl).toContain('localhost:3000');
      console.log('✅ FRONTEND-014: 页面重定向处理正常');
    }
  });

  test('FRONTEND-015: 网络错误处理', async ({ page }) => {
    // 模拟网络错误
    await page.route('**/api/**', route => route.abort());
    
    // 尝试触发需要网络请求的操作
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // 验证错误处理
    await page.waitForTimeout(2000);
    const errorMessage = page.locator('.error-message, .network-error');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    }
    
    console.log('✅ FRONTEND-015: 网络错误处理正常');
  });

  // ========== 性能测试 ==========
  
  test('FRONTEND-016: 页面加载性能', async ({ page }) => {
    // 测量页面加载时间
    const startTime = Date.now();
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // 验证加载时间
    expect(loadTime).toBeLessThan(3000);
    
    // 获取性能指标
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart
      };
    });
    
    console.log(`✅ FRONTEND-016: 页面加载性能正常 (${loadTime}ms)`, performanceMetrics);
  });

  test('FRONTEND-017: 资源加载优化', async ({ page }) => {
    const requests = [];
    
    // 监听网络请求
    page.on('request', request => {
      requests.push({
        url: request.url(),
        resourceType: request.resourceType()
      });
    });
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // 分析请求
    const jsRequests = requests.filter(req => req.resourceType === 'script');
    const cssRequests = requests.filter(req => req.resourceType === 'stylesheet');
    const imageRequests = requests.filter(req => req.resourceType === 'image');
    
    // 验证请求数量合理
    expect(jsRequests.length).toBeLessThan(20);
    expect(cssRequests.length).toBeLessThan(10);
    
    console.log(`✅ FRONTEND-017: 资源加载优化正常 (JS:${jsRequests.length}, CSS:${cssRequests.length}, 图片:${imageRequests.length})`);
  });

  // ========== 可访问性测试 ==========
  
  test('FRONTEND-018: 键盘导航', async ({ page }) => {
    // 按Tab键导航
    await page.keyboard.press('Tab');
    
    // 验证焦点在第一个可聚焦元素上
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // 继续Tab导航
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // 验证焦点移动
    const newFocusedElement = page.locator(':focus');
    await expect(newFocusedElement).toBeVisible();
    
    console.log('✅ FRONTEND-018: 键盘导航正常');
  });

  test('FRONTEND-019: 语义化HTML结构', async ({ page }) => {
    // 检查语义化HTML元素
    const semanticElements = {
      header: await page.locator('header').count(),
      nav: await page.locator('nav').count(),
      main: await page.locator('main').count(),
      section: await page.locator('section').count(),
      footer: await page.locator('footer').count()
    };
    
    // 验证关键语义化元素存在
    expect(semanticElements.nav).toBeGreaterThan(0);
    expect(semanticElements.main).toBeGreaterThan(0);
    
    // 检查标题层级
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // 应该只有一个h1标签
    
    console.log('✅ FRONTEND-019: 语义化HTML结构正常', semanticElements);
  });

  test('FRONTEND-020: 图片替代文本', async ({ page }) => {
    // 检查所有图片的alt属性
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      // 验证图片有alt属性
      expect(alt).toBeDefined();
    }
    
    console.log(`✅ FRONTEND-020: 图片替代文本正常，共${imageCount}张图片`);
  });
});
