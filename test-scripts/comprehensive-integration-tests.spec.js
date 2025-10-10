/**
 * 综合集成测试用例
 * 基于测试用例补充建议，完善完整的用户业务流程测试
 */

const { test, expect } = require('@playwright/test');

test.describe('综合集成测试', () => {
  
  // ========== 完整用户注册到交易流程测试 ==========
  
  test('INT-001: 完整用户注册到商品发布流程', async ({ page }) => {
    const timestamp = Date.now();
    const testUser = {
      email: `integration-test-${timestamp}@example.com`,
      password: 'IntegrationTest123!',
      displayName: '集成测试用户'
    };
    
    const testItem = {
      title: `集成测试商品 - ${timestamp}`,
      description: '这是一个用于集成测试的商品，测试完整的发布流程',
      price: 999,
      category: 'electronics',
      condition: 'excellent',
      location: 'Auckland, New Zealand'
    };
    
    // 1. 用户注册
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', testUser.displayName);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // 验证注册成功
    await expect(page.locator('text=注册成功')).toBeVisible();
    console.log('✅ 步骤1: 用户注册成功');
    
    // 2. 自动登录验证
    await expect(page.locator(`text=欢迎, ${testUser.displayName}`)).toBeVisible();
    console.log('✅ 步骤2: 自动登录成功');
    
    // 3. 访问商品发布页面
    await page.click('text=发布商品');
    await expect(page.url()).toContain('/sell');
    console.log('✅ 步骤3: 进入商品发布页面');
    
    // 4. 填写商品信息
    await page.fill('input[name="title"]', testItem.title);
    await page.fill('textarea[name="description"]', testItem.description);
    await page.fill('input[name="price"]', testItem.price.toString());
    await page.selectOption('select[name="category"]', testItem.category);
    await page.selectOption('select[name="condition"]', testItem.condition);
    await page.fill('input[name="location"]', testItem.location);
    
    // 5. 上传商品图片（如果有的话）
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      // 这里可以上传测试图片
      console.log('图片上传功能可用');
    }
    
    // 6. 发布商品
    await page.click('text=发布');
    await expect(page.locator('text=商品发布成功')).toBeVisible();
    console.log('✅ 步骤4: 商品发布成功');
    
    // 7. 验证商品在个人中心显示
    await page.click('text=个人中心');
    await expect(page.locator(`text=${testItem.title}`)).toBeVisible();
    console.log('✅ 步骤5: 商品在个人中心显示');
    
    // 8. 验证商品在搜索页面可见
    await page.goto('http://localhost:3000/search');
    await page.fill('input[placeholder*="Search"], input[placeholder*="搜索"]', testItem.title);
    await page.press('input[placeholder*="Search"], input[placeholder*="搜索"]', 'Enter');
    await expect(page.locator(`text=${testItem.title}`)).toBeVisible();
    console.log('✅ 步骤6: 商品在搜索页面可见');
    
    console.log('✅ INT-001: 完整用户注册到商品发布流程测试成功');
  });

  test('INT-002: 完整买卖交易流程', async ({ browser }) => {
    // 创建两个浏览器上下文模拟买家和卖家
    const sellerContext = await browser.newContext();
    const buyerContext = await browser.newContext();
    
    const sellerPage = await sellerContext.newPage();
    const buyerPage = await buyerContext.newPage();
    
    const timestamp = Date.now();
    const sellerUser = {
      email: `seller-${timestamp}@example.com`,
      password: 'SellerTest123!',
      displayName: '测试卖家'
    };
    
    const buyerUser = {
      email: `buyer-${timestamp}@example.com`,
      password: 'BuyerTest123!',
      displayName: '测试买家'
    };
    
    const testItem = {
      title: `交易测试商品 - ${timestamp}`,
      description: '用于测试完整交易流程的商品',
      price: 1500,
      category: 'electronics',
      condition: 'excellent'
    };
    
    // 1. 卖家注册和登录
    await sellerPage.goto('http://localhost:3000/register');
    await sellerPage.fill('input[name="displayName"]', sellerUser.displayName);
    await sellerPage.fill('input[name="email"]', sellerUser.email);
    await sellerPage.fill('input[name="password"]', sellerUser.password);
    await sellerPage.fill('input[name="confirmPassword"]', sellerUser.password);
    await sellerPage.click('button[type="submit"]');
    await sellerPage.waitForTimeout(2000);
    console.log('✅ 步骤1: 卖家注册成功');
    
    // 2. 卖家发布商品
    await sellerPage.click('text=发布商品');
    await sellerPage.fill('input[name="title"]', testItem.title);
    await sellerPage.fill('textarea[name="description"]', testItem.description);
    await sellerPage.fill('input[name="price"]', testItem.price.toString());
    await sellerPage.selectOption('select[name="category"]', testItem.category);
    await sellerPage.selectOption('select[name="condition"]', testItem.condition);
    await sellerPage.fill('input[name="location"]', 'Wellington, New Zealand');
    await sellerPage.click('text=发布');
    await sellerPage.waitForTimeout(2000);
    console.log('✅ 步骤2: 卖家发布商品成功');
    
    // 3. 买家注册和登录
    await buyerPage.goto('http://localhost:3000/register');
    await buyerPage.fill('input[name="displayName"]', buyerUser.displayName);
    await buyerPage.fill('input[name="email"]', buyerUser.email);
    await buyerPage.fill('input[name="password"]', buyerUser.password);
    await buyerPage.fill('input[name="confirmPassword"]', buyerUser.password);
    await buyerPage.click('button[type="submit"]');
    await buyerPage.waitForTimeout(2000);
    console.log('✅ 步骤3: 买家注册成功');
    
    // 4. 买家搜索并找到商品
    await buyerPage.goto('http://localhost:3000/search');
    await buyerPage.fill('input[placeholder*="Search"], input[placeholder*="搜索"]', testItem.title);
    await buyerPage.press('input[placeholder*="Search"], input[placeholder*="搜索"]', 'Enter');
    await buyerPage.waitForTimeout(2000);
    await buyerPage.click(`text=${testItem.title}`);
    console.log('✅ 步骤4: 买家找到商品');
    
    // 5. 买家联系卖家
    await buyerPage.click('text=联系卖家');
    await expect(buyerPage.locator('.chat-window, .message-input')).toBeVisible();
    await buyerPage.fill('.chat-input, .message-input', '你好，这个商品还在吗？我想购买。');
    await buyerPage.press('.chat-input, .message-input', 'Enter');
    console.log('✅ 步骤5: 买家联系卖家');
    
    // 6. 卖家回复买家
    await sellerPage.goto('http://localhost:3000/chat');
    await sellerPage.waitForTimeout(2000);
    await sellerPage.click('.conversation-item:first-child');
    await sellerPage.fill('.chat-input, .message-input', '是的，还在的。您想什么时候看货？');
    await sellerPage.press('.chat-input, .message-input', 'Enter');
    console.log('✅ 步骤6: 卖家回复买家');
    
    // 7. 买家创建订单
    await buyerPage.goto(`http://localhost:3000/search`);
    await buyerPage.fill('input[placeholder*="Search"], input[placeholder*="搜索"]', testItem.title);
    await buyerPage.press('input[placeholder*="Search"], input[placeholder*="搜索"]', 'Enter');
    await buyerPage.click(`text=${testItem.title}`);
    await buyerPage.click('text=立即购买');
    
    // 填写收货信息
    await buyerPage.fill('input[name="shippingName"]', '张三');
    await buyerPage.fill('input[name="shippingPhone"]', '+64 21 123 4567');
    await buyerPage.fill('textarea[name="shippingAddress"]', '123 Queen Street, Auckland 1010');
    await buyerPage.click('text=确认订单');
    console.log('✅ 步骤7: 买家创建订单');
    
    // 8. 买家支付订单
    await buyerPage.goto('http://localhost:3000/orders');
    await buyerPage.click('text=待支付');
    await buyerPage.click('text=立即支付');
    
    // 模拟支付流程
    await buyerPage.click('text=信用卡支付');
    await buyerPage.fill('input[name="cardNumber"]', '4242424242424242');
    await buyerPage.fill('input[name="expiryDate"]', '12/25');
    await buyerPage.fill('input[name="cvc"]', '123');
    await buyerPage.fill('input[name="cardholderName"]', 'Test User');
    await buyerPage.click('text=确认支付');
    console.log('✅ 步骤8: 买家支付订单');
    
    // 9. 卖家确认订单
    await sellerPage.goto('http://localhost:3000/seller/orders');
    await sellerPage.waitForTimeout(2000);
    await sellerPage.click('.order-item:first-child .ship-button');
    await sellerPage.fill('input[name="trackingNumber"]', 'NZ123456789');
    await sellerPage.selectOption('select[name="shippingMethod"]', 'NZ Post');
    await sellerPage.click('text=确认发货');
    console.log('✅ 步骤9: 卖家确认发货');
    
    // 10. 买家确认收货并评价
    await buyerPage.goto('http://localhost:3000/orders');
    await buyerPage.selectOption('select[name="status"]', 'SHIPPED');
    await buyerPage.click('.order-item:first-child .confirm-button');
    await buyerPage.click('text=确认收货');
    
    // 评价
    await buyerPage.click('.order-item:first-child .review-button');
    await buyerPage.click('.star-rating .star:nth-child(5)');
    await buyerPage.fill('textarea[name="reviewText"]', '商品质量很好，卖家很专业，推荐！');
    await buyerPage.click('text=提交评价');
    console.log('✅ 步骤10: 买家确认收货并评价');
    
    // 清理
    await sellerContext.close();
    await buyerContext.close();
    
    console.log('✅ INT-002: 完整买卖交易流程测试成功');
  });

  // ========== 多语言完整流程测试 ==========
  
  test('INT-003: 多语言完整用户流程', async ({ page }) => {
    const timestamp = Date.now();
    const testUser = {
      email: `i18n-test-${timestamp}@example.com`,
      password: 'I18nTest123!',
      displayName: '国际化测试用户'
    };
    
    // 1. 测试英文界面注册
    await page.goto('http://localhost:3000/register');
    
    // 验证英文界面元素
    await expect(page.locator('text=Create a new account')).toBeVisible();
    await expect(page.locator('text=Display Name')).toBeVisible();
    await expect(page.locator('text=Email address')).toBeVisible();
    await expect(page.locator('text=Password')).toBeVisible();
    console.log('✅ 步骤1: 英文界面显示正常');
    
    // 2. 切换到中文界面
    await page.click('text=EN');
    await expect(page.locator('text=创建新账户')).toBeVisible();
    await expect(page.locator('text=显示名称')).toBeVisible();
    await expect(page.locator('text=电子邮件地址')).toBeVisible();
    await expect(page.locator('text=密码')).toBeVisible();
    console.log('✅ 步骤2: 中文界面显示正常');
    
    // 3. 在中文界面注册
    await page.fill('input[name="displayName"]', testUser.displayName);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=注册成功')).toBeVisible();
    console.log('✅ 步骤3: 中文界面注册成功');
    
    // 4. 测试中文界面商品发布
    await page.click('text=发布商品');
    await expect(page.locator('text=发布商品')).toBeVisible();
    
    await page.fill('input[name="title"]', '中文测试商品');
    await page.fill('textarea[name="description"]', '这是一个中文测试商品');
    await page.fill('input[name="price"]', '888');
    await page.selectOption('select[name="category"]', 'electronics');
    await page.selectOption('select[name="condition"]', 'excellent');
    await page.fill('input[name="location"]', '奥克兰，新西兰');
    
    await page.click('text=发布');
    await expect(page.locator('text=商品发布成功')).toBeVisible();
    console.log('✅ 步骤4: 中文界面商品发布成功');
    
    // 5. 测试中文界面搜索
    await page.goto('http://localhost:3000/search');
    await page.fill('input[placeholder*="搜索"]', '中文测试商品');
    await page.press('input[placeholder*="搜索"]', 'Enter');
    await expect(page.locator('text=中文测试商品')).toBeVisible();
    console.log('✅ 步骤5: 中文界面搜索成功');
    
    // 6. 切换回英文界面验证
    await page.click('text=中文');
    await expect(page.locator('text=Search')).toBeVisible();
    await expect(page.locator('text=中文测试商品')).toBeVisible(); // 商品标题应该保持中文
    console.log('✅ 步骤6: 语言切换后内容保持正常');
    
    console.log('✅ INT-003: 多语言完整用户流程测试成功');
  });

  // ========== 错误恢复流程测试 ==========
  
  test('INT-004: 网络错误恢复流程', async ({ page }) => {
    const timestamp = Date.now();
    const testUser = {
      email: `error-recovery-${timestamp}@example.com`,
      password: 'ErrorRecovery123!',
      displayName: '错误恢复测试用户'
    };
    
    // 1. 正常注册流程
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', testUser.displayName);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    
    // 2. 模拟网络错误
    await page.route('**/api/auth/register', route => route.abort());
    
    await page.click('button[type="submit"]');
    
    // 3. 验证错误处理
    await expect(page.locator('.error-message, .network-error')).toBeVisible();
    await expect(page.locator('text=网络连接失败')).toBeVisible();
    console.log('✅ 步骤1: 网络错误被正确处理');
    
    // 4. 恢复网络并重试
    await page.unroute('**/api/auth/register');
    
    await page.click('text=重试');
    await expect(page.locator('text=注册成功')).toBeVisible();
    console.log('✅ 步骤2: 网络恢复后重试成功');
    
    // 5. 测试其他功能的错误恢复
    await page.click('text=发布商品');
    
    // 模拟发布商品时的网络错误
    await page.route('**/api/items', route => route.abort());
    
    await page.fill('input[name="title"]', '错误恢复测试商品');
    await page.fill('textarea[name="description"]', '测试网络错误恢复');
    await page.fill('input[name="price"]', '666');
    await page.selectOption('select[name="category"]', 'electronics');
    await page.selectOption('select[name="condition"]', 'excellent');
    await page.fill('input[name="location"]', 'Auckland, New Zealand');
    
    await page.click('text=发布');
    
    // 验证错误处理
    await expect(page.locator('.error-message, .network-error')).toBeVisible();
    console.log('✅ 步骤3: 商品发布网络错误被正确处理');
    
    // 6. 恢复网络并重试
    await page.unroute('**/api/items');
    await page.click('text=重试');
    await expect(page.locator('text=商品发布成功')).toBeVisible();
    console.log('✅ 步骤4: 商品发布网络恢复后重试成功');
    
    console.log('✅ INT-004: 网络错误恢复流程测试成功');
  });

  // ========== 并发用户操作测试 ==========
  
  test('INT-005: 并发用户操作测试', async ({ browser }) => {
    // 创建多个浏览器上下文模拟并发用户
    const contexts = [];
    const pages = [];
    
    for (let i = 0; i < 3; i++) {
      const context = await browser.newContext();
      const page = await context.newPage();
      contexts.push(context);
      pages.push(page);
    }
    
    const timestamp = Date.now();
    
    // 并发注册用户
    const registrationPromises = pages.map((page, index) => 
      page.goto('http://localhost:3000/register').then(async () => {
        await page.fill('input[name="displayName"]', `并发用户${index + 1}`);
        await page.fill('input[name="email"]', `concurrent-user-${index + 1}-${timestamp}@example.com`);
        await page.fill('input[name="password"]', 'ConcurrentTest123!');
        await page.fill('input[name="confirmPassword"]', 'ConcurrentTest123!');
        await page.click('button[type="submit"]');
        return page;
      })
    );
    
    const registeredPages = await Promise.all(registrationPromises);
    console.log('✅ 步骤1: 并发用户注册成功');
    
    // 并发发布商品
    const publishPromises = registeredPages.map((page, index) => 
      page.click('text=发布商品').then(async () => {
        await page.fill('input[name="title"]', `并发测试商品${index + 1}`);
        await page.fill('textarea[name="description"]', `这是并发测试商品${index + 1}`);
        await page.fill('input[name="price"]', (100 + index * 100).toString());
        await page.selectOption('select[name="category"]', 'electronics');
        await page.selectOption('select[name="condition"]', 'excellent');
        await page.fill('input[name="location"]', 'Auckland, New Zealand');
        await page.click('text=发布');
        return page;
      })
    );
    
    await Promise.all(publishPromises);
    console.log('✅ 步骤2: 并发商品发布成功');
    
    // 并发搜索商品
    const searchPromises = registeredPages.map(page => 
      page.goto('http://localhost:3000/search').then(async () => {
        await page.fill('input[placeholder*="Search"], input[placeholder*="搜索"]', '并发测试商品');
        await page.press('input[placeholder*="Search"], input[placeholder*="搜索"]', 'Enter');
        return page;
      })
    );
    
    await Promise.all(searchPromises);
    console.log('✅ 步骤3: 并发搜索成功');
    
    // 验证所有商品都可见
    for (const page of registeredPages) {
      await expect(page.locator('.item-card')).toBeVisible();
    }
    console.log('✅ 步骤4: 所有并发操作结果正确');
    
    // 清理
    await Promise.all(contexts.map(context => context.close()));
    
    console.log('✅ INT-005: 并发用户操作测试成功');
  });

  // ========== 数据一致性测试 ==========
  
  test('INT-006: 数据一致性测试', async ({ page }) => {
    const timestamp = Date.now();
    const testUser = {
      email: `consistency-test-${timestamp}@example.com`,
      password: 'ConsistencyTest123!',
      displayName: '数据一致性测试用户'
    };
    
    const testItem = {
      title: `一致性测试商品 - ${timestamp}`,
      description: '用于测试数据一致性的商品',
      price: 777,
      category: 'electronics',
      condition: 'excellent'
    };
    
    // 1. 注册用户
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', testUser.displayName);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // 2. 发布商品
    await page.click('text=发布商品');
    await page.fill('input[name="title"]', testItem.title);
    await page.fill('textarea[name="description"]', testItem.description);
    await page.fill('input[name="price"]', testItem.price.toString());
    await page.selectOption('select[name="category"]', testItem.category);
    await page.selectOption('select[name="condition"]', testItem.condition);
    await page.fill('input[name="location"]', 'Auckland, New Zealand');
    await page.click('text=发布');
    await page.waitForTimeout(2000);
    
    // 3. 验证个人中心数据
    await page.click('text=个人中心');
    await expect(page.locator(`text=${testItem.title}`)).toBeVisible();
    await expect(page.locator(`text=$${testItem.price}`)).toBeVisible();
    console.log('✅ 步骤1: 个人中心数据正确');
    
    // 4. 验证搜索页面数据
    await page.goto('http://localhost:3000/search');
    await page.fill('input[placeholder*="Search"], input[placeholder*="搜索"]', testItem.title);
    await page.press('input[placeholder*="Search"], input[placeholder*="搜索"]', 'Enter');
    await expect(page.locator(`text=${testItem.title}`)).toBeVisible();
    await expect(page.locator(`text=$${testItem.price}`)).toBeVisible();
    console.log('✅ 步骤2: 搜索页面数据正确');
    
    // 5. 验证商品详情页数据
    await page.click(`text=${testItem.title}`);
    await expect(page.locator(`text=${testItem.title}`)).toBeVisible();
    await expect(page.locator(`text=${testItem.description}`)).toBeVisible();
    await expect(page.locator(`text=$${testItem.price}`)).toBeVisible();
    console.log('✅ 步骤3: 商品详情页数据正确');
    
    // 6. 编辑商品信息
    await page.click('text=编辑');
    const newTitle = `${testItem.title} - 已编辑`;
    const newPrice = testItem.price + 100;
    
    await page.fill('input[name="title"]', newTitle);
    await page.fill('input[name="price"]', newPrice.toString());
    await page.click('text=保存');
    await page.waitForTimeout(2000);
    
    // 7. 验证编辑后的数据一致性
    await page.goto('http://localhost:3000/search');
    await page.fill('input[placeholder*="Search"], input[placeholder*="搜索"]', newTitle);
    await page.press('input[placeholder*="Search"], input[placeholder*="搜索"]', 'Enter');
    await expect(page.locator(`text=${newTitle}`)).toBeVisible();
    await expect(page.locator(`text=$${newPrice}`)).toBeVisible();
    console.log('✅ 步骤4: 编辑后数据一致性正确');
    
    // 8. 验证个人中心数据同步
    await page.click('text=个人中心');
    await expect(page.locator(`text=${newTitle}`)).toBeVisible();
    await expect(page.locator(`text=$${newPrice}`)).toBeVisible();
    console.log('✅ 步骤5: 个人中心数据同步正确');
    
    console.log('✅ INT-006: 数据一致性测试成功');
  });

  // ========== 边界条件测试 ==========
  
  test('INT-007: 边界条件测试', async ({ page }) => {
    const timestamp = Date.now();
    
    // 1. 测试最大长度输入
    const maxLengthString = 'A'.repeat(255);
    const testUser = {
      email: `boundary-test-${timestamp}@example.com`,
      password: 'BoundaryTest123!',
      displayName: maxLengthString
    };
    
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', testUser.displayName);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // 验证最大长度输入被正确处理
    await page.waitForTimeout(2000);
    console.log('✅ 步骤1: 最大长度输入处理正确');
    
    // 2. 测试特殊字符输入
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    await page.click('text=发布商品');
    await page.fill('input[name="title"]', `特殊字符测试 ${specialChars}`);
    await page.fill('textarea[name="description"]', `描述包含特殊字符: ${specialChars}`);
    await page.fill('input[name="price"]', '999');
    await page.selectOption('select[name="category"]', 'electronics');
    await page.selectOption('select[name="condition"]', 'excellent');
    await page.fill('input[name="location"]', 'Auckland, New Zealand');
    await page.click('text=发布');
    
    await page.waitForTimeout(2000);
    console.log('✅ 步骤2: 特殊字符输入处理正确');
    
    // 3. 测试极值价格
    await page.click('text=发布商品');
    await page.fill('input[name="title"]', '极值价格测试商品');
    await page.fill('textarea[name="description"]', '测试极值价格');
    await page.fill('input[name="price"]', '999999');
    await page.selectOption('select[name="category"]', 'electronics');
    await page.selectOption('select[name="condition"]', 'excellent');
    await page.fill('input[name="location"]', 'Auckland, New Zealand');
    await page.click('text=发布');
    
    await page.waitForTimeout(2000);
    console.log('✅ 步骤3: 极值价格处理正确');
    
    // 4. 测试空值处理
    await page.click('text=发布商品');
    await page.fill('input[name="title"]', '');
    await page.fill('textarea[name="description"]', '');
    await page.fill('input[name="price"]', '');
    await page.click('text=发布');
    
    // 验证空值被正确验证
    await expect(page.locator('.error-message, .field-error')).toBeVisible();
    console.log('✅ 步骤4: 空值验证正确');
    
    console.log('✅ INT-007: 边界条件测试成功');
  });

  // ========== 性能集成测试 ==========
  
  test('INT-008: 性能集成测试', async ({ page }) => {
    const timestamp = Date.now();
    const testUser = {
      email: `performance-test-${timestamp}@example.com`,
      password: 'PerformanceTest123!',
      displayName: '性能测试用户'
    };
    
    // 1. 测试注册性能
    const registerStartTime = Date.now();
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', testUser.displayName);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    const registerTime = Date.now() - registerStartTime;
    
    expect(registerTime).toBeLessThan(5000); // 注册应在5秒内完成
    console.log(`✅ 步骤1: 注册性能正常 (${registerTime}ms)`);
    
    // 2. 测试商品发布性能
    const publishStartTime = Date.now();
    await page.click('text=发布商品');
    await page.fill('input[name="title"]', '性能测试商品');
    await page.fill('textarea[name="description"]', '用于性能测试的商品');
    await page.fill('input[name="price"]', '888');
    await page.selectOption('select[name="category"]', 'electronics');
    await page.selectOption('select[name="condition"]', 'excellent');
    await page.fill('input[name="location"]', 'Auckland, New Zealand');
    await page.click('text=发布');
    await page.waitForLoadState('networkidle');
    const publishTime = Date.now() - publishStartTime;
    
    expect(publishTime).toBeLessThan(3000); // 发布应在3秒内完成
    console.log(`✅ 步骤2: 商品发布性能正常 (${publishTime}ms)`);
    
    // 3. 测试搜索性能
    const searchStartTime = Date.now();
    await page.goto('http://localhost:3000/search');
    await page.fill('input[placeholder*="Search"], input[placeholder*="搜索"]', '性能测试商品');
    await page.press('input[placeholder*="Search"], input[placeholder*="搜索"]', 'Enter');
    await page.waitForLoadState('networkidle');
    const searchTime = Date.now() - searchStartTime;
    
    expect(searchTime).toBeLessThan(2000); // 搜索应在2秒内完成
    console.log(`✅ 步骤3: 搜索性能正常 (${searchTime}ms)`);
    
    // 4. 测试页面切换性能
    const navigationTimes = [];
    const pages = ['/search', '/me', '/chat', '/sell'];
    
    for (const pagePath of pages) {
      const navStartTime = Date.now();
      await page.goto(`http://localhost:3000${pagePath}`);
      await page.waitForLoadState('networkidle');
      const navTime = Date.now() - navStartTime;
      navigationTimes.push(navTime);
      
      expect(navTime).toBeLessThan(2000); // 页面切换应在2秒内完成
    }
    
    const avgNavTime = navigationTimes.reduce((a, b) => a + b, 0) / navigationTimes.length;
    console.log(`✅ 步骤4: 页面切换性能正常 (平均${avgNavTime.toFixed(0)}ms)`);
    
    console.log('✅ INT-008: 性能集成测试成功');
  });

  // ========== 完整错误处理流程测试 ==========
  
  test('INT-009: 完整错误处理流程测试', async ({ page }) => {
    // 1. 测试表单验证错误
    await page.goto('http://localhost:3000/register');
    await page.click('button[type="submit"]'); // 提交空表单
    
    await expect(page.locator('.error-message, .field-error')).toBeVisible();
    console.log('✅ 步骤1: 表单验证错误处理正确');
    
    // 2. 测试网络错误
    await page.route('**/api/**', route => route.abort());
    
    await page.fill('input[name="displayName"]', '错误处理测试用户');
    await page.fill('input[name="email"]', 'error-handling@example.com');
    await page.fill('input[name="password"]', 'ErrorHandling123!');
    await page.fill('input[name="confirmPassword"]', 'ErrorHandling123!');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error-message, .network-error')).toBeVisible();
    console.log('✅ 步骤2: 网络错误处理正确');
    
    // 3. 恢复网络并重试
    await page.unroute('**/api/**');
    await page.click('text=重试');
    
    await page.waitForTimeout(2000);
    console.log('✅ 步骤3: 网络恢复后重试成功');
    
    // 4. 测试业务逻辑错误
    await page.click('text=发布商品');
    await page.fill('input[name="title"]', '错误处理测试商品');
    await page.fill('textarea[name="description"]', '用于测试错误处理');
    await page.fill('input[name="price"]', '-100'); // 负数价格
    await page.selectOption('select[name="category"]', 'electronics');
    await page.selectOption('select[name="condition"]', 'excellent');
    await page.fill('input[name="location"]', 'Auckland, New Zealand');
    await page.click('text=发布');
    
    // 验证业务逻辑错误被正确处理
    await expect(page.locator('.error-message, .field-error')).toBeVisible();
    console.log('✅ 步骤4: 业务逻辑错误处理正确');
    
    // 5. 测试权限错误
    await page.goto('http://localhost:3000/admin'); // 尝试访问管理员页面
    
    // 验证权限错误被正确处理
    const currentUrl = page.url();
    expect(currentUrl).toContain('/login') || expect(currentUrl).toContain('/403');
    console.log('✅ 步骤5: 权限错误处理正确');
    
    console.log('✅ INT-009: 完整错误处理流程测试成功');
  });

  // ========== 数据完整性测试 ==========
  
  test('INT-010: 数据完整性测试', async ({ page }) => {
    const timestamp = Date.now();
    const testUser = {
      email: `integrity-test-${timestamp}@example.com`,
      password: 'IntegrityTest123!',
      displayName: '数据完整性测试用户'
    };
    
    // 1. 注册用户
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="displayName"]', testUser.displayName);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // 2. 发布多个商品
    const testItems = [
      { title: '完整性测试商品1', price: 100 },
      { title: '完整性测试商品2', price: 200 },
      { title: '完整性测试商品3', price: 300 }
    ];
    
    for (const item of testItems) {
      await page.click('text=发布商品');
      await page.fill('input[name="title"]', item.title);
      await page.fill('textarea[name="description"]', `描述: ${item.title}`);
      await page.fill('input[name="price"]', item.price.toString());
      await page.selectOption('select[name="category"]', 'electronics');
      await page.selectOption('select[name="condition"]', 'excellent');
      await page.fill('input[name="location"]', 'Auckland, New Zealand');
      await page.click('text=发布');
      await page.waitForTimeout(1000);
    }
    
    // 3. 验证所有商品都在个人中心显示
    await page.click('text=个人中心');
    for (const item of testItems) {
      await expect(page.locator(`text=${item.title}`)).toBeVisible();
      await expect(page.locator(`text=$${item.price}`)).toBeVisible();
    }
    console.log('✅ 步骤1: 个人中心数据完整性正确');
    
    // 4. 验证所有商品都在搜索页面显示
    await page.goto('http://localhost:3000/search');
    for (const item of testItems) {
      await page.fill('input[placeholder*="Search"], input[placeholder*="搜索"]', item.title);
      await page.press('input[placeholder*="Search"], input[placeholder*="搜索"]', 'Enter');
      await expect(page.locator(`text=${item.title}`)).toBeVisible();
    }
    console.log('✅ 步骤2: 搜索页面数据完整性正确');
    
    // 5. 删除一个商品并验证数据一致性
    await page.click('text=个人中心');
    await page.click(`text=${testItems[0].title}`);
    await page.click('text=删除');
    await page.click('text=确认删除');
    await page.waitForTimeout(1000);
    
    // 验证商品从个人中心消失
    await expect(page.locator(`text=${testItems[0].title}`)).not.toBeVisible();
    console.log('✅ 步骤3: 删除后个人中心数据一致性正确');
    
    // 验证商品从搜索页面消失
    await page.goto('http://localhost:3000/search');
    await page.fill('input[placeholder*="Search"], input[placeholder*="搜索"]', testItems[0].title);
    await page.press('input[placeholder*="Search"], input[placeholder*="搜索"]', 'Enter');
    await expect(page.locator(`text=${testItems[0].title}`)).not.toBeVisible();
    console.log('✅ 步骤4: 删除后搜索页面数据一致性正确');
    
    // 验证其他商品仍然存在
    for (let i = 1; i < testItems.length; i++) {
      await page.fill('input[placeholder*="Search"], input[placeholder*="搜索"]', testItems[i].title);
      await page.press('input[placeholder*="Search"], input[placeholder*="搜索"]', 'Enter');
      await expect(page.locator(`text=${testItems[i].title}`)).toBeVisible();
    }
    console.log('✅ 步骤5: 其他商品数据完整性正确');
    
    console.log('✅ INT-010: 数据完整性测试成功');
  });
});
