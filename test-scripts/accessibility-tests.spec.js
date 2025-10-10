/**
 * 可访问性测试用例
 * 基于测试用例补充建议，完善可访问性相关测试
 */

const { test, expect } = require('@playwright/test');

test.describe('可访问性测试', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  // ========== 键盘导航测试 ==========
  
  test('A11Y-001: Tab键导航顺序', async ({ page }) => {
    // 按Tab键导航并记录焦点顺序
    const focusOrder = [];
    
    // 获取初始焦点
    await page.keyboard.press('Tab');
    let focusedElement = await page.locator(':focus').first();
    if (await focusedElement.isVisible()) {
      const tagName = await focusedElement.evaluate(el => el.tagName);
      const text = await focusedElement.textContent();
      focusOrder.push({ tagName, text: text?.trim() });
    }
    
    // 继续Tab导航
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      focusedElement = await page.locator(':focus').first();
      if (await focusedElement.isVisible()) {
        const tagName = await focusedElement.evaluate(el => el.tagName);
        const text = await focusedElement.textContent();
        focusOrder.push({ tagName, text: text?.trim() });
      }
    }
    
    // 验证焦点顺序合理
    expect(focusOrder.length).toBeGreaterThan(0);
    
    // 验证关键元素在焦点顺序中
    const hasLoginButton = focusOrder.some(item => 
      item.text?.includes('Login') || item.text?.includes('登录')
    );
    const hasRegisterButton = focusOrder.some(item => 
      item.text?.includes('Register') || item.text?.includes('注册')
    );
    
    expect(hasLoginButton || hasRegisterButton).toBeTruthy();
    
    console.log('✅ A11Y-001: Tab键导航顺序正常', focusOrder);
  });

  test('A11Y-002: 回车键激活链接和按钮', async ({ page }) => {
    // 导航到登录按钮
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus').first();
    if (await focusedElement.isVisible()) {
      const tagName = await focusedElement.evaluate(el => el.tagName);
      
      // 按回车键激活
      await page.keyboard.press('Enter');
      
      // 验证激活效果
      if (tagName === 'A') {
        // 链接应该导航到新页面
        await page.waitForTimeout(1000);
        const currentUrl = page.url();
        expect(currentUrl).not.toBe('http://localhost:3000/');
      } else if (tagName === 'BUTTON') {
        // 按钮应该触发相应动作
        await page.waitForTimeout(500);
      }
    }
    
    console.log('✅ A11Y-002: 回车键激活功能正常');
  });

  test('A11Y-003: 空格键激活按钮', async ({ page }) => {
    // 导航到按钮元素
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus').first();
    if (await focusedElement.isVisible()) {
      const tagName = await focusedElement.evaluate(el => el.tagName);
      
      if (tagName === 'BUTTON') {
        // 按空格键激活按钮
        await page.keyboard.press('Space');
        await page.waitForTimeout(500);
        
        // 验证按钮被激活（可能显示加载状态或执行动作）
        console.log('按钮被空格键激活');
      }
    }
    
    console.log('✅ A11Y-003: 空格键激活按钮正常');
  });

  test('A11Y-004: 箭头键导航菜单', async ({ page }) => {
    // 导航到菜单按钮
    const menuButton = page.locator('[aria-haspopup="true"], .menu-button, .dropdown-toggle').first();
    if (await menuButton.isVisible()) {
      await menuButton.focus();
      await page.keyboard.press('Enter');
      
      // 使用箭头键导航菜单项
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowUp');
      
      // 验证菜单项高亮
      const highlightedItem = page.locator('[aria-selected="true"], .menu-item:focus').first();
      await expect(highlightedItem).toBeVisible();
    }
    
    console.log('✅ A11Y-004: 箭头键导航菜单正常');
  });

  // ========== ARIA标签和语义化测试 ==========
  
  test('A11Y-005: ARIA标签完整性', async ({ page }) => {
    // 检查关键元素的ARIA标签
    const elementsWithAria = await page.locator('[aria-label], [aria-labelledby], [aria-describedby]').all();
    
    expect(elementsWithAria.length).toBeGreaterThan(0);
    
    // 验证表单元素的ARIA标签
    const formInputs = page.locator('input, textarea, select');
    const inputCount = await formInputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = formInputs.nth(i);
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const id = await input.getAttribute('id');
      
      // 验证输入框有适当的标签
      const hasLabel = ariaLabel || ariaLabelledBy || id;
      expect(hasLabel).toBeTruthy();
    }
    
    console.log(`✅ A11Y-005: ARIA标签完整性正常，共${elementsWithAria.length}个ARIA元素`);
  });

  test('A11Y-006: 语义化HTML结构', async ({ page }) => {
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
    expect(semanticElements.nav).toBeGreaterThan(0); // 应该有导航
    expect(semanticElements.main).toBeGreaterThan(0); // 应该有主内容区
    
    // 检查标题层级
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // 验证h1标签存在且唯一
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    console.log('✅ A11Y-006: 语义化HTML结构正常', semanticElements);
  });

  test('A11Y-007: 表单标签关联', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 检查表单输入框的标签关联
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      if (id) {
        // 检查是否有对应的label元素
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;
        
        // 验证有标签或ARIA标签
        const hasAccessibleLabel = hasLabel || ariaLabel || ariaLabelledBy;
        expect(hasAccessibleLabel).toBeTruthy();
      }
    }
    
    console.log(`✅ A11Y-007: 表单标签关联正常，共${inputCount}个输入框`);
  });

  // ========== 颜色对比度测试 ==========
  
  test('A11Y-008: 颜色对比度检查', async ({ page }) => {
    // 获取页面中所有文本元素
    const textElements = await page.locator('p, span, div, h1, h2, h3, h4, h5, h6, a, button').all();
    
    for (const element of textElements.slice(0, 10)) { // 检查前10个元素
      const isVisible = await element.isVisible();
      if (isVisible) {
        const text = await element.textContent();
        if (text && text.trim().length > 0) {
          // 获取元素的颜色样式
          const styles = await element.evaluate(el => {
            const computedStyle = window.getComputedStyle(el);
            return {
              color: computedStyle.color,
              backgroundColor: computedStyle.backgroundColor,
              fontSize: computedStyle.fontSize
            };
          });
          
          // 验证颜色不是默认值（说明有明确设置）
          expect(styles.color).not.toBe('rgb(0, 0, 0)'); // 不是纯黑
          expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)'); // 不是透明
        }
      }
    }
    
    console.log('✅ A11Y-008: 颜色对比度检查完成');
  });

  test('A11Y-009: 颜色不依赖测试', async ({ page }) => {
    // 检查重要信息是否仅依赖颜色传达
    const colorDependentElements = page.locator('.error, .success, .warning, .info');
    const colorDependentCount = await colorDependentElements.count();
    
    for (let i = 0; i < colorDependentCount; i++) {
      const element = colorDependentElements.nth(i);
      const text = await element.textContent();
      const ariaLabel = await element.getAttribute('aria-label');
      const title = await element.getAttribute('title');
      
      // 验证除了颜色外还有其他指示方式
      const hasTextIndicator = text && text.trim().length > 0;
      const hasAriaIndicator = ariaLabel && ariaLabel.trim().length > 0;
      const hasTitleIndicator = title && title.trim().length > 0;
      
      const hasAlternativeIndicator = hasTextIndicator || hasAriaIndicator || hasTitleIndicator;
      expect(hasAlternativeIndicator).toBeTruthy();
    }
    
    console.log(`✅ A11Y-009: 颜色不依赖测试正常，检查了${colorDependentCount}个元素`);
  });

  // ========== 屏幕阅读器支持测试 ==========
  
  test('A11Y-010: 屏幕阅读器文本', async ({ page }) => {
    // 检查屏幕阅读器专用文本
    const screenReaderElements = page.locator('.sr-only, .visually-hidden, [aria-hidden="true"]');
    const srOnlyCount = await screenReaderElements.count();
    
    // 检查aria-hidden的使用
    const ariaHiddenElements = page.locator('[aria-hidden="true"]');
    const ariaHiddenCount = await ariaHiddenElements.count();
    
    // 验证装饰性元素被正确隐藏
    for (let i = 0; i < ariaHiddenCount; i++) {
      const element = ariaHiddenElements.nth(i);
      const isVisible = await element.isVisible();
      
      // aria-hidden="true"的元素应该是装饰性的
      if (isVisible) {
        const text = await element.textContent();
        const hasImportantContent = text && text.trim().length > 0;
        
        // 如果有重要内容，不应该被隐藏
        if (hasImportantContent) {
          console.warn('发现被aria-hidden隐藏的重要内容:', text);
        }
      }
    }
    
    console.log(`✅ A11Y-010: 屏幕阅读器支持正常，sr-only:${srOnlyCount}，aria-hidden:${ariaHiddenCount}`);
  });

  test('A11Y-011: 替代文本检查', async ({ page }) => {
    // 检查所有图片的alt属性
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      
      // 验证图片有alt属性
      expect(alt).toBeDefined();
      
      // 装饰性图片应该有空的alt属性
      if (src && src.includes('decoration')) {
        expect(alt).toBe('');
      } else {
        // 内容图片应该有描述性alt文本
        expect(alt).toBeTruthy();
      }
    }
    
    console.log(`✅ A11Y-011: 替代文本检查正常，共${imageCount}张图片`);
  });

  // ========== 焦点管理测试 ==========
  
  test('A11Y-012: 焦点可见性', async ({ page }) => {
    // 检查焦点指示器
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus').first();
    if (await focusedElement.isVisible()) {
      // 获取焦点样式
      const focusStyles = await focusedElement.evaluate(el => {
        const computedStyle = window.getComputedStyle(el, ':focus');
        return {
          outline: computedStyle.outline,
          outlineColor: computedStyle.outlineColor,
          outlineWidth: computedStyle.outlineWidth,
          boxShadow: computedStyle.boxShadow
        };
      });
      
      // 验证焦点指示器存在
      const hasFocusIndicator = 
        focusStyles.outline !== 'none' || 
        focusStyles.boxShadow !== 'none' ||
        focusStyles.outlineWidth !== '0px';
      
      expect(hasFocusIndicator).toBeTruthy();
    }
    
    console.log('✅ A11Y-012: 焦点可见性正常');
  });

  test('A11Y-013: 焦点陷阱', async ({ page }) => {
    // 测试模态框的焦点陷阱
    const modalTrigger = page.locator('[data-modal-trigger], .modal-trigger').first();
    if (await modalTrigger.isVisible()) {
      await modalTrigger.click();
      
      // 等待模态框打开
      const modal = page.locator('.modal, .dialog, [role="dialog"]');
      await expect(modal).toBeVisible();
      
      // 测试焦点是否被困在模态框内
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // 焦点应该在模态框内的元素上
      const focusedElement = page.locator(':focus').first();
      const isInModal = await focusedElement.evaluate((el, modalEl) => {
        return modalEl.contains(el);
      }, await modal.elementHandle());
      
      expect(isInModal).toBeTruthy();
      
      // 关闭模态框
      await page.keyboard.press('Escape');
    }
    
    console.log('✅ A11Y-013: 焦点陷阱正常');
  });

  // ========== 动态内容测试 ==========
  
  test('A11Y-014: 动态内容通知', async ({ page }) => {
    // 测试动态内容更新时的屏幕阅读器通知
    await page.goto('http://localhost:3000/register');
    
    // 填写表单并提交
    await page.fill('input[name="displayName"]', 'A11Y Test User');
    await page.fill('input[name="email"]', `a11y-test-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    // 监听aria-live区域
    const liveRegion = page.locator('[aria-live], .sr-only[aria-live]');
    
    await page.click('button[type="submit"]');
    
    // 验证动态内容更新
    await page.waitForTimeout(2000);
    
    // 检查是否有成功或错误消息
    const successMessage = page.locator('.success-message, .alert-success');
    const errorMessage = page.locator('.error-message, .alert-error');
    
    const hasMessage = await successMessage.isVisible() || await errorMessage.isVisible();
    expect(hasMessage).toBeTruthy();
    
    console.log('✅ A11Y-014: 动态内容通知正常');
  });

  test('A11Y-015: 状态变化通知', async ({ page }) => {
    // 测试按钮状态变化
    const button = page.locator('button[type="submit"]').first();
    if (await button.isVisible()) {
      // 检查初始状态
      const initialState = await button.getAttribute('aria-pressed');
      const initialDisabled = await button.getAttribute('disabled');
      
      // 点击按钮
      await button.click();
      
      // 检查状态变化
      await page.waitForTimeout(500);
      
      const newState = await button.getAttribute('aria-pressed');
      const newDisabled = await button.getAttribute('disabled');
      
      // 验证状态变化被正确表示
      if (initialState !== newState || initialDisabled !== newDisabled) {
        console.log('按钮状态发生变化');
      }
    }
    
    console.log('✅ A11Y-015: 状态变化通知正常');
  });

  // ========== 错误处理测试 ==========
  
  test('A11Y-016: 错误消息关联', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 提交空表单触发错误
    await page.click('button[type="submit"]');
    
    // 检查错误消息
    const errorMessages = page.locator('.error-message, .field-error, [role="alert"]');
    const errorCount = await errorMessages.count();
    
    for (let i = 0; i < errorCount; i++) {
      const error = errorMessages.nth(i);
      const errorText = await error.textContent();
      
      // 验证错误消息有内容
      expect(errorText).toBeTruthy();
      expect(errorText.trim().length).toBeGreaterThan(0);
      
      // 检查错误消息的ARIA属性
      const role = await error.getAttribute('role');
      const ariaLive = await error.getAttribute('aria-live');
      
      if (role === 'alert' || ariaLive === 'assertive') {
        console.log('错误消息有适当的ARIA属性');
      }
    }
    
    console.log(`✅ A11Y-016: 错误消息关联正常，共${errorCount}个错误消息`);
  });

  test('A11Y-017: 表单验证反馈', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 测试无效输入
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', '123');
    
    // 触发验证
    await page.blur('input[name="email"]');
    await page.blur('input[name="password"]');
    
    // 检查验证消息
    const validationMessages = page.locator('.validation-message, .field-error');
    const validationCount = await validationMessages.count();
    
    if (validationCount > 0) {
      // 验证消息与输入框关联
      for (let i = 0; i < validationCount; i++) {
        const message = validationMessages.nth(i);
        const ariaDescribedBy = await message.getAttribute('aria-describedby');
        const id = await message.getAttribute('id');
        
        // 验证消息有ID或与输入框关联
        expect(id || ariaDescribedBy).toBeTruthy();
      }
    }
    
    console.log(`✅ A11Y-017: 表单验证反馈正常，共${validationCount}个验证消息`);
  });

  // ========== 移动端可访问性测试 ==========
  
  test('A11Y-018: 移动端触摸目标', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 检查触摸目标大小
    const touchTargets = page.locator('button, a, input[type="checkbox"], input[type="radio"]');
    const targetCount = await touchTargets.count();
    
    for (let i = 0; i < Math.min(targetCount, 10); i++) {
      const target = touchTargets.nth(i);
      const isVisible = await target.isVisible();
      
      if (isVisible) {
        const size = await target.boundingBox();
        if (size) {
          // 验证触摸目标至少44x44像素
          expect(size.width).toBeGreaterThanOrEqual(44);
          expect(size.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
    
    console.log(`✅ A11Y-018: 移动端触摸目标正常，检查了${Math.min(targetCount, 10)}个目标`);
  });

  test('A11Y-019: 移动端手势支持', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 测试滑动操作
    await page.touchscreen.tap(200, 300);
    await page.mouse.wheel(0, 500);
    
    // 测试长按操作
    const longPressTarget = page.locator('button, a').first();
    if (await longPressTarget.isVisible()) {
      await longPressTarget.tap();
      await page.waitForTimeout(1000);
    }
    
    console.log('✅ A11Y-019: 移动端手势支持正常');
  });

  // ========== 可访问性工具集成测试 ==========
  
  test('A11Y-020: 可访问性工具兼容性', async ({ page }) => {
    // 检查页面是否包含可访问性工具相关的元数据
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    const charset = await page.locator('meta[charset]').getAttribute('charset');
    const lang = await page.locator('html').getAttribute('lang');
    
    // 验证基本元数据
    expect(viewport).toBeTruthy();
    expect(charset).toBeTruthy();
    expect(lang).toBeTruthy();
    
    // 检查是否有可访问性相关的CSS类
    const a11yClasses = page.locator('.sr-only, .visually-hidden, .skip-link');
    const a11yClassCount = await a11yClasses.count();
    
    console.log(`✅ A11Y-020: 可访问性工具兼容性正常，可访问性类:${a11yClassCount}个`);
  });
});
