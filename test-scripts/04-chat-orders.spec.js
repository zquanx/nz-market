/**
 * 聊天和订单功能测试套件
 * 合并了原有的 chat-order.spec.js 中的聊天和订单功能
 * 包含实时聊天、订单创建、支付流程、订单管理等
 */

const { test, expect } = require('@playwright/test');

// 测试数据
const buyerUser = {
  email: 'buyer@test.com',
  password: 'Test123!',
  displayName: '测试买家'
};

const sellerUser = {
  email: 'seller@test.com',
  password: 'Test123!',
  displayName: '测试卖家'
};

const testItem = {
  title: '聊天测试商品 - MacBook Pro',
  description: '2021款MacBook Pro，M1芯片，16GB内存，512GB存储',
  price: 2500,
  category: 'electronics',
  condition: 'excellent',
  location: 'Auckland, New Zealand'
};

test.describe('聊天和订单功能测试套件', () => {
  
  // ========== 实时聊天测试 ==========
  
  test('CHAT-001: 买卖双方聊天流程', async ({ browser }) => {
    // 创建买家和卖家浏览器上下文
    const buyerContext = await browser.newContext();
    const sellerContext = await browser.newContext();
    const buyerPage = await buyerContext.newPage();
    const sellerPage = await sellerContext.newPage();
    
    // 买家登录
    await buyerPage.goto('http://localhost:3000/login');
    await buyerPage.fill('input[name="email"]', buyerUser.email);
    await buyerPage.fill('input[name="password"]', buyerUser.password);
    await buyerPage.click('button[type="submit"]');
    await expect(buyerPage.locator('text=欢迎')).toBeVisible();
    
    // 卖家登录
    await sellerPage.goto('http://localhost:3000/login');
    await sellerPage.fill('input[name="email"]', sellerUser.email);
    await sellerPage.fill('input[name="password"]', sellerUser.password);
    await sellerPage.click('button[type="submit"]');
    await expect(sellerPage.locator('text=欢迎')).toBeVisible();
    
    // 买家搜索商品
    await buyerPage.goto('http://localhost:3000/search');
    await buyerPage.fill('input[placeholder*="搜索"]', testItem.title);
    await buyerPage.press('input[placeholder*="搜索"]', 'Enter');
    await buyerPage.click('text=' + testItem.title);
    
    // 买家发起聊天
    await buyerPage.click('text=联系卖家');
    await expect(buyerPage.locator('.chat-window')).toBeVisible();
    
    // 买家发送消息
    await buyerPage.fill('.chat-input', '你好，这个MacBook还在吗？');
    await buyerPage.press('.chat-input', 'Enter');
    await expect(buyerPage.locator('.message-content:has-text("你好，这个MacBook还在吗？")')).toBeVisible();
    
    // 卖家查看聊天
    await sellerPage.goto('http://localhost:3000/chat');
    await expect(sellerPage.locator('.conversation-item')).toBeVisible();
    await expect(sellerPage.locator('.unread-indicator')).toBeVisible();
    
    // 卖家点击对话
    await sellerPage.click('.conversation-item:first-child');
    await expect(sellerPage.locator('.message-content:has-text("你好，这个MacBook还在吗？")')).toBeVisible();
    
    // 卖家回复消息
    await sellerPage.fill('.chat-input', '是的，还在的。您想什么时候看货？');
    await sellerPage.press('.chat-input', 'Enter');
    await expect(sellerPage.locator('.message-content:has-text("是的，还在的。您想什么时候看货？")')).toBeVisible();
    
    // 验证买家收到消息
    await expect(buyerPage.locator('.message-content:has-text("是的，还在的。您想什么时候看货？")')).toBeVisible();
    
    console.log('✅ CHAT-001: 买卖双方聊天流程成功');
    
    await buyerContext.close();
    await sellerContext.close();
  });

  test('CHAT-002: 聊天历史记录', async ({ browser }) => {
    const buyerContext = await browser.newContext();
    const sellerContext = await browser.newContext();
    const buyerPage = await buyerContext.newPage();
    const sellerPage = await sellerContext.newPage();
    
    // 登录用户
    await buyerPage.goto('http://localhost:3000/login');
    await buyerPage.fill('input[name="email"]', buyerUser.email);
    await buyerPage.fill('input[name="password"]', buyerUser.password);
    await buyerPage.click('button[type="submit"]');
    
    await sellerPage.goto('http://localhost:3000/login');
    await sellerPage.fill('input[name="email"]', sellerUser.email);
    await sellerPage.fill('input[name="password"]', sellerUser.password);
    await sellerPage.click('button[type="submit"]');
    
    // 发送多条消息
    await buyerPage.goto('http://localhost:3000/chat');
    await buyerPage.click('.conversation-item:first-child');
    
    const messages = [
      '第一条消息',
      '第二条消息',
      '第三条消息'
    ];
    
    for (const message of messages) {
      await buyerPage.fill('.chat-input', message);
      await buyerPage.press('.chat-input', 'Enter');
      await page.waitForTimeout(500);
    }
    
    // 刷新页面验证历史记录
    await buyerPage.reload();
    await buyerPage.click('.conversation-item:first-child');
    
    // 验证所有消息都存在
    for (const message of messages) {
      await expect(buyerPage.locator(`.message-content:has-text("${message}")`)).toBeVisible();
    }
    
    console.log('✅ CHAT-002: 聊天历史记录正常');
    
    await buyerContext.close();
    await sellerContext.close();
  });

  test('CHAT-003: 图片消息发送', async ({ browser }) => {
    const buyerContext = await browser.newContext();
    const sellerContext = await browser.newContext();
    const buyerPage = await buyerContext.newPage();
    const sellerPage = await sellerContext.newPage();
    
    // 登录用户
    await buyerPage.goto('http://localhost:3000/login');
    await buyerPage.fill('input[name="email"]', buyerUser.email);
    await buyerPage.fill('input[name="password"]', buyerUser.password);
    await buyerPage.click('button[type="submit"]');
    
    await sellerPage.goto('http://localhost:3000/login');
    await sellerPage.fill('input[name="email"]', sellerUser.email);
    await sellerPage.fill('input[name="password"]', sellerUser.password);
    await sellerPage.click('button[type="submit"]');
    
    // 发送图片消息
    await buyerPage.goto('http://localhost:3000/chat');
    await buyerPage.click('.conversation-item:first-child');
    
    // 点击图片上传按钮
    await buyerPage.click('.image-upload-button');
    
    // 上传图片
    const imagePath = path.join(__dirname, '../test-images/chat-image.jpg');
    await buyerPage.setInputFiles('input[type="file"]', imagePath);
    
    // 验证图片预览
    await expect(buyerPage.locator('.image-preview')).toBeVisible();
    
    // 发送图片
    await buyerPage.click('.send-image-button');
    await expect(buyerPage.locator('.message-image')).toBeVisible();
    
    // 验证卖家收到图片
    await sellerPage.goto('http://localhost:3000/chat');
    await sellerPage.click('.conversation-item:first-child');
    await expect(sellerPage.locator('.message-image')).toBeVisible();
    
    console.log('✅ CHAT-003: 图片消息发送成功');
    
    await buyerContext.close();
    await sellerContext.close();
  });

  test('CHAT-004: 聊天通知功能', async ({ browser }) => {
    const buyerContext = await browser.newContext();
    const sellerContext = await browser.newContext();
    const buyerPage = await buyerContext.newPage();
    const sellerPage = await sellerContext.newPage();
    
    // 登录用户
    await buyerPage.goto('http://localhost:3000/login');
    await buyerPage.fill('input[name="email"]', buyerUser.email);
    await buyerPage.fill('input[name="password"]', buyerUser.password);
    await buyerPage.click('button[type="submit"]');
    
    await sellerPage.goto('http://localhost:3000/login');
    await sellerPage.fill('input[name="email"]', sellerUser.email);
    await sellerPage.fill('input[name="password"]', sellerUser.password);
    await sellerPage.click('button[type="submit"]');
    
    // 买家发送消息
    await buyerPage.goto('http://localhost:3000/chat');
    await buyerPage.click('.conversation-item:first-child');
    await buyerPage.fill('.chat-input', '新消息通知测试');
    await buyerPage.press('.chat-input', 'Enter');
    
    // 验证卖家收到通知
    await sellerPage.goto('http://localhost:3000');
    await expect(sellerPage.locator('.notification-badge')).toBeVisible();
    await expect(sellerPage.locator('.notification-badge')).toContainText('1');
    
    // 点击通知
    await sellerPage.click('.notification-badge');
    await expect(sellerPage.locator('text=新消息通知测试')).toBeVisible();
    
    console.log('✅ CHAT-004: 聊天通知功能正常');
    
    await buyerContext.close();
    await sellerContext.close();
  });

  test('CHAT-005: 聊天API测试', async ({ request }) => {
    // 创建聊天会话
    const createConversationResponse = await request.post('http://localhost:8080/api/chat/conversations', {
      data: {
        itemId: 1,
        buyerId: 1,
        sellerId: 2
      }
    });
    
    expect(createConversationResponse.status()).toBe(201);
    const conversationData = await createConversationResponse.json();
    expect(conversationData).toHaveProperty('id');
    
    // 发送消息
    const sendMessageResponse = await request.post(`http://localhost:8080/api/chat/conversations/${conversationData.id}/messages`, {
      data: {
        content: 'API测试消息',
        senderId: 1,
        type: 'text'
      }
    });
    
    expect(sendMessageResponse.status()).toBe(201);
    const messageData = await sendMessageResponse.json();
    expect(messageData.content).toBe('API测试消息');
    
    // 获取消息历史
    const getMessagesResponse = await request.get(`http://localhost:8080/api/chat/conversations/${conversationData.id}/messages`);
    
    expect(getMessagesResponse.status()).toBe(200);
    const messagesData = await getMessagesResponse.json();
    expect(Array.isArray(messagesData)).toBe(true);
    expect(messagesData.length).toBeGreaterThan(0);
    
    console.log('✅ CHAT-005: 聊天API测试成功');
  });

  // ========== 订单创建测试 ==========
  
  test('ORDER-001: 创建订单流程', async ({ browser }) => {
    const buyerContext = await browser.newContext();
    const sellerContext = await browser.newContext();
    const buyerPage = await buyerContext.newPage();
    const sellerPage = await sellerContext.newPage();
    
    // 登录用户
    await buyerPage.goto('http://localhost:3000/login');
    await buyerPage.fill('input[name="email"]', buyerUser.email);
    await buyerPage.fill('input[name="password"]', buyerUser.password);
    await buyerPage.click('button[type="submit"]');
    
    await sellerPage.goto('http://localhost:3000/login');
    await sellerPage.fill('input[name="email"]', sellerUser.email);
    await sellerPage.fill('input[name="password"]', sellerUser.password);
    await sellerPage.click('button[type="submit"]');
    
    // 买家查看商品详情
    await buyerPage.goto('http://localhost:3000/search');
    await buyerPage.fill('input[placeholder*="搜索"]', testItem.title);
    await buyerPage.press('input[placeholder*="搜索"]', 'Enter');
    await buyerPage.click('text=' + testItem.title);
    
    // 买家创建订单
    await buyerPage.click('text=立即购买');
    await expect(buyerPage.url()).toContain('/checkout');
    
    // 填写收货地址
    await buyerPage.fill('input[name="shippingAddress"]', '123 Test Street, Auckland, New Zealand');
    await buyerPage.fill('input[name="phone"]', '+64 21 123 4567');
    await buyerPage.fill('textarea[name="notes"]', '请小心包装');
    
    // 确认订单
    await buyerPage.click('text=确认订单');
    await expect(buyerPage.locator('text=订单创建成功')).toBeVisible();
    
    // 验证订单状态
    await expect(buyerPage.locator('text=待支付')).toBeVisible();
    
    console.log('✅ ORDER-001: 创建订单流程成功');
    
    await buyerContext.close();
    await sellerContext.close();
  });

  test('ORDER-002: 订单信息验证', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', buyerUser.email);
    await page.fill('input[name="password"]', buyerUser.password);
    await page.click('button[type="submit"]');
    
    // 创建订单
    await page.goto('http://localhost:3000/search');
    await page.fill('input[placeholder*="搜索"]', testItem.title);
    await page.press('input[placeholder*="搜索"]', 'Enter');
    await page.click('text=' + testItem.title);
    await page.click('text=立即购买');
    
    // 验证订单信息显示
    await expect(page.locator('text=' + testItem.title)).toBeVisible();
    await expect(page.locator('text=$' + testItem.price)).toBeVisible();
    await expect(page.locator('text=' + testItem.location)).toBeVisible();
    
    // 验证总价计算
    const totalPrice = testItem.price + 10; // 假设运费10元
    await expect(page.locator('text=$' + totalPrice)).toBeVisible();
    
    console.log('✅ ORDER-002: 订单信息验证正确');
  });

  test('ORDER-003: 订单必填字段验证', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', buyerUser.email);
    await page.fill('input[name="password"]', buyerUser.password);
    await page.click('button[type="submit"]');
    
    // 进入结账页面
    await page.goto('http://localhost:3000/checkout');
    
    // 不填写必填字段，直接提交
    await page.click('text=确认订单');
    
    // 验证必填字段错误
    await expect(page.locator('text=收货地址不能为空')).toBeVisible();
    await expect(page.locator('text=联系电话不能为空')).toBeVisible();
    
    console.log('✅ ORDER-003: 订单必填字段验证正确');
  });

  // ========== 支付流程测试 ==========
  
  test('ORDER-004: Stripe支付流程', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', buyerUser.email);
    await page.fill('input[name="password"]', buyerUser.password);
    await page.click('button[type="submit"]');
    
    // 创建订单
    await page.goto('http://localhost:3000/checkout');
    await page.fill('input[name="shippingAddress"]', '123 Test Street, Auckland, New Zealand');
    await page.fill('input[name="phone"]', '+64 21 123 4567');
    await page.click('text=确认订单');
    
    // 进入支付页面
    await page.click('text=立即支付');
    await expect(page.url()).toContain('/payment');
    
    // 填写Stripe测试卡信息
    await page.fill('input[name="cardNumber"]', '4242424242424242');
    await page.fill('input[name="expiryDate"]', '12/25');
    await page.fill('input[name="cvc"]', '123');
    await page.fill('input[name="cardholderName"]', 'Test User');
    
    // 提交支付
    await page.click('text=确认支付');
    
    // 验证支付成功
    await expect(page.locator('text=支付成功')).toBeVisible();
    await expect(page.locator('text=已支付')).toBeVisible();
    
    console.log('✅ ORDER-004: Stripe支付流程成功');
  });

  test('ORDER-005: 支付失败处理', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', buyerUser.email);
    await page.fill('input[name="password"]', buyerUser.password);
    await page.click('button[type="submit"]');
    
    // 进入支付页面
    await page.goto('http://localhost:3000/payment');
    
    // 使用会失败的测试卡
    await page.fill('input[name="cardNumber"]', '4000000000000002');
    await page.fill('input[name="expiryDate"]', '12/25');
    await page.fill('input[name="cvc"]', '123');
    await page.fill('input[name="cardholderName"]', 'Test User');
    
    // 提交支付
    await page.click('text=确认支付');
    
    // 验证支付失败
    await expect(page.locator('text=支付失败')).toBeVisible();
    await expect(page.locator('text=您的卡被拒绝了')).toBeVisible();
    
    console.log('✅ ORDER-005: 支付失败处理正确');
  });

  test('ORDER-006: 支付API测试', async ({ request }) => {
    // 创建支付意图
    const createPaymentIntentResponse = await request.post('http://localhost:8080/api/payments/create-intent', {
      data: {
        amount: 2500,
        currency: 'nzd',
        orderId: 1
      }
    });
    
    expect(createPaymentIntentResponse.status()).toBe(200);
    const paymentIntentData = await createPaymentIntentResponse.json();
    expect(paymentIntentData).toHaveProperty('clientSecret');
    
    // 确认支付
    const confirmPaymentResponse = await request.post('http://localhost:8080/api/payments/confirm', {
      data: {
        paymentIntentId: paymentIntentData.id,
        paymentMethodId: 'pm_test_123'
      }
    });
    
    expect(confirmPaymentResponse.status()).toBe(200);
    const confirmData = await confirmPaymentResponse.json();
    expect(confirmData.status).toBe('succeeded');
    
    console.log('✅ ORDER-006: 支付API测试成功');
  });

  // ========== 订单状态管理测试 ==========
  
  test('ORDER-007: 卖家确认订单', async ({ browser }) => {
    const buyerContext = await browser.newContext();
    const sellerContext = await browser.newContext();
    const buyerPage = await buyerContext.newPage();
    const sellerPage = await sellerContext.newPage();
    
    // 登录用户
    await buyerPage.goto('http://localhost:3000/login');
    await buyerPage.fill('input[name="email"]', buyerUser.email);
    await buyerPage.fill('input[name="password"]', buyerUser.password);
    await buyerPage.click('button[type="submit"]');
    
    await sellerPage.goto('http://localhost:3000/login');
    await sellerPage.fill('input[name="email"]', sellerUser.email);
    await sellerPage.fill('input[name="password"]', sellerUser.password);
    await sellerPage.click('button[type="submit"]');
    
    // 买家创建并支付订单
    await buyerPage.goto('http://localhost:3000/checkout');
    await buyerPage.fill('input[name="shippingAddress"]', '123 Test Street, Auckland, New Zealand');
    await buyerPage.fill('input[name="phone"]', '+64 21 123 4567');
    await buyerPage.click('text=确认订单');
    await buyerPage.click('text=立即支付');
    await buyerPage.fill('input[name="cardNumber"]', '4242424242424242');
    await buyerPage.fill('input[name="expiryDate"]', '12/25');
    await buyerPage.fill('input[name="cvc"]', '123');
    await buyerPage.fill('input[name="cardholderName"]', 'Test User');
    await buyerPage.click('text=确认支付');
    await page.waitForTimeout(2000);
    
    // 卖家查看订单
    await sellerPage.goto('http://localhost:3000/dashboard/orders');
    await expect(sellerPage.locator('text=待确认')).toBeVisible();
    
    // 卖家确认订单
    await sellerPage.click('text=确认订单');
    await expect(sellerPage.locator('text=订单确认成功')).toBeVisible();
    await expect(sellerPage.locator('text=已确认')).toBeVisible();
    
    // 验证买家看到状态更新
    await buyerPage.goto('http://localhost:3000/dashboard/orders');
    await expect(buyerPage.locator('text=已确认')).toBeVisible();
    
    console.log('✅ ORDER-007: 卖家确认订单成功');
    
    await buyerContext.close();
    await sellerContext.close();
  });

  test('ORDER-008: 卖家发货', async ({ browser }) => {
    const buyerContext = await browser.newContext();
    const sellerContext = await browser.newContext();
    const buyerPage = await buyerContext.newPage();
    const sellerPage = await sellerContext.newPage();
    
    // 登录用户
    await buyerPage.goto('http://localhost:3000/login');
    await buyerPage.fill('input[name="email"]', buyerUser.email);
    await buyerPage.fill('input[name="password"]', buyerUser.password);
    await buyerPage.click('button[type="submit"]');
    
    await sellerPage.goto('http://localhost:3000/login');
    await sellerPage.fill('input[name="email"]', sellerUser.email);
    await sellerPage.fill('input[name="password"]', sellerUser.password);
    await sellerPage.click('button[type="submit"]');
    
    // 卖家标记为已发货
    await sellerPage.goto('http://localhost:3000/dashboard/orders');
    await sellerPage.click('text=标记为已发货');
    
    // 填写物流信息
    await sellerPage.fill('input[name="trackingNumber"]', 'NZ123456789');
    await sellerPage.selectOption('select[name="shippingCompany"]', 'nzpost');
    await sellerPage.click('text=确认发货');
    
    // 验证发货成功
    await expect(sellerPage.locator('text=发货成功')).toBeVisible();
    await expect(sellerPage.locator('text=已发货')).toBeVisible();
    
    // 验证买家看到发货信息
    await buyerPage.goto('http://localhost:3000/dashboard/orders');
    await expect(buyerPage.locator('text=已发货')).toBeVisible();
    await expect(buyerPage.locator('text=NZ123456789')).toBeVisible();
    
    console.log('✅ ORDER-008: 卖家发货成功');
    
    await buyerContext.close();
    await sellerContext.close();
  });

  test('ORDER-009: 买家确认收货', async ({ browser }) => {
    const buyerContext = await browser.newContext();
    const sellerContext = await browser.newContext();
    const buyerPage = await buyerContext.newPage();
    const sellerPage = await sellerContext.newPage();
    
    // 登录用户
    await buyerPage.goto('http://localhost:3000/login');
    await buyerPage.fill('input[name="email"]', buyerUser.email);
    await buyerPage.fill('input[name="password"]', buyerUser.password);
    await buyerPage.click('button[type="submit"]');
    
    await sellerPage.goto('http://localhost:3000/login');
    await sellerPage.fill('input[name="email"]', sellerUser.email);
    await sellerPage.fill('input[name="password"]', sellerUser.password);
    await sellerPage.click('button[type="submit"]');
    
    // 买家确认收货
    await buyerPage.goto('http://localhost:3000/dashboard/orders');
    await buyerPage.click('text=确认收货');
    await buyerPage.click('text=确认');
    
    // 验证收货成功
    await expect(buyerPage.locator('text=收货确认成功')).toBeVisible();
    await expect(buyerPage.locator('text=已完成')).toBeVisible();
    
    // 验证卖家看到订单完成
    await sellerPage.goto('http://localhost:3000/dashboard/orders');
    await expect(sellerPage.locator('text=已完成')).toBeVisible();
    
    console.log('✅ ORDER-009: 买家确认收货成功');
    
    await buyerContext.close();
    await sellerContext.close();
  });

  test('ORDER-010: 订单取消', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', buyerUser.email);
    await page.fill('input[name="password"]', buyerUser.password);
    await page.click('button[type="submit"]');
    
    // 取消订单
    await page.goto('http://localhost:3000/dashboard/orders');
    await page.click('text=取消订单');
    
    // 填写取消原因
    await page.selectOption('select[name="cancelReason"]', 'change_mind');
    await page.fill('textarea[name="cancelNote"]', '改变主意了');
    await page.click('text=确认取消');
    
    // 验证取消成功
    await expect(page.locator('text=订单取消成功')).toBeVisible();
    await expect(page.locator('text=已取消')).toBeVisible();
    
    console.log('✅ ORDER-010: 订单取消成功');
  });

  // ========== 订单API测试 ==========
  
  test('ORDER-011: 订单创建API', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/orders', {
      data: {
        itemId: 1,
        buyerId: 1,
        shippingAddress: '123 Test Street, Auckland, New Zealand',
        phone: '+64 21 123 4567',
        notes: '请小心包装'
      }
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.status).toBe('pending_payment');
    
    console.log('✅ ORDER-011: 订单创建API成功');
  });

  test('ORDER-012: 订单查询API', async ({ request }) => {
    const response = await request.get('http://localhost:8080/api/orders?userId=1&status=pending_payment');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    
    console.log('✅ ORDER-012: 订单查询API成功');
  });

  test('ORDER-013: 订单状态更新API', async ({ request }) => {
    // 先创建一个订单
    const createResponse = await request.post('http://localhost:8080/api/orders', {
      data: {
        itemId: 1,
        buyerId: 1,
        shippingAddress: '123 Test Street, Auckland, New Zealand',
        phone: '+64 21 123 4567'
      }
    });
    
    const createData = await createResponse.json();
    const orderId = createData.id;
    
    // 更新订单状态
    const updateResponse = await request.put(`http://localhost:8080/api/orders/${orderId}/status`, {
      data: {
        status: 'confirmed'
      }
    });
    
    expect(updateResponse.status()).toBe(200);
    const updateData = await updateResponse.json();
    expect(updateData.status).toBe('confirmed');
    
    console.log('✅ ORDER-013: 订单状态更新API成功');
  });

  test('ORDER-014: 订单详情API', async ({ request }) => {
    // 先创建一个订单
    const createResponse = await request.post('http://localhost:8080/api/orders', {
      data: {
        itemId: 1,
        buyerId: 1,
        shippingAddress: '123 Test Street, Auckland, New Zealand',
        phone: '+64 21 123 4567'
      }
    });
    
    const createData = await createResponse.json();
    const orderId = createData.id;
    
    // 获取订单详情
    const detailResponse = await request.get(`http://localhost:8080/api/orders/${orderId}`);
    
    expect(detailResponse.status()).toBe(200);
    const detailData = await detailResponse.json();
    expect(detailData.id).toBe(orderId);
    expect(detailData).toHaveProperty('item');
    expect(detailData).toHaveProperty('buyer');
    
    console.log('✅ ORDER-014: 订单详情API成功');
  });

  test('ORDER-015: 完整订单流程集成测试', async ({ browser }) => {
    const buyerContext = await browser.newContext();
    const sellerContext = await browser.newContext();
    const buyerPage = await buyerContext.newPage();
    const sellerPage = await sellerContext.newPage();
    
    // 登录用户
    await buyerPage.goto('http://localhost:3000/login');
    await buyerPage.fill('input[name="email"]', buyerUser.email);
    await buyerPage.fill('input[name="password"]', buyerUser.password);
    await buyerPage.click('button[type="submit"]');
    
    await sellerPage.goto('http://localhost:3000/login');
    await sellerPage.fill('input[name="email"]', sellerUser.email);
    await sellerPage.fill('input[name="password"]', sellerUser.password);
    await sellerPage.click('button[type="submit"]');
    
    // 1. 买家创建订单
    await buyerPage.goto('http://localhost:3000/checkout');
    await buyerPage.fill('input[name="shippingAddress"]', '123 Integration Test Street, Auckland, New Zealand');
    await buyerPage.fill('input[name="phone"]', '+64 21 123 4567');
    await buyerPage.click('text=确认订单');
    await expect(buyerPage.locator('text=订单创建成功')).toBeVisible();
    
    // 2. 买家支付订单
    await buyerPage.click('text=立即支付');
    await buyerPage.fill('input[name="cardNumber"]', '4242424242424242');
    await buyerPage.fill('input[name="expiryDate"]', '12/25');
    await buyerPage.fill('input[name="cvc"]', '123');
    await buyerPage.fill('input[name="cardholderName"]', 'Integration Test User');
    await buyerPage.click('text=确认支付');
    await expect(buyerPage.locator('text=支付成功')).toBeVisible();
    
    // 3. 卖家确认订单
    await sellerPage.goto('http://localhost:3000/dashboard/orders');
    await sellerPage.click('text=确认订单');
    await expect(sellerPage.locator('text=订单确认成功')).toBeVisible();
    
    // 4. 卖家发货
    await sellerPage.click('text=标记为已发货');
    await sellerPage.fill('input[name="trackingNumber"]', 'INT123456789');
    await sellerPage.selectOption('select[name="shippingCompany"]', 'nzpost');
    await sellerPage.click('text=确认发货');
    await expect(sellerPage.locator('text=发货成功')).toBeVisible();
    
    // 5. 买家确认收货
    await buyerPage.goto('http://localhost:3000/dashboard/orders');
    await buyerPage.click('text=确认收货');
    await buyerPage.click('text=确认');
    await expect(buyerPage.locator('text=收货确认成功')).toBeVisible();
    
    // 6. 买家评价
    await buyerPage.click('text=评价');
    await buyerPage.click('text=5星');
    await buyerPage.fill('textarea[name="reviewContent"]', '商品很好，卖家服务也很棒！');
    await buyerPage.click('text=提交评价');
    await expect(buyerPage.locator('text=评价提交成功')).toBeVisible();
    
    console.log('✅ ORDER-015: 完整订单流程集成测试成功');
    
    await buyerContext.close();
    await sellerContext.close();
  });
});
