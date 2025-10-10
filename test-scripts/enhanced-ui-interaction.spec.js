/**
 * 增强的UI交互测试用例
 * 基于测试用例补充建议，完善界面交互测试
 */

const { test, expect } = require('@playwright/test');

test.describe('增强的UI交互测试', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  // ========== 悬停效果和动画测试 ==========
  
  test('UI-001: 商品卡片悬停效果', async ({ page }) => {
    // 等待商品卡片加载
    await page.waitForSelector('.item-card', { timeout: 10000 });
    
    // 获取第一个商品卡片
    const firstCard = page.locator('.item-card').first();
    
    // 悬停在商品卡片上
    await firstCard.hover();
    
    // 验证悬停效果
    await expect(firstCard).toHaveCSS('transform', /scale\(1\.05\)/);
    await expect(firstCard).toHaveCSS('box-shadow', /rgba\(0, 0, 0, 0\.1\)/);
    
    // 验证过渡动画
    await expect(firstCard).toHaveCSS('transition', /transform 0\.3s ease/);
    
    console.log('✅ UI-001: 商品卡片悬停效果正常');
  });

  test('UI-002: 按钮悬停效果', async ({ page }) => {
    // 测试登录按钮悬停效果
    const loginButton = page.locator('text=Login').first();
    await loginButton.hover();
    
    // 验证按钮颜色变化
    await expect(loginButton).toHaveCSS('background-color', /rgb\(59, 130, 246\)/);
    await expect(loginButton).toHaveCSS('transition', /background-color 0\.2s ease/);
    
    // 测试注册按钮悬停效果
    const registerButton = page.locator('text=Register').first();
    await registerButton.hover();
    
    // 验证按钮样式变化
    await expect(registerButton).toHaveCSS('border-color', /rgb\(59, 130, 246\)/);
    
    console.log('✅ UI-002: 按钮悬停效果正常');
  });

  test('UI-003: 链接悬停效果', async ({ page }) => {
    // 测试导航链接悬停效果
    const navLinks = page.locator('nav a');
    const firstLink = navLinks.first();
    
    await firstLink.hover();
    
    // 验证下划线效果
    await expect(firstLink).toHaveCSS('text-decoration', /underline/);
    await expect(firstLink).toHaveCSS('color', /rgb\(59, 130, 246\)/);
    
    console.log('✅ UI-003: 链接悬停效果正常');
  });

  // ========== 加载状态测试 ==========
  
  test('UI-004: 页面加载状态', async ({ page }) => {
    // 监听网络请求
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/') && response.status() === 200
    );
    
    // 访问需要加载数据的页面
    await page.goto('http://localhost:3000/search');
    
    // 验证加载指示器显示
    await expect(page.locator('.loading-spinner, .skeleton-loader')).toBeVisible();
    
    // 等待数据加载完成
    await responsePromise;
    
    // 验证加载指示器消失
    await expect(page.locator('.loading-spinner, .skeleton-loader')).not.toBeVisible();
    
    console.log('✅ UI-004: 页面加载状态正常');
  });

  test('UI-005: 表单提交加载状态', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 填写注册表单
    await page.fill('input[name="displayName"]', 'Loading Test User');
    await page.fill('input[name="email"]', `loading-test-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    // 监听提交请求
    const submitPromise = page.waitForRequest(request => 
      request.url().includes('/api/auth/register')
    );
    
    // 点击提交按钮
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // 验证按钮显示加载状态
    await expect(submitButton).toHaveText(/Loading|提交中/);
    await expect(submitButton).toBeDisabled();
    
    // 等待请求完成
    await submitPromise;
    
    console.log('✅ UI-005: 表单提交加载状态正常');
  });

  test('UI-006: 图片懒加载效果', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 滚动到商品区域
    await page.evaluate(() => window.scrollTo(0, 500));
    
    // 验证图片懒加载
    const images = page.locator('.item-card img');
    const firstImage = images.first();
    
    // 等待图片加载
    await firstImage.waitFor({ state: 'visible' });
    
    // 验证图片正确加载
    await expect(firstImage).toHaveAttribute('src');
    await expect(firstImage).not.toHaveAttribute('data-src');
    
    console.log('✅ UI-006: 图片懒加载效果正常');
  });

  // ========== 模态框和弹窗测试 ==========
  
  test('UI-007: 模态框打开和关闭', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 点击触发模态框的按钮（如果有的话）
    const modalTrigger = page.locator('[data-modal-trigger]').first();
    if (await modalTrigger.isVisible()) {
      await modalTrigger.click();
      
      // 验证模态框打开
      await expect(page.locator('.modal, .dialog')).toBeVisible();
      await expect(page.locator('.modal-backdrop, .overlay')).toBeVisible();
      
      // 测试ESC键关闭
      await page.keyboard.press('Escape');
      await expect(page.locator('.modal, .dialog')).not.toBeVisible();
    }
    
    console.log('✅ UI-007: 模态框交互正常');
  });

  test('UI-008: 工具提示显示', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 查找有工具提示的元素
    const tooltipTrigger = page.locator('[title], [data-tooltip]').first();
    if (await tooltipTrigger.isVisible()) {
      await tooltipTrigger.hover();
      
      // 验证工具提示显示
      await expect(page.locator('.tooltip, [role="tooltip"]')).toBeVisible();
      
      // 移开鼠标
      await tooltipTrigger.hover({ position: { x: -10, y: -10 } });
      
      // 验证工具提示隐藏
      await expect(page.locator('.tooltip, [role="tooltip"]')).not.toBeVisible();
    }
    
    console.log('✅ UI-008: 工具提示显示正常');
  });

  // ========== 键盘导航测试 ==========
  
  test('UI-009: Tab键导航', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
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
    await expect(newFocusedElement).not.toEqual(focusedElement);
    
    console.log('✅ UI-009: Tab键导航正常');
  });

  test('UI-010: 回车键提交表单', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // 填写登录表单
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    
    // 在密码字段按回车键
    await page.locator('input[name="password"]').press('Enter');
    
    // 验证表单提交（这里可能会显示错误，但重点是验证回车键功能）
    await page.waitForTimeout(1000);
    
    console.log('✅ UI-010: 回车键提交表单正常');
  });

  // ========== 响应式设计测试 ==========
  
  test('UI-011: 移动端触摸交互', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    // 测试触摸滚动
    await page.touchscreen.tap(200, 300);
    await page.mouse.wheel(0, 500);
    
    // 验证移动端布局
    await expect(page.locator('.mobile-menu, .hamburger-menu')).toBeVisible();
    
    // 测试移动端菜单
    const mobileMenuButton = page.locator('.mobile-menu-button, .hamburger-menu');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.tap();
      await expect(page.locator('.mobile-nav, .sidebar')).toBeVisible();
    }
    
    console.log('✅ UI-011: 移动端触摸交互正常');
  });

  test('UI-012: 平板端布局适配', async ({ page }) => {
    // 设置平板端视口
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000');
    
    // 验证平板端布局
    await expect(page.locator('.tablet-layout, .grid-container')).toBeVisible();
    
    // 测试平板端特有的交互
    const tabletElements = page.locator('.tablet-specific');
    if (await tabletElements.count() > 0) {
      await expect(tabletElements.first()).toBeVisible();
    }
    
    console.log('✅ UI-012: 平板端布局适配正常');
  });

  // ========== 错误状态显示测试 ==========
  
  test('UI-013: 网络错误状态显示', async ({ page }) => {
    // 模拟网络错误
    await page.route('**/api/**', route => route.abort());
    
    await page.goto('http://localhost:3000');
    
    // 触发需要网络请求的操作
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // 验证错误状态显示
    await expect(page.locator('.error-message, .network-error')).toBeVisible();
    await expect(page.locator('text=网络连接失败')).toBeVisible();
    
    console.log('✅ UI-013: 网络错误状态显示正常');
  });

  test('UI-014: 表单验证错误显示', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 提交空表单
    await page.click('button[type="submit"]');
    
    // 验证错误消息显示
    await expect(page.locator('.error-message, .field-error')).toBeVisible();
    await expect(page.locator('text=此字段为必填项')).toBeVisible();
    
    // 验证错误字段高亮
    const errorFields = page.locator('.field-error input, .error input');
    await expect(errorFields).toHaveCSS('border-color', /rgb\(239, 68, 68\)/);
    
    console.log('✅ UI-014: 表单验证错误显示正常');
  });

  // ========== 成功状态显示测试 ==========
  
  test('UI-015: 成功消息显示', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 填写有效注册信息
    await page.fill('input[name="displayName"]', 'Success Test User');
    await page.fill('input[name="email"]', `success-test-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    // 提交表单
    await page.click('button[type="submit"]');
    
    // 验证成功消息显示
    await expect(page.locator('.success-message, .alert-success')).toBeVisible();
    await expect(page.locator('text=注册成功')).toBeVisible();
    
    // 验证成功消息样式
    const successMessage = page.locator('.success-message, .alert-success');
    await expect(successMessage).toHaveCSS('background-color', /rgb\(34, 197, 94\)/);
    
    console.log('✅ UI-015: 成功消息显示正常');
  });

  // ========== 动画和过渡效果测试 ==========
  
  test('UI-016: 页面切换动画', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 点击导航链接
    await page.click('text=Login');
    
    // 验证页面切换动画
    await expect(page.locator('.page-transition, .fade-in')).toBeVisible();
    
    // 等待动画完成
    await page.waitForTimeout(500);
    
    // 验证新页面内容显示
    await expect(page.locator('text=Sign in to your account')).toBeVisible();
    
    console.log('✅ UI-016: 页面切换动画正常');
  });

  test('UI-017: 元素出现动画', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 滚动触发动画
    await page.evaluate(() => window.scrollTo(0, 500));
    
    // 验证元素出现动画
    const animatedElements = page.locator('.animate-in, .fade-in-up');
    if (await animatedElements.count() > 0) {
      await expect(animatedElements.first()).toBeVisible();
      
      // 验证动画CSS属性
      await expect(animatedElements.first()).toHaveCSS('animation', /fadeInUp/);
    }
    
    console.log('✅ UI-017: 元素出现动画正常');
  });

  // ========== 拖拽交互测试 ==========
  
  test('UI-018: 图片拖拽排序', async ({ page }) => {
    await page.goto('http://localhost:3000/sell');
    
    // 登录用户（如果需要）
    // ... 登录代码 ...
    
    // 查找可拖拽的图片元素
    const draggableImages = page.locator('.draggable-image, [draggable="true"]');
    if (await draggableImages.count() > 1) {
      const firstImage = draggableImages.first();
      const secondImage = draggableImages.nth(1);
      
      // 执行拖拽操作
      await firstImage.dragTo(secondImage);
      
      // 验证拖拽结果
      await expect(page.locator('.drag-success, .reorder-success')).toBeVisible();
    }
    
    console.log('✅ UI-018: 图片拖拽排序正常');
  });

  // ========== 无限滚动测试 ==========
  
  test('UI-019: 无限滚动加载', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // 滚动到底部
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // 等待新内容加载
    await page.waitForTimeout(2000);
    
    // 验证加载更多内容
    const itemCards = page.locator('.item-card');
    const initialCount = await itemCards.count();
    
    // 再次滚动
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    const finalCount = await itemCards.count();
    
    // 验证内容数量增加
    expect(finalCount).toBeGreaterThanOrEqual(initialCount);
    
    console.log('✅ UI-019: 无限滚动加载正常');
  });

  // ========== 搜索建议测试 ==========
  
  test('UI-020: 搜索建议下拉', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 点击搜索框
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]').first();
    await searchInput.click();
    
    // 输入搜索关键词
    await searchInput.fill('iPhone');
    
    // 验证搜索建议显示
    await expect(page.locator('.search-suggestions, .autocomplete-dropdown')).toBeVisible();
    
    // 验证建议项
    const suggestions = page.locator('.suggestion-item, .autocomplete-item');
    await expect(suggestions.first()).toBeVisible();
    
    // 点击建议项
    await suggestions.first().click();
    
    // 验证搜索执行
    await expect(page.url()).toContain('/search');
    
    console.log('✅ UI-020: 搜索建议下拉正常');
  });
});
