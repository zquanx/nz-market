/**
 * 商品发布和管理自动化测试
 * 使用 Playwright 进行端到端测试
 */

const { test, expect } = require('@playwright/test');
const path = require('path');

// 测试数据
const testItem = {
  title: '测试商品 - iPhone 13 Pro',
  description: '九成新iPhone 13 Pro，256GB，深空灰色，无磕碰，功能正常，原装充电器和数据线',
  price: 1200,
  category: 'electronics',
  condition: 'excellent',
  location: 'Auckland, New Zealand',
  tags: ['iPhone', 'Apple', '手机', '二手']
};

const sellerUser = {
  email: 'seller@test.com',
  password: 'Test123!',
  displayName: '测试卖家'
};

test.describe('商品发布和管理', () => {
  
  test.beforeEach(async ({ page }) => {
    // 登录卖家账户
    await page.goto('http://localhost:3001');
    await page.click('text=登录');
    await page.fill('input[name="email"]', sellerUser.email);
    await page.fill('input[name="password"]', sellerUser.password);
    await page.click('button[type="submit"]');
    
    // 等待登录完成
    await expect(page.locator('text=欢迎, ' + sellerUser.displayName)).toBeVisible();
  });

  test('发布新商品', async ({ page }) => {
    // 访问发布页面
    await page.click('text=发布商品');
    await expect(page.url()).toContain('/sell');
    
    // 填写商品基本信息
    await page.fill('input[name="title"]', testItem.title);
    await page.fill('textarea[name="description"]', testItem.description);
    await page.fill('input[name="price"]', testItem.price.toString());
    
    // 选择分类
    await page.click('select[name="category"]');
    await page.selectOption('select[name="category"]', testItem.category);
    
    // 选择商品状态
    await page.click('select[name="condition"]');
    await page.selectOption('select[name="condition"]', testItem.condition);
    
    // 填写位置
    await page.fill('input[name="location"]', testItem.location);
    
    // 添加标签
    for (const tag of testItem.tags) {
      await page.fill('input[name="tags"]', tag);
      await page.press('input[name="tags"]', 'Enter');
    }
    
    // 上传商品图片
    const imagePath = path.join(__dirname, '../test-images/iphone13.jpg');
    await page.setInputFiles('input[type="file"]', imagePath);
    
    // 等待图片上传完成
    await expect(page.locator('.image-preview')).toBeVisible();
    
    // 预览商品
    await page.click('text=预览');
    await expect(page.locator('text=' + testItem.title)).toBeVisible();
    await expect(page.locator('text=$' + testItem.price)).toBeVisible();
    
    // 发布商品
    await page.click('text=发布');
    
    // 验证发布成功
    await expect(page.locator('text=商品发布成功')).toBeVisible();
    
    // 验证商品在个人中心显示
    await page.click('text=个人中心');
    await expect(page.locator('text=' + testItem.title)).toBeVisible();
  });

  test('编辑商品信息', async ({ page }) => {
    // 进入个人中心
    await page.click('text=个人中心');
    
    // 找到刚发布的商品并点击编辑
    await page.click('text=' + testItem.title);
    await page.click('text=编辑');
    
    // 修改商品信息
    const newTitle = testItem.title + ' - 已编辑';
    await page.fill('input[name="title"]', newTitle);
    await page.fill('input[name="price"]', '1100');
    
    // 保存修改
    await page.click('text=保存');
    
    // 验证修改成功
    await expect(page.locator('text=商品信息已更新')).toBeVisible();
    await expect(page.locator('text=' + newTitle)).toBeVisible();
  });

  test('删除商品', async ({ page }) => {
    // 进入个人中心
    await page.click('text=个人中心');
    
    // 找到商品并点击删除
    await page.click('text=' + testItem.title);
    await page.click('text=删除');
    
    // 确认删除
    await page.click('text=确认删除');
    
    // 验证删除成功
    await expect(page.locator('text=商品已删除')).toBeVisible();
    await expect(page.locator('text=' + testItem.title)).not.toBeVisible();
  });

  test('商品状态管理', async ({ page }) => {
    // 发布一个商品
    await page.click('text=发布商品');
    await page.fill('input[name="title"]', '测试状态管理商品');
    await page.fill('textarea[name="description"]', '测试商品状态管理');
    await page.fill('input[name="price"]', '500');
    await page.selectOption('select[name="category"]', 'electronics');
    await page.selectOption('select[name="condition"]', 'good');
    await page.fill('input[name="location"]', 'Wellington, New Zealand');
    await page.click('text=发布');
    
    // 进入个人中心
    await page.click('text=个人中心');
    
    // 测试下架商品
    await page.click('text=测试状态管理商品');
    await page.click('text=下架');
    await expect(page.locator('text=商品已下架')).toBeVisible();
    
    // 测试重新上架
    await page.click('text=上架');
    await expect(page.locator('text=商品已上架')).toBeVisible();
  });
});

test.describe('商品搜索和筛选', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
  });

  test('关键词搜索', async ({ page }) => {
    // 在搜索框输入关键词
    await page.fill('input[placeholder*="搜索"]', 'iPhone');
    await page.press('input[placeholder*="搜索"]', 'Enter');
    
    // 验证搜索结果
    await expect(page.url()).toContain('/search');
    await expect(page.locator('text=iPhone')).toBeVisible();
    
    // 验证搜索结果数量
    const resultCount = await page.locator('.item-card').count();
    expect(resultCount).toBeGreaterThan(0);
  });

  test('分类筛选', async ({ page }) => {
    // 访问搜索页面
    await page.goto('http://localhost:3001/search');
    
    // 选择电子产品分类
    await page.click('text=电子产品');
    
    // 验证筛选结果
    await expect(page.locator('.filter-active')).toContainText('电子产品');
    
    // 验证所有显示的商品都属于电子产品分类
    const categoryElements = await page.locator('.item-category').all();
    for (const element of categoryElements) {
      await expect(element).toContainText('电子产品');
    }
  });

  test('价格范围筛选', async ({ page }) => {
    await page.goto('http://localhost:3001/search');
    
    // 设置价格范围
    await page.fill('input[name="minPrice"]', '500');
    await page.fill('input[name="maxPrice"]', '1500');
    await page.click('text=应用筛选');
    
    // 验证价格筛选结果
    const priceElements = await page.locator('.item-price').all();
    for (const element of priceElements) {
      const priceText = await element.textContent();
      const price = parseInt(priceText.replace(/[^0-9]/g, ''));
      expect(price).toBeGreaterThanOrEqual(500);
      expect(price).toBeLessThanOrEqual(1500);
    }
  });

  test('商品状态筛选', async ({ page }) => {
    await page.goto('http://localhost:3001/search');
    
    // 选择"新品"状态
    await page.click('text=新品');
    
    // 验证筛选结果
    await expect(page.locator('.filter-active')).toContainText('新品');
    
    // 验证所有显示的商品都是新品状态
    const conditionElements = await page.locator('.item-condition').all();
    for (const element of conditionElements) {
      await expect(element).toContainText('新品');
    }
  });

  test('位置筛选', async ({ page }) => {
    await page.goto('http://localhost:3001/search');
    
    // 选择位置筛选
    await page.fill('input[name="location"]', 'Auckland');
    await page.click('text=应用筛选');
    
    // 验证位置筛选结果
    const locationElements = await page.locator('.item-location').all();
    for (const element of locationElements) {
      await expect(element).toContainText('Auckland');
    }
  });

  test('排序功能', async ({ page }) => {
    await page.goto('http://localhost:3001/search');
    
    // 测试按价格排序
    await page.click('select[name="sortBy"]');
    await page.selectOption('select[name="sortBy"]', 'price_asc');
    
    // 验证价格升序排列
    const priceElements = await page.locator('.item-price').all();
    const prices = [];
    for (const element of priceElements) {
      const priceText = await element.textContent();
      const price = parseInt(priceText.replace(/[^0-9]/g, ''));
      prices.push(price);
    }
    
    // 验证价格数组是升序的
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i-1]);
    }
  });

  test('分页功能', async ({ page }) => {
    await page.goto('http://localhost:3001/search');
    
    // 设置每页显示数量
    await page.selectOption('select[name="pageSize"]', '5');
    
    // 验证每页显示的商品数量
    const itemCount = await page.locator('.item-card').count();
    expect(itemCount).toBeLessThanOrEqual(5);
    
    // 测试翻页
    if (await page.locator('text=下一页').isVisible()) {
      await page.click('text=下一页');
      await expect(page.url()).toContain('page=2');
    }
  });
});

// API测试
test.describe('商品管理API测试', () => {
  
  let authToken;
  
  test.beforeAll(async ({ request }) => {
    // 获取认证令牌
    const loginResponse = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: sellerUser.email,
        password: sellerUser.password
      }
    });
    
    const loginData = await loginResponse.json();
    authToken = loginData.accessToken;
  });

  test('创建商品API', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/items', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        title: 'API测试商品',
        description: '通过API创建的商品',
        price: 800,
        category: 'electronics',
        condition: 'good',
        location: 'Christchurch, New Zealand',
        tags: ['测试', 'API']
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.title).toBe('API测试商品');
    expect(data.price).toBe(800);
  });

  test('搜索商品API', async ({ request }) => {
    const response = await request.get('http://localhost:8080/api/items/search', {
      params: {
        query: 'iPhone',
        category: 'electronics',
        minPrice: 500,
        maxPrice: 1500,
        page: 0,
        size: 10
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.content).toBeDefined();
    expect(Array.isArray(data.content)).toBe(true);
  });

  test('获取商品详情API', async ({ request }) => {
    // 先创建一个商品
    const createResponse = await request.post('http://localhost:8080/api/items', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        title: '详情测试商品',
        description: '用于测试商品详情API',
        price: 600,
        category: 'electronics',
        condition: 'excellent',
        location: 'Dunedin, New Zealand'
      }
    });
    
    const createData = await createResponse.json();
    const itemId = createData.id;
    
    // 获取商品详情
    const response = await request.get(`http://localhost:8080/api/items/${itemId}`);
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(itemId);
    expect(data.title).toBe('详情测试商品');
  });
});
