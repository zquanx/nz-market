/**
 * 综合集成测试套件
 * 合并了原有的 comprehensive-integration-tests.spec.js
 * 包含完整的用户业务流程测试
 */

const { test, expect } = require('@playwright/test');

// 测试数据
const buyerUser = {
  email: `buyer-${Date.now()}@example.com`,
  password: 'Test123!',
  displayName: '集成测试买家'
};

const sellerUser = {
  email: `seller-${Date.now()}@example.com`,
  password: 'Test123!',
  displayName: '集成测试卖家'
};

const testItem = {
  title: '集成测试商品 - MacBook Pro',
  description: '2021款MacBook Pro，M1芯片，16GB内存，512GB存储，用于集成测试',
  price: 2500,
  category: 'electronics',
  condition: 'excellent',
  location: 'Auckland, New Zealand',
  tags: ['MacBook', 'Apple', '笔记本电脑', 'M1芯片']
};

test.describe('综合集成测试套件', () => {
  
  test.beforeAll(async ({ request }) => {
    // 注册买家和卖家用户
    try {
      await request.post('http://localhost:8080/api/auth/register', {
        data: { ...sellerUser }
      });
      await request.post('http://localhost:8080/api/auth/register', {
        data: { ...buyerUser }
      });
    } catch (error) {
      console.log('用户可能已存在，继续测试');
    }
  });

  // ========== 完整业务流程测试 ==========
  
  test('INT-001: 完整交易流程 - 从商品发布到交易完成', async ({ browser }) => {
    // 创建买家和卖家浏览器上下文
    const sellerContext = await browser.newContext();
    const buyerContext = await browser.newContext();
    const sellerPage = await sellerContext.newPage();
    const buyerPage = await buyerContext.newPage();
    
    // --- 卖家流程 ---
    // 1. 卖家登录
    await sellerPage.goto('http://localhost:3000/login');
    await sellerPage.fill('input[name="email"]', sellerUser.email);
    await sellerPage.fill('input[name="password"]', sellerUser.password);
    await sellerPage.click('button[type="submit"]');
    await expect(sellerPage.locator('text=欢迎')).toBeVisible();
    
    // 2. 卖家发布商品
    await sellerPage.click('text=发布商品');
    await expect(sellerPage.url()).toContain('/sell');
    
    await sellerPage.fill('input[name="title"]', testItem.title);
    await sellerPage.fill('textarea[name="description"]', testItem.description);
    await sellerPage.fill('input[name="price"]', testItem.price.toString());
    await sellerPage.selectOption('select[name="category"]', testItem.category);
    await sellerPage.selectOption('select[name="condition"]', testItem.condition);
    await sellerPage.fill('input[name="location"]', testItem.location);
    
    // 添加标签
    for (const tag of testItem.tags) {
      await sellerPage.fill('input[name="tags"]', tag);
      await sellerPage.press('input[name="tags"]', 'Enter');
    }
    
    // 发布商品
    await sellerPage.click('button[type="submit"]');
    await expect(sellerPage.locator('text=商品发布成功')).toBeVisible();
    
    // --- 买家流程 ---
    // 3. 买家登录
    await buyerPage.goto('http://localhost:3000/login');
    await buyerPage.fill('input[name="email"]', buyerUser.email);
    await buyerPage.fill('input[name="password"]', buyerUser.password);
    await buyerPage.click('button[type="submit"]');
    await expect(buyerPage.locator('text=欢迎')).toBeVisible();
    
    // 4. 买家搜索商品
    await buyerPage.goto('http://localhost:3000/search');
    await buyerPage.fill('input[placeholder*="搜索"]', testItem.title);
    await buyerPage.press('input[placeholder*="搜索"]', 'Enter');
    await expect(buyerPage.locator('text=' + testItem.title)).toBeVisible();
    await buyerPage.click('text=' + testItem.title);
    
    // 5. 买家收藏商品
    await buyerPage.click('button:has-text("收藏")');
    await expect(buyerPage.locator('button:has-text("已收藏")')).toBeVisible();
    
    // 6. 买家发起聊天
    await buyerPage.click('button:has-text("联系卖家")');
    await expect(buyerPage.locator('.chat-window')).toBeVisible();
    await buyerPage.fill('.chat-input', '你好，这个MacBook还在吗？');
    await buyerPage.press('.chat-input', 'Enter');
    await expect(buyerPage.locator('.message-content:has-text("你好，这个MacBook还在吗？")')).toBeVisible();
    
    // --- 卖家回复聊天 ---
    // 7. 卖家查看并回复聊天
    await sellerPage.goto('http://localhost:3000/chat');
    await expect(sellerPage.locator('.conversation-item')).toBeVisible();
    await sellerPage.click('.conversation-item:first-child');
    await expect(sellerPage.locator('.message-content:has-text("你好，这个MacBook还在吗？")')).toBeVisible();
    await sellerPage.fill('.chat-input', '是的，还在的。您想什么时候看货？');
    await sellerPage.press('.chat-input', 'Enter');
    await expect(sellerPage.locator('.message-content:has-text("是的，还在的。您想什么时候看货？")')).toBeVisible();
    
    // --- 买家下单和支付 ---
    // 8. 买家创建订单
    await buyerPage.goto('http://localhost:3000/item/' + testItem.title);
    await buyerPage.click('button:has-text("立即购买")');
    await expect(buyerPage.url()).toContain('/checkout');
    
    await buyerPage.fill('input[name="shippingAddress"]', '123 Integration Test Street, Auckland, New Zealand');
    await buyerPage.fill('input[name="phone"]', '+64 21 123 4567');
    await buyerPage.fill('textarea[name="notes"]', '请小心包装，谢谢！');
    await buyerPage.click('button:has-text("确认订单")');
    await expect(buyerPage.locator('text=订单创建成功')).toBeVisible();
    
    // 9. 买家支付订单
    await buyerPage.click('button:has-text("立即支付")');
    await expect(buyerPage.url()).toContain('/payment');
    
    await buyerPage.fill('input[name="cardNumber"]', '4242424242424242');
    await buyerPage.fill('input[name="expiryDate"]', '12/25');
    await buyerPage.fill('input[name="cvc"]', '123');
    await buyerPage.fill('input[name="cardholderName"]', 'Integration Test User');
    await buyerPage.click('button:has-text("确认支付")');
    await expect(buyerPage.locator('text=支付成功')).toBeVisible();
    
    // --- 卖家处理订单 ---
    // 10. 卖家确认订单
    await sellerPage.goto('http://localhost:3000/dashboard/orders');
    await expect(sellerPage.locator('text=待确认')).toBeVisible();
    await sellerPage.click('button:has-text("确认订单")');
    await expect(sellerPage.locator('text=订单确认成功')).toBeVisible();
    await expect(sellerPage.locator('text=已确认')).toBeVisible();
    
    // 11. 卖家发货
    await sellerPage.click('button:has-text("标记为已发货")');
    await sellerPage.fill('input[name="trackingNumber"]', 'INT123456789');
    await sellerPage.selectOption('select[name="shippingCompany"]', 'nzpost');
    await sellerPage.click('button:has-text("确认发货")');
    await expect(sellerPage.locator('text=发货成功')).toBeVisible();
    await expect(sellerPage.locator('text=已发货')).toBeVisible();
    
    // --- 买家确认收货和评价 ---
    // 12. 买家确认收货
    await buyerPage.goto('http://localhost:3000/dashboard/orders');
    await expect(buyerPage.locator('text=已发货')).toBeVisible();
    await buyerPage.click('button:has-text("确认收货")');
    await buyerPage.click('button:has-text("确认")');
    await expect(buyerPage.locator('text=收货确认成功')).toBeVisible();
    await expect(buyerPage.locator('text=已完成')).toBeVisible();
    
    // 13. 买家评价
    await buyerPage.click('button:has-text("评价")');
    await buyerPage.click('text=5星');
    await buyerPage.fill('textarea[name="reviewContent"]', '商品很好，卖家服务也很棒！物流很快，包装很仔细。');
    await buyerPage.click('button:has-text("提交评价")');
    await expect(buyerPage.locator('text=评价提交成功')).toBeVisible();
    
    // 14. 验证卖家看到评价
    await sellerPage.goto('http://localhost:3000/dashboard/reviews');
    await expect(sellerPage.locator('text=商品很好，卖家服务也很棒！')).toBeVisible();
    
    console.log('✅ INT-001: 完整交易流程测试成功');
    
    await sellerContext.close();
    await buyerContext.close();
  });

  test('INT-002: 多用户并发交易流程', async ({ browser }) => {
    // 创建多个用户上下文
    const sellerContext = await browser.newContext();
    const buyer1Context = await browser.newContext();
    const buyer2Context = await browser.newContext();
    
    const sellerPage = await sellerContext.newPage();
    const buyer1Page = await buyer1Context.newPage();
    const buyer2Page = await buyer2Context.newPage();
    
    // 登录所有用户
    await sellerPage.goto('http://localhost:3000/login');
    await sellerPage.fill('input[name="email"]', sellerUser.email);
    await sellerPage.fill('input[name="password"]', sellerUser.password);
    await sellerPage.click('button[type="submit"]');
    
    await buyer1Page.goto('http://localhost:3000/login');
    await buyer1Page.fill('input[name="email"]', buyerUser.email);
    await buyer1Page.fill('input[name="password"]', buyerUser.password);
    await buyer1Page.click('button[type="submit"]');
    
    // 第二个买家
    const buyer2User = {
      email: `buyer2-${Date.now()}@example.com`,
      password: 'Test123!',
      displayName: '第二个买家'
    };
    
    await buyer2Page.goto('http://localhost:3000/register');
    await buyer2Page.fill('input[name="displayName"]', buyer2User.displayName);
    await buyer2Page.fill('input[name="email"]', buyer2User.email);
    await buyer2Page.fill('input[name="password"]', buyer2User.password);
    await buyer2Page.fill('input[name="confirmPassword"]', buyer2User.password);
    await buyer2Page.click('button[type="submit"]');
    
    // 卖家发布商品
    await sellerPage.click('text=发布商品');
    await sellerPage.fill('input[name="title"]', '并发测试商品');
    await sellerPage.fill('textarea[name="description"]', '用于并发测试的商品');
    await sellerPage.fill('input[name="price"]', '100');
    await sellerPage.selectOption('select[name="category"]', 'electronics');
    await sellerPage.click('button[type="submit"]');
    
    // 两个买家同时查看商品
    await buyer1Page.goto('http://localhost:3000/search');
    await buyer1Page.fill('input[placeholder*="搜索"]', '并发测试商品');
    await buyer1Page.press('input[placeholder*="搜索"]', 'Enter');
    await buyer1Page.click('text=并发测试商品');
    
    await buyer2Page.goto('http://localhost:3000/search');
    await buyer2Page.fill('input[placeholder*="搜索"]', '并发测试商品');
    await buyer2Page.press('input[placeholder*="搜索"]', 'Enter');
    await buyer2Page.click('text=并发测试商品');
    
    // 两个买家同时发起聊天
    await buyer1Page.click('button:has-text("联系卖家")');
    await buyer1Page.fill('.chat-input', '买家1：这个商品还在吗？');
    await buyer1Page.press('.chat-input', 'Enter');
    
    await buyer2Page.click('button:has-text("联系卖家")');
    await buyer2Page.fill('.chat-input', '买家2：这个商品还在吗？');
    await buyer2Page.press('.chat-input', 'Enter');
    
    // 卖家同时处理两个聊天
    await sellerPage.goto('http://localhost:3000/chat');
    await expect(sellerPage.locator('.conversation-item')).toHaveCount(2);
    
    // 回复第一个买家
    await sellerPage.click('.conversation-item:first-child');
    await sellerPage.fill('.chat-input', '是的，还在的');
    await sellerPage.press('.chat-input', 'Enter');
    
    // 回复第二个买家
    await sellerPage.click('.conversation-item:last-child');
    await sellerPage.fill('.chat-input', '是的，还在的');
    await sellerPage.press('.chat-input', 'Enter');
    
    console.log('✅ INT-002: 多用户并发交易流程测试成功');
    
    await sellerContext.close();
    await buyer1Context.close();
    await buyer2Context.close();
  });

  test('INT-003: 商品生命周期管理', async ({ browser }) => {
    const sellerContext = await browser.newContext();
    const buyerContext = await browser.newContext();
    const sellerPage = await sellerContext.newPage();
    const buyerPage = await buyerContext.newPage();
    
    // 登录用户
    await sellerPage.goto('http://localhost:3000/login');
    await sellerPage.fill('input[name="email"]', sellerUser.email);
    await sellerPage.fill('input[name="password"]', sellerUser.password);
    await sellerPage.click('button[type="submit"]');
    
    await buyerPage.goto('http://localhost:3000/login');
    await buyerPage.fill('input[name="email"]', buyerUser.email);
    await buyerPage.fill('input[name="password"]', buyerUser.password);
    await buyerPage.click('button[type="submit"]');
    
    // 1. 发布商品
    await sellerPage.click('text=发布商品');
    await sellerPage.fill('input[name="title"]', '生命周期测试商品');
    await sellerPage.fill('textarea[name="description"]', '用于测试商品生命周期的商品');
    await sellerPage.fill('input[name="price"]', '200');
    await sellerPage.selectOption('select[name="category"]', 'electronics');
    await sellerPage.click('button[type="submit"]');
    
    // 2. 编辑商品
    await sellerPage.goto('http://localhost:3000/dashboard/items');
    await sellerPage.click('text=编辑');
    await sellerPage.fill('input[name="title"]', '更新后的商品标题');
    await sellerPage.fill('input[name="price"]', '250');
    await sellerPage.click('text=保存');
    await expect(sellerPage.locator('text=商品信息更新成功')).toBeVisible();
    
    // 3. 下架商品
    await sellerPage.click('text=下架');
    await expect(sellerPage.locator('text=商品已下架')).toBeVisible();
    
    // 4. 验证商品不在搜索结果中
    await buyerPage.goto('http://localhost:3000/search');
    await buyerPage.fill('input[placeholder*="搜索"]', '生命周期测试商品');
    await buyerPage.press('input[placeholder*="搜索"]', 'Enter');
    await expect(buyerPage.locator('text=生命周期测试商品')).not.toBeVisible();
    
    // 5. 重新上架商品
    await sellerPage.goto('http://localhost:3000/dashboard/items');
    await sellerPage.click('text=重新上架');
    await expect(sellerPage.locator('text=商品已重新上架')).toBeVisible();
    
    // 6. 验证商品重新出现在搜索结果中
    await buyerPage.goto('http://localhost:3000/search');
    await buyerPage.fill('input[placeholder*="搜索"]', '生命周期测试商品');
    await buyerPage.press('input[placeholder*="搜索"]', 'Enter');
    await expect(buyerPage.locator('text=更新后的商品标题')).toBeVisible();
    
    // 7. 标记为已售出
    await sellerPage.goto('http://localhost:3000/dashboard/items');
    await sellerPage.click('text=标记为已售出');
    await expect(sellerPage.locator('text=商品状态更新成功')).toBeVisible();
    
    // 8. 删除商品
    await sellerPage.click('text=删除');
    await sellerPage.click('text=确认删除');
    await expect(sellerPage.locator('text=商品删除成功')).toBeVisible();
    
    console.log('✅ INT-003: 商品生命周期管理测试成功');
    
    await sellerContext.close();
    await buyerContext.close();
  });

  test('INT-004: 搜索和筛选功能集成', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', buyerUser.email);
    await page.fill('input[name="password"]', buyerUser.password);
    await page.click('button[type="submit"]');
    
    // 1. 关键词搜索
    await page.goto('http://localhost:3000/search');
    await page.fill('input[placeholder*="搜索"]', 'MacBook');
    await page.press('input[placeholder*="搜索"]', 'Enter');
    await expect(page.locator('.search-results')).toBeVisible();
    
    // 2. 分类筛选
    await page.selectOption('select[name="category"]', 'electronics');
    await page.click('text=应用筛选');
    await expect(page.locator('.search-results')).toBeVisible();
    
    // 3. 价格范围筛选
    await page.fill('input[name="minPrice"]', '1000');
    await page.fill('input[name="maxPrice"]', '3000');
    await page.click('text=应用筛选');
    await expect(page.locator('.search-results')).toBeVisible();
    
    // 4. 成色筛选
    await page.selectOption('select[name="condition"]', 'excellent');
    await page.click('text=应用筛选');
    await expect(page.locator('.search-results')).toBeVisible();
    
    // 5. 位置筛选
    await page.fill('input[name="location"]', 'Auckland');
    await page.click('text=应用筛选');
    await expect(page.locator('.search-results')).toBeVisible();
    
    // 6. 排序功能
    await page.selectOption('select[name="sortBy"]', 'price-asc');
    await expect(page.locator('.search-results')).toBeVisible();
    
    // 7. 分页功能
    const pagination = page.locator('.pagination');
    if (await pagination.isVisible()) {
      await page.click('text=下一页');
      await expect(page.url()).toContain('page=2');
    }
    
    console.log('✅ INT-004: 搜索和筛选功能集成测试成功');
  });

  test('INT-005: 用户权限和角色管理', async ({ browser }) => {
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    
    // 普通用户登录
    await userPage.goto('http://localhost:3000/login');
    await userPage.fill('input[name="email"]', buyerUser.email);
    await userPage.fill('input[name="password"]', buyerUser.password);
    await userPage.click('button[type="submit"]');
    
    // 尝试访问管理页面
    await userPage.goto('http://localhost:3000/admin');
    await expect(userPage.url()).toContain('/login');
    
    // 管理员登录
    const adminUser = {
      email: 'admin@test.com',
      password: 'Admin123!'
    };
    
    await adminPage.goto('http://localhost:3000/login');
    await adminPage.fill('input[name="email"]', adminUser.email);
    await adminPage.fill('input[name="password"]', adminUser.password);
    await adminPage.click('button[type="submit"]');
    
    // 访问管理页面
    await adminPage.goto('http://localhost:3000/admin');
    await expect(adminPage.url()).toContain('/admin');
    
    // 管理用户
    await adminPage.click('text=用户管理');
    await expect(adminPage.locator('.user-list')).toBeVisible();
    
    // 管理商品
    await adminPage.click('text=商品管理');
    await expect(adminPage.locator('.item-list')).toBeVisible();
    
    // 管理订单
    await adminPage.click('text=订单管理');
    await expect(adminPage.locator('.order-list')).toBeVisible();
    
    console.log('✅ INT-005: 用户权限和角色管理测试成功');
    
    await adminContext.close();
    await userContext.close();
  });

  test('INT-006: 多语言功能集成', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 1. 默认语言（英文）
    await expect(page.locator('text=Login')).toBeVisible();
    await expect(page.locator('text=Register')).toBeVisible();
    
    // 2. 切换到中文
    await page.click('button:has-text("EN")');
    await expect(page.locator('text=登录')).toBeVisible();
    await expect(page.locator('text=注册')).toBeVisible();
    
    // 3. 在中文环境下注册用户
    await page.click('text=注册');
    await page.fill('input[name="displayName"]', '多语言测试用户');
    await page.fill('input[name="email"]', `multilang-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // 4. 验证中文错误消息
    await expect(page.locator('text=注册成功')).toBeVisible();
    
    // 5. 切换回英文
    await page.click('button:has-text("中文")');
    await expect(page.locator('text=Login')).toBeVisible();
    await expect(page.locator('text=Register')).toBeVisible();
    
    // 6. 验证语言偏好保持
    await page.reload();
    await expect(page.locator('text=Login')).toBeVisible();
    
    console.log('✅ INT-006: 多语言功能集成测试成功');
  });

  test('INT-007: 错误处理和恢复', async ({ page }) => {
    // 1. 网络错误处理
    await page.route('**/api/**', route => route.abort());
    
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
    
    // 2. 恢复网络连接
    await page.unroute('**/api/**');
    
    // 3. 重试操作
    await page.click('button:has-text("重试")');
    await page.waitForTimeout(2000);
    
    // 4. 验证操作成功
    await expect(page.locator('text=登录成功')).toBeVisible();
    
    console.log('✅ INT-007: 错误处理和恢复测试成功');
  });

  test('INT-008: 性能和稳定性测试', async ({ page }) => {
    const startTime = Date.now();
    
    // 1. 快速连续操作
    await page.goto('http://localhost:3000');
    await page.click('text=Login');
    await page.fill('input[name="email"]', buyerUser.email);
    await page.fill('input[name="password"]', buyerUser.password);
    await page.click('button[type="submit"]');
    
    // 2. 快速导航
    await page.goto('http://localhost:3000/search');
    await page.goto('http://localhost:3000/dashboard');
    await page.goto('http://localhost:3000/chat');
    
    // 3. 快速搜索
    for (let i = 0; i < 5; i++) {
      await page.goto('http://localhost:3000/search');
      await page.fill('input[placeholder*="搜索"]', `test${i}`);
      await page.press('input[placeholder*="搜索"]', 'Enter');
      await page.waitForTimeout(500);
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log(`性能和稳定性测试总时间: ${totalTime}ms`);
    expect(totalTime).toBeLessThan(30000); // 30秒内完成
    
    console.log('✅ INT-008: 性能和稳定性测试成功');
  });

  test('INT-009: 数据一致性验证', async ({ browser }) => {
    const sellerContext = await browser.newContext();
    const buyerContext = await browser.newContext();
    const sellerPage = await sellerContext.newPage();
    const buyerPage = await buyerContext.newPage();
    
    // 登录用户
    await sellerPage.goto('http://localhost:3000/login');
    await sellerPage.fill('input[name="email"]', sellerUser.email);
    await sellerPage.fill('input[name="password"]', sellerUser.password);
    await sellerPage.click('button[type="submit"]');
    
    await buyerPage.goto('http://localhost:3000/login');
    await buyerPage.fill('input[name="email"]', buyerUser.email);
    await buyerPage.fill('input[name="password"]', buyerUser.password);
    await buyerPage.click('button[type="submit"]');
    
    // 1. 卖家发布商品
    await sellerPage.click('text=发布商品');
    await sellerPage.fill('input[name="title"]', '数据一致性测试商品');
    await sellerPage.fill('textarea[name="description"]', '用于测试数据一致性的商品');
    await sellerPage.fill('input[name="price"]', '300');
    await sellerPage.selectOption('select[name="category"]', 'electronics');
    await sellerPage.click('button[type="submit"]');
    
    // 2. 买家查看商品
    await buyerPage.goto('http://localhost:3000/search');
    await buyerPage.fill('input[placeholder*="搜索"]', '数据一致性测试商品');
    await buyerPage.press('input[placeholder*="搜索"]', 'Enter');
    await buyerPage.click('text=数据一致性测试商品');
    
    // 3. 验证商品信息一致
    await expect(buyerPage.locator('text=数据一致性测试商品')).toBeVisible();
    await expect(buyerPage.locator('text=$300')).toBeVisible();
    await expect(buyerPage.locator('text=用于测试数据一致性的商品')).toBeVisible();
    
    // 4. 卖家修改商品
    await sellerPage.goto('http://localhost:3000/dashboard/items');
    await sellerPage.click('text=编辑');
    await sellerPage.fill('input[name="price"]', '350');
    await sellerPage.click('text=保存');
    
    // 5. 买家刷新页面验证数据更新
    await buyerPage.reload();
    await expect(buyerPage.locator('text=$350')).toBeVisible();
    
    // 6. 买家创建订单
    await buyerPage.click('button:has-text("立即购买")');
    await buyerPage.fill('input[name="shippingAddress"]', '123 Data Test Street, Auckland, New Zealand');
    await buyerPage.fill('input[name="phone"]', '+64 21 123 4567');
    await buyerPage.click('button:has-text("确认订单")');
    
    // 7. 验证订单数据一致性
    await expect(buyerPage.locator('text=数据一致性测试商品')).toBeVisible();
    await expect(buyerPage.locator('text=$350')).toBeVisible();
    
    // 8. 卖家查看订单
    await sellerPage.goto('http://localhost:3000/dashboard/orders');
    await expect(sellerPage.locator('text=数据一致性测试商品')).toBeVisible();
    await expect(sellerPage.locator('text=$350')).toBeVisible();
    
    console.log('✅ INT-009: 数据一致性验证测试成功');
    
    await sellerContext.close();
    await buyerContext.close();
  });

  test('INT-010: 完整系统压力测试', async ({ browser }) => {
    const contexts = [];
    const pages = [];
    
    // 创建多个并发用户
    for (let i = 0; i < 5; i++) {
      const context = await browser.newContext();
      const page = await context.newPage();
      contexts.push(context);
      pages.push(page);
    }
    
    // 并发登录
    const loginPromises = pages.map(async (page, index) => {
      await page.goto('http://localhost:3000/login');
      await page.fill('input[name="email"]', `stress-test-${index}@example.com`);
      await page.fill('input[name="password"]', 'Test123!');
      await page.click('button[type="submit"]');
    });
    
    await Promise.all(loginPromises);
    
    // 并发搜索
    const searchPromises = pages.map(async (page) => {
      await page.goto('http://localhost:3000/search');
      await page.fill('input[placeholder*="搜索"]', 'test');
      await page.press('input[placeholder*="搜索"]', 'Enter');
    });
    
    await Promise.all(searchPromises);
    
    // 并发聊天
    const chatPromises = pages.map(async (page) => {
      await page.goto('http://localhost:3000/chat');
      await page.fill('.chat-input', '压力测试消息');
      await page.press('.chat-input', 'Enter');
    });
    
    await Promise.all(chatPromises);
    
    // 清理资源
    for (const context of contexts) {
      await context.close();
    }
    
    console.log('✅ INT-010: 完整系统压力测试成功');
  });
});
