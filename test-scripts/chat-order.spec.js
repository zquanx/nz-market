/**
 * 聊天和订单功能自动化测试
 * 使用 Playwright 进行端到端测试
 */

const { test, expect } = require('@playwright/test');

// 测试用户数据
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
  condition: 'excellent'
};

test.describe('实时聊天功能', () => {
  
  test('买卖双方聊天流程', async ({ browser }) => {
    // 创建两个浏览器上下文（模拟两个用户）
    const buyerContext = await browser.newContext();
    const sellerContext = await browser.newContext();
    
    const buyerPage = await buyerContext.newPage();
    const sellerPage = await sellerContext.newPage();
    
    // 买家登录
    await buyerPage.goto('http://localhost:3001');
    await buyerPage.click('text=登录');
    await buyerPage.fill('input[name="email"]', buyerUser.email);
    await buyerPage.fill('input[name="password"]', buyerUser.password);
    await buyerPage.click('button[type="submit"]');
    
    // 卖家登录
    await sellerPage.goto('http://localhost:3001');
    await sellerPage.click('text=登录');
    await sellerPage.fill('input[name="email"]', sellerUser.email);
    await sellerPage.fill('input[name="password"]', sellerUser.password);
    await sellerPage.click('button[type="submit"]');
    
    // 买家浏览商品并开始聊天
    await buyerPage.goto('http://localhost:3001/search');
    await buyerPage.fill('input[placeholder*="搜索"]', testItem.title);
    await buyerPage.press('input[placeholder*="搜索"]', 'Enter');
    
    // 点击商品进入详情页
    await buyerPage.click('text=' + testItem.title);
    
    // 点击"联系卖家"按钮
    await buyerPage.click('text=联系卖家');
    
    // 验证聊天窗口打开
    await expect(buyerPage.locator('.chat-window')).toBeVisible();
    
    // 买家发送消息
    await buyerPage.fill('.chat-input', '你好，这个MacBook还在吗？');
    await buyerPage.press('.chat-input', 'Enter');
    
    // 验证消息发送成功
    await expect(buyerPage.locator('.message-content:has-text("你好，这个MacBook还在吗？")')).toBeVisible();
    
    // 卖家查看聊天
    await sellerPage.goto('http://localhost:3001/chat');
    
    // 验证聊天列表中有新消息
    await expect(sellerPage.locator('.conversation-item')).toBeVisible();
    await expect(sellerPage.locator('.unread-indicator')).toBeVisible();
    
    // 卖家点击进入聊天
    await sellerPage.click('.conversation-item:first-child');
    
    // 验证看到买家的消息
    await expect(sellerPage.locator('.message-content:has-text("你好，这个MacBook还在吗？")')).toBeVisible();
    
    // 卖家回复消息
    await sellerPage.fill('.chat-input', '是的，还在的。您想什么时候看货？');
    await sellerPage.press('.chat-input', 'Enter');
    
    // 验证卖家消息在买家端显示
    await expect(buyerPage.locator('.message-content:has-text("是的，还在的。您想什么时候看货？")')).toBeVisible();
    
    // 清理
    await buyerContext.close();
    await sellerContext.close();
  });

  test('聊天历史记录', async ({ page }) => {
    // 登录买家账户
    await page.goto('http://localhost:3001');
    await page.click('text=登录');
    await page.fill('input[name="email"]', buyerUser.email);
    await page.fill('input[name="password"]', buyerUser.password);
    await page.click('button[type="submit"]');
    
    // 访问聊天页面
    await page.goto('http://localhost:3001/chat');
    
    // 验证聊天列表显示
    await expect(page.locator('.conversation-list')).toBeVisible();
    
    // 点击进入聊天
    await page.click('.conversation-item:first-child');
    
    // 验证聊天历史记录显示
    await expect(page.locator('.message-list')).toBeVisible();
    
    // 验证消息按时间顺序显示
    const messages = await page.locator('.message-item').all();
    expect(messages.length).toBeGreaterThan(0);
  });

  test('图片消息发送', async ({ page }) => {
    // 登录并进入聊天
    await page.goto('http://localhost:3001');
    await page.click('text=登录');
    await page.fill('input[name="email"]', buyerUser.email);
    await page.fill('input[name="password"]', buyerUser.password);
    await page.click('button[type="submit"]');
    
    await page.goto('http://localhost:3001/chat');
    await page.click('.conversation-item:first-child');
    
    // 点击图片上传按钮
    await page.click('.image-upload-button');
    
    // 选择图片文件
    await page.setInputFiles('input[type="file"]', './test-images/product-image.jpg');
    
    // 验证图片上传成功
    await expect(page.locator('.message-image')).toBeVisible();
    
    // 发送图片消息
    await page.click('text=发送');
    
    // 验证图片消息显示
    await expect(page.locator('.message-content .message-image')).toBeVisible();
  });
});

test.describe('订单创建和支付', () => {
  
  test('创建订单流程', async ({ page }) => {
    // 登录买家账户
    await page.goto('http://localhost:3001');
    await page.click('text=登录');
    await page.fill('input[name="email"]', buyerUser.email);
    await page.fill('input[name="password"]', buyerUser.password);
    await page.click('button[type="submit"]');
    
    // 浏览商品
    await page.goto('http://localhost:3001/search');
    await page.fill('input[placeholder*="搜索"]', testItem.title);
    await page.press('input[placeholder*="搜索"]', 'Enter');
    
    // 点击商品进入详情页
    await page.click('text=' + testItem.title);
    
    // 点击"立即购买"
    await page.click('text=立即购买');
    
    // 验证订单页面打开
    await expect(page.url()).toContain('/order');
    
    // 填写收货信息
    await page.fill('input[name="shippingName"]', '张三');
    await page.fill('input[name="shippingPhone"]', '+64 21 123 4567');
    await page.fill('textarea[name="shippingAddress"]', '123 Queen Street, Auckland 1010');
    
    // 确认订单信息
    await expect(page.locator('text=' + testItem.title)).toBeVisible();
    await expect(page.locator('text=$' + testItem.price)).toBeVisible();
    
    // 创建订单
    await page.click('text=确认订单');
    
    // 验证订单创建成功
    await expect(page.locator('text=订单创建成功')).toBeVisible();
    await expect(page.locator('text=待支付')).toBeVisible();
  });

  test('支付流程', async ({ page }) => {
    // 登录并进入订单页面
    await page.goto('http://localhost:3001');
    await page.click('text=登录');
    await page.fill('input[name="email"]', buyerUser.email);
    await page.fill('input[name="password"]', buyerUser.password);
    await page.click('button[type="submit"]');
    
    await page.goto('http://localhost:3001/orders');
    
    // 找到待支付订单
    await page.click('text=待支付');
    
    // 点击支付按钮
    await page.click('text=立即支付');
    
    // 验证支付页面打开
    await expect(page.locator('text=支付订单')).toBeVisible();
    
    // 选择支付方式（Stripe）
    await page.click('text=信用卡支付');
    
    // 填写测试信用卡信息
    await page.fill('input[name="cardNumber"]', '4242424242424242');
    await page.fill('input[name="expiryDate"]', '12/25');
    await page.fill('input[name="cvc"]', '123');
    await page.fill('input[name="cardholderName"]', 'Test User');
    
    // 确认支付
    await page.click('text=确认支付');
    
    // 验证支付成功
    await expect(page.locator('text=支付成功')).toBeVisible();
    await expect(page.locator('text=已支付')).toBeVisible();
  });

  test('订单状态管理', async ({ page }) => {
    // 登录买家账户
    await page.goto('http://localhost:3001');
    await page.click('text=登录');
    await page.fill('input[name="email"]', buyerUser.email);
    await page.fill('input[name="password"]', buyerUser.password);
    await page.click('button[type="submit"]');
    
    // 访问订单页面
    await page.goto('http://localhost:3001/orders');
    
    // 验证订单列表显示
    await expect(page.locator('.order-list')).toBeVisible();
    
    // 测试订单筛选
    await page.click('text=全部订单');
    await page.selectOption('select[name="status"]', 'PAID');
    
    // 验证只显示已支付订单
    const paidOrders = await page.locator('.order-item .status:has-text("已支付")').count();
    expect(paidOrders).toBeGreaterThan(0);
    
    // 测试取消订单
    await page.selectOption('select[name="status"]', 'PENDING_PAYMENT');
    await page.click('.order-item:first-child .cancel-button');
    await page.click('text=确认取消');
    
    // 验证订单状态更新
    await expect(page.locator('text=订单已取消')).toBeVisible();
  });

  test('卖家订单管理', async ({ page }) => {
    // 登录卖家账户
    await page.goto('http://localhost:3001');
    await page.click('text=登录');
    await page.fill('input[name="email"]', sellerUser.email);
    await page.fill('input[name="password"]', sellerUser.password);
    await page.click('button[type="submit"]');
    
    // 访问卖家订单页面
    await page.goto('http://localhost:3001/seller/orders');
    
    // 验证订单列表显示
    await expect(page.locator('.seller-order-list')).toBeVisible();
    
    // 测试发货功能
    await page.click('.order-item:first-child .ship-button');
    await page.fill('input[name="trackingNumber"]', 'NZ123456789');
    await page.fill('select[name="shippingMethod"]', 'NZ Post');
    await page.click('text=确认发货');
    
    // 验证订单状态更新为已发货
    await expect(page.locator('text=已发货')).toBeVisible();
  });
});

test.describe('评价和反馈系统', () => {
  
  test('买家评价流程', async ({ page }) => {
    // 登录买家账户
    await page.goto('http://localhost:3001');
    await page.click('text=登录');
    await page.fill('input[name="email"]', buyerUser.email);
    await page.fill('input[name="password"]', buyerUser.password);
    await page.click('button[type="submit"]');
    
    // 访问已完成订单
    await page.goto('http://localhost:3001/orders');
    await page.selectOption('select[name="status"]', 'COMPLETED');
    
    // 点击评价按钮
    await page.click('.order-item:first-child .review-button');
    
    // 填写评价
    await page.click('.star-rating .star:nth-child(5)'); // 5星评价
    await page.fill('textarea[name="reviewText"]', '商品质量很好，卖家很专业，推荐！');
    
    // 提交评价
    await page.click('text=提交评价');
    
    // 验证评价提交成功
    await expect(page.locator('text=评价提交成功')).toBeVisible();
  });

  test('举报功能', async ({ page }) => {
    // 登录买家账户
    await page.goto('http://localhost:3001');
    await page.click('text=登录');
    await page.fill('input[name="email"]', buyerUser.email);
    await page.fill('input[name="password"]', buyerUser.password);
    await page.click('button[type="submit"]');
    
    // 访问商品详情页
    await page.goto('http://localhost:3001/search');
    await page.fill('input[placeholder*="搜索"]', testItem.title);
    await page.press('input[placeholder*="搜索"]', 'Enter');
    await page.click('text=' + testItem.title);
    
    // 点击举报按钮
    await page.click('text=举报');
    
    // 选择举报原因
    await page.selectOption('select[name="reportReason"]', 'SPAM');
    await page.fill('textarea[name="reportDescription"]', '这个商品信息不实');
    
    // 提交举报
    await page.click('text=提交举报');
    
    // 验证举报提交成功
    await expect(page.locator('text=举报已提交')).toBeVisible();
  });
});

// API测试
test.describe('聊天和订单API测试', () => {
  
  let buyerToken, sellerToken;
  
  test.beforeAll(async ({ request }) => {
    // 获取买家令牌
    const buyerLoginResponse = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: buyerUser.email,
        password: buyerUser.password
      }
    });
    buyerToken = (await buyerLoginResponse.json()).accessToken;
    
    // 获取卖家令牌
    const sellerLoginResponse = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: sellerUser.email,
        password: sellerUser.password
      }
    });
    sellerToken = (await sellerLoginResponse.json()).accessToken;
  });

  test('创建聊天会话API', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/chat/conversations', {
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      },
      data: {
        itemId: 'test-item-id',
        sellerId: 'test-seller-id'
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.id).toBeDefined();
    expect(data.itemId).toBe('test-item-id');
  });

  test('发送消息API', async ({ request }) => {
    // 先创建聊天会话
    const conversationResponse = await request.post('http://localhost:8080/api/chat/conversations', {
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      },
      data: {
        itemId: 'test-item-id',
        sellerId: 'test-seller-id'
      }
    });
    
    const conversation = await conversationResponse.json();
    
    // 发送消息
    const response = await request.post(`http://localhost:8080/api/chat/conversations/${conversation.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      },
      data: {
        content: '你好，这个商品还在吗？',
        type: 'TEXT'
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.content).toBe('你好，这个商品还在吗？');
    expect(data.type).toBe('TEXT');
  });

  test('创建订单API', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/orders', {
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      },
      data: {
        itemId: 'test-item-id',
        quantity: 1,
        shippingAddress: {
          name: '张三',
          phone: '+64 21 123 4567',
          address: '123 Queen Street, Auckland 1010'
        }
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('PENDING_PAYMENT');
    expect(data.itemId).toBe('test-item-id');
  });

  test('支付订单API', async ({ request }) => {
    // 先创建订单
    const orderResponse = await request.post('http://localhost:8080/api/orders', {
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      },
      data: {
        itemId: 'test-item-id',
        quantity: 1,
        shippingAddress: {
          name: '张三',
          phone: '+64 21 123 4567',
          address: '123 Queen Street, Auckland 1010'
        }
      }
    });
    
    const order = await orderResponse.json();
    
    // 创建支付
    const response = await request.post(`http://localhost:8080/api/orders/${order.id}/pay`, {
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      },
      data: {
        paymentMethod: 'STRIPE',
        paymentIntentId: 'pi_test_123456789'
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('PAID');
  });
});
