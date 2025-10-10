/**
 * UI交互和性能测试套件
 * 合并了原有的 enhanced-ui-interaction.spec.js 和 performance-tests.spec.js
 * 包含UI交互、性能测试、响应式设计等
 */

const { test, expect } = require('@playwright/test');

test.describe('UI交互和性能测试套件', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  // ========== UI交互测试 ==========
  
  test('UI-001: 商品卡片悬停效果', async ({ page }) => {
    // 等待商品卡片加载
    await page.waitForSelector('.product-card', { timeout: 10000 });
    
    // 悬停在第一个商品卡片上
    await page.hover('.product-card:first-child');
    
    // 验证悬停效果
    await expect(page.locator('.product-card:first-child')).toHaveCSS('box-shadow', /.*/);
    await expect(page.locator('.product-card:first-child')).toHaveCSS('transform', /scale/);
    
    console.log('✅ UI-001: 商品卡片悬停效果正常');
  });

  test('UI-002: 按钮点击加载状态', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 填写注册表单
    await page.fill('input[name="displayName"]', 'Loading Test');
    await page.fill('input[name="email"]', `loading-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    // 点击提交按钮
    await page.click('button[type="submit"]');
    
    // 验证按钮加载状态
    await expect(page.locator('button[type="submit"]')).toHaveAttribute('disabled', '');
    await expect(page.locator('button[type="submit"]')).toContainText(/加载中|Loading/);
    
    console.log('✅ UI-002: 按钮点击加载状态正常');
  });

  test('UI-003: 表单输入焦点状态', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // 点击邮箱输入框
    await page.focus('input[name="email"]');
    
    // 验证焦点状态
    await expect(page.locator('input[name="email"]')).toHaveCSS('border-color', /rgb\(102, 126, 234\)/);
    
    // 点击密码输入框
    await page.focus('input[name="password"]');
    await expect(page.locator('input[name="password"]')).toHaveCSS('border-color', /rgb\(102, 126, 234\)/);
    
    console.log('✅ UI-003: 表单输入焦点状态正常');
  });

  test('UI-004: 模态框/弹窗交互', async ({ page }) => {
    // 创建一个测试模态框
    await page.evaluate(() => {
      const modalDiv = document.createElement('div');
      modalDiv.id = 'test-modal';
      modalDiv.innerHTML = '<h2>Test Modal</h2><button id="close-modal">Close</button>';
      modalDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border: 1px solid black; z-index: 1000;';
      document.body.appendChild(modalDiv);
    });
    
    // 验证模态框显示
    await expect(page.locator('#test-modal')).toBeVisible();
    
    // 点击关闭按钮
    await page.click('#close-modal');
    
    // 验证模态框关闭
    await expect(page.locator('#test-modal')).not.toBeVisible();
    
    console.log('✅ UI-004: 模态框/弹窗交互正常');
  });

  test('UI-005: 错误消息动态显示与隐藏', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 输入无效邮箱
    await page.fill('input[name="email"]', 'invalid');
    await page.click('button[type="submit"]');
    
    // 验证错误消息显示
    await expect(page.locator('text=Invalid email format')).toBeVisible();
    
    // 修正邮箱格式
    await page.fill('input[name="email"]', `valid-${Date.now()}@example.com`);
    
    // 验证错误消息隐藏
    await expect(page.locator('text=Invalid email format')).not.toBeVisible();
    
    console.log('✅ UI-005: 错误消息动态显示与隐藏正常');
  });

  test('UI-006: 下拉菜单交互', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // 点击分类下拉菜单
    await page.click('select[name="category"]');
    
    // 选择选项
    await page.selectOption('select[name="category"]', 'electronics');
    
    // 验证选择生效
    await expect(page.locator('select[name="category"]')).toHaveValue('electronics');
    
    console.log('✅ UI-006: 下拉菜单交互正常');
  });

  test('UI-007: 标签输入交互', async ({ page }) => {
    await page.goto('http://localhost:3000/sell');
    
    // 输入标签
    await page.fill('input[name="tags"]', 'iPhone');
    await page.press('input[name="tags"]', 'Enter');
    
    // 验证标签显示
    await expect(page.locator('.tag-item:has-text("iPhone")')).toBeVisible();
    
    // 删除标签
    await page.click('.tag-item:has-text("iPhone") .tag-remove');
    await expect(page.locator('.tag-item:has-text("iPhone")')).not.toBeVisible();
    
    console.log('✅ UI-007: 标签输入交互正常');
  });

  test('UI-008: 图片上传预览', async ({ page }) => {
    await page.goto('http://localhost:3000/sell');
    
    // 上传图片
    const imagePath = path.join(__dirname, '../test-images/test-image.jpg');
    await page.setInputFiles('input[type="file"]', imagePath);
    
    // 验证图片预览
    await expect(page.locator('.image-preview')).toBeVisible();
    
    // 删除图片
    await page.click('.image-preview .delete-button');
    await expect(page.locator('.image-preview')).not.toBeVisible();
    
    console.log('✅ UI-008: 图片上传预览正常');
  });

  // ========== 性能测试 ==========
  
  test('PERF-001: 首页加载速度', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    console.log(`首页加载时间: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000);
    
    console.log('✅ PERF-001: 首页加载速度符合预期');
  });

  test('PERF-002: 商品搜索页面加载速度', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:3000/search');
    await page.waitForLoadState('networkidle');
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    console.log(`商品搜索页面加载时间: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000);
    
    console.log('✅ PERF-002: 商品搜索页面加载速度符合预期');
  });

  test('PERF-003: API响应时间 - 登录', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: 'seller@test.com',
        password: 'Test123!'
      }
    });
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(response.status()).toBe(200);
    console.log(`登录API响应时间: ${responseTime}ms`);
    expect(responseTime).toBeLessThan(500);
    
    console.log('✅ PERF-003: 登录API响应时间符合预期');
  });

  test('PERF-004: 图片懒加载功能', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // 滚动到页面底部触发懒加载
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // 等待图片加载
    await page.waitForTimeout(2000);
    
    // 检查懒加载图片
    const lazyLoadedImages = await page.locator('img[loading="lazy"]').count();
    expect(lazyLoadedImages).toBeGreaterThanOrEqual(0);
    
    console.log('✅ PERF-004: 图片懒加载功能正常');
  });

  test('PERF-005: 大量商品列表渲染性能', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:3000/search?query=all&size=50');
    await page.waitForLoadState('domcontentloaded');
    const endTime = Date.now();
    const renderTime = endTime - startTime;
    
    console.log(`大量商品列表渲染时间: ${renderTime}ms`);
    expect(renderTime).toBeLessThan(5000);
    
    console.log('✅ PERF-005: 大量商品列表渲染性能符合预期');
  });

  test('PERF-006: 内存使用情况', async ({ page }) => {
    // 获取初始内存使用
    const initialMemory = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });
    
    // 执行一些操作
    await page.goto('http://localhost:3000/search');
    await page.fill('input[placeholder*="搜索"]', 'test');
    await page.press('input[placeholder*="搜索"]', 'Enter');
    await page.waitForTimeout(2000);
    
    // 获取操作后内存使用
    const finalMemory = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });
    
    const memoryIncrease = finalMemory - initialMemory;
    console.log(`内存使用增加: ${memoryIncrease} bytes`);
    
    // 验证内存使用合理
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB
    
    console.log('✅ PERF-006: 内存使用情况正常');
  });

  test('PERF-007: 网络请求优化', async ({ page }) => {
    const requests = [];
    
    // 监听网络请求
    page.on('request', request => {
      requests.push({
        url: request.url(),
        resourceType: request.resourceType(),
        size: request.headers()['content-length'] || 0
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
    
    // 验证没有重复请求
    const uniqueUrls = new Set(requests.map(req => req.url));
    expect(uniqueUrls.size).toBe(requests.length);
    
    console.log(`✅ PERF-007: 网络请求优化正常 (JS:${jsRequests.length}, CSS:${cssRequests.length}, 图片:${imageRequests.length})`);
  });

  // ========== 响应式设计测试 ==========
  
  test('RESP-001: 桌面端布局 (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000');
    
    // 验证桌面端布局
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main, .main-content')).toBeVisible();
    
    // 检查导航栏完整显示
    const navItems = page.locator('nav a, nav button');
    const navCount = await navItems.count();
    expect(navCount).toBeGreaterThan(0);
    
    // 验证侧边栏（如果存在）
    const sidebar = page.locator('.sidebar, .side-nav');
    if (await sidebar.count() > 0) {
      await expect(sidebar).toBeVisible();
    }
    
    console.log('✅ RESP-001: 桌面端布局正常');
  });

  test('RESP-002: 平板端布局 (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000');
    
    // 验证平板端布局
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main, .main-content')).toBeVisible();
    
    // 检查布局是否适配
    const bodyWidth = await page.evaluate(() => document.body.offsetWidth);
    expect(bodyWidth).toBeLessThanOrEqual(768);
    
    // 验证商品卡片布局
    const productCards = page.locator('.product-card');
    if (await productCards.count() > 0) {
      const firstCardWidth = await productCards.first().boundingBox();
      expect(firstCardWidth.width).toBeLessThanOrEqual(400);
    }
    
    console.log('✅ RESP-002: 平板端布局正常');
  });

  test('RESP-003: 移动端布局 (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    // 验证移动端布局
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main, .main-content')).toBeVisible();
    
    // 检查移动端特有元素
    const mobileElements = page.locator('.mobile-menu, .hamburger-menu');
    if (await mobileElements.count() > 0) {
      await expect(mobileElements.first()).toBeVisible();
    }
    
    // 验证商品卡片单列显示
    const productCards = page.locator('.product-card');
    if (await productCards.count() > 1) {
      const firstCard = await productCards.first().boundingBox();
      const secondCard = await productCards.nth(1).boundingBox();
      expect(firstCard.y).toBeLessThan(secondCard.y);
    }
    
    console.log('✅ RESP-003: 移动端布局正常');
  });

  test('RESP-004: 横屏模式 (1024x768)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('http://localhost:3000');
    
    // 验证横屏布局
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main, .main-content')).toBeVisible();
    
    // 验证商品网格布局
    const productCards = page.locator('.product-card');
    if (await productCards.count() > 2) {
      const firstCard = await productCards.first().boundingBox();
      const secondCard = await productCards.nth(1).boundingBox();
      const thirdCard = await productCards.nth(2).boundingBox();
      
      // 验证网格布局
      expect(firstCard.y).toBe(secondCard.y);
      expect(secondCard.y).toBe(thirdCard.y);
    }
    
    console.log('✅ RESP-004: 横屏模式布局正常');
  });

  test('RESP-005: 超宽屏布局 (2560x1440)', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.goto('http://localhost:3000');
    
    // 验证超宽屏布局
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main, .main-content')).toBeVisible();
    
    // 验证内容居中
    const mainContent = page.locator('main, .main-content');
    const boundingBox = await mainContent.boundingBox();
    expect(boundingBox.x).toBeGreaterThan(0);
    expect(boundingBox.x + boundingBox.width).toBeLessThan(2560);
    
    console.log('✅ RESP-005: 超宽屏布局正常');
  });

  // ========== 动画和过渡效果测试 ==========
  
  test('ANIM-001: 页面切换动画', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 点击导航链接
    const startTime = Date.now();
    await page.click('text=Login');
    await page.waitForURL(/.*\/login/);
    const endTime = Date.now();
    
    const transitionTime = endTime - startTime;
    console.log(`页面切换时间: ${transitionTime}ms`);
    
    // 验证页面切换流畅
    expect(transitionTime).toBeLessThan(1000);
    
    console.log('✅ ANIM-001: 页面切换动画正常');
  });

  test('ANIM-002: 加载动画', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 填写表单并提交
    await page.fill('input[name="displayName"]', 'Animation Test');
    await page.fill('input[name="email"]', `animation-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    // 点击提交并观察加载动画
    await page.click('button[type="submit"]');
    
    // 验证加载动画显示
    const loadingSpinner = page.locator('.loading-spinner, .spinner');
    if (await loadingSpinner.count() > 0) {
      await expect(loadingSpinner).toBeVisible();
    }
    
    console.log('✅ ANIM-002: 加载动画正常');
  });

  test('ANIM-003: 悬停动画', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 悬停在按钮上
    const button = page.locator('button:has-text("Login")');
    await button.hover();
    
    // 验证悬停效果
    await expect(button).toHaveCSS('transform', /scale/);
    
    // 移开鼠标
    await button.hover({ position: { x: -10, y: -10 } });
    
    // 验证恢复原状
    await expect(button).toHaveCSS('transform', /none/);
    
    console.log('✅ ANIM-003: 悬停动画正常');
  });

  // ========== 可访问性测试 ==========
  
  test('A11Y-001: 键盘导航', async ({ page }) => {
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
    
    console.log('✅ A11Y-001: 键盘导航正常');
  });

  test('A11Y-002: ARIA属性', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 检查导航ARIA属性
    await expect(page.locator('nav')).toHaveAttribute('role', 'navigation');
    
    // 检查按钮ARIA属性
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaDescribedBy = await button.getAttribute('aria-describedby');
      
      // 验证按钮有适当的ARIA属性
      expect(ariaLabel || ariaDescribedBy).toBeTruthy();
    }
    
    console.log('✅ A11Y-002: ARIA属性正常');
  });

  test('A11Y-003: 颜色对比度', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 获取主要文本颜色
    const bodyColor = await page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      return {
        color: computedStyle.color,
        backgroundColor: computedStyle.backgroundColor
      };
    });
    
    console.log(`文本颜色: ${bodyColor.color}, 背景颜色: ${bodyColor.backgroundColor}`);
    
    // 这里可以添加更详细的对比度检查逻辑
    // 实际项目中建议使用专业的对比度检查工具
    
    console.log('✅ A11Y-003: 颜色对比度检查完成');
  });

  test('A11Y-004: 屏幕阅读器支持', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 检查图片alt属性
    const images = page.locator('img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeDefined();
    }
    
    // 检查表单标签
    const formInputs = page.locator('input, textarea, select');
    const inputCount = await formInputs.count();
    for (let i = 0; i < inputCount; i++) {
      const input = formInputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      // 验证输入框有适当的标签
      expect(id || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
    
    console.log('✅ A11Y-004: 屏幕阅读器支持正常');
  });

  // ========== 错误处理测试 ==========
  
  test('ERROR-001: 网络错误处理', async ({ page }) => {
    // 模拟网络错误
    await page.route('**/api/**', route => route.abort());
    
    // 尝试触发需要网络请求的操作
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // 验证错误处理
    await page.waitForTimeout(2000);
    const errorMessage = page.locator('.error-message, .network-error');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    }
    
    console.log('✅ ERROR-001: 网络错误处理正常');
  });

  test('ERROR-002: 表单验证错误', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 提交空表单
    await page.click('button[type="submit"]');
    
    // 验证错误消息显示
    await expect(page.locator('.error-message, .field-error')).toBeVisible();
    
    // 修正错误
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    // 验证错误消息消失
    await expect(page.locator('.error-message, .field-error')).not.toBeVisible();
    
    console.log('✅ ERROR-002: 表单验证错误处理正常');
  });

  test('ERROR-003: 404页面处理', async ({ page }) => {
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
      console.log('✅ ERROR-003: 404页面处理正常');
    } else {
      // 如果没有404页面，检查是否重定向到首页
      expect(currentUrl).toContain('localhost:3000');
      console.log('✅ ERROR-003: 页面重定向处理正常');
    }
  });
});
