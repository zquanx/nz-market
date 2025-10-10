/**
 * 商品管理功能测试套件
 * 合并了原有的 item-management.spec.js 中的商品发布、编辑、删除、搜索等功能
 * 包含商品生命周期管理和搜索筛选功能
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

test.describe('商品管理功能测试套件', () => {
  
  test.beforeEach(async ({ page }) => {
    // 登录卖家账户
    await page.goto('http://localhost:3000');
    await page.click('text=登录');
    await page.fill('input[name="email"]', sellerUser.email);
    await page.fill('input[name="password"]', sellerUser.password);
    await page.click('button[type="submit"]');
    
    // 等待登录完成
    await expect(page.locator('text=欢迎')).toBeVisible();
  });

  // ========== 商品发布测试 ==========
  
  test('ITEM-001: 发布新商品', async ({ page }) => {
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
    
    // 选择成色
    await page.click('select[name="condition"]');
    await page.selectOption('select[name="condition"]', testItem.condition);
    
    // 填写位置
    await page.fill('input[name="location"]', testItem.location);
    
    // 添加标签
    for (const tag of testItem.tags) {
      await page.fill('input[name="tags"]', tag);
      await page.press('input[name="tags"]', 'Enter');
    }
    
    // 上传图片
    const imagePath = path.join(__dirname, '../test-images/iphone13.jpg');
    await page.setInputFiles('input[type="file"]', imagePath);
    await expect(page.locator('.image-preview')).toBeVisible();
    
    // 预览商品
    await page.click('text=预览');
    await expect(page.locator('text=' + testItem.title)).toBeVisible();
    await expect(page.locator('text=$' + testItem.price)).toBeVisible();
    
    // 发布商品
    await page.click('text=发布');
    await expect(page.locator('text=商品发布成功')).toBeVisible();
    
    // 验证商品出现在个人中心
    await page.click('text=个人中心');
    await expect(page.locator('text=' + testItem.title)).toBeVisible();
    
    console.log('✅ ITEM-001: 发布新商品成功');
  });

  test('ITEM-002: 发布商品 - 必填字段验证', async ({ page }) => {
    await page.click('text=发布商品');
    
    // 不填写任何字段，直接提交
    await page.click('button[type="submit"]');
    
    // 验证必填字段错误
    await expect(page.locator('text=商品标题不能为空')).toBeVisible();
    await expect(page.locator('text=商品描述不能为空')).toBeVisible();
    await expect(page.locator('text=价格不能为空')).toBeVisible();
    await expect(page.locator('text=请选择商品分类')).toBeVisible();
    
    console.log('✅ ITEM-002: 必填字段验证正确');
  });

  test('ITEM-003: 发布商品 - 价格格式验证', async ({ page }) => {
    await page.click('text=发布商品');
    
    // 填写无效价格
    await page.fill('input[name="title"]', '测试商品');
    await page.fill('input[name="price"]', 'invalid-price');
    await page.fill('textarea[name="description"]', '测试描述');
    await page.selectOption('select[name="category"]', 'electronics');
    
    await page.click('button[type="submit"]');
    
    // 验证价格格式错误
    await expect(page.locator('text=请输入有效的价格')).toBeVisible();
    
    console.log('✅ ITEM-003: 价格格式验证正确');
  });

  test('ITEM-004: 发布商品 - 图片上传', async ({ page }) => {
    await page.click('text=发布商品');
    
    // 填写基本信息
    await page.fill('input[name="title"]', '测试商品');
    await page.fill('textarea[name="description"]', '测试描述');
    await page.fill('input[name="price"]', '100');
    await page.selectOption('select[name="category"]', 'electronics');
    
    // 上传多张图片
    const imagePaths = [
      path.join(__dirname, '../test-images/iphone13.jpg'),
      path.join(__dirname, '../test-images/iphone13-2.jpg')
    ];
    
    await page.setInputFiles('input[type="file"]', imagePaths);
    
    // 验证图片预览
    const imagePreviews = page.locator('.image-preview');
    await expect(imagePreviews).toHaveCount(2);
    
    // 删除一张图片
    await page.click('.image-preview:first-child .delete-button');
    await expect(imagePreviews).toHaveCount(1);
    
    console.log('✅ ITEM-004: 图片上传功能正常');
  });

  // ========== 商品编辑测试 ==========
  
  test('ITEM-005: 编辑商品信息', async ({ page }) => {
    // 先发布一个商品
    await page.click('text=发布商品');
    await page.fill('input[name="title"]', '原始标题');
    await page.fill('textarea[name="description"]', '原始描述');
    await page.fill('input[name="price"]', '100');
    await page.selectOption('select[name="category"]', 'electronics');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // 进入个人中心编辑商品
    await page.click('text=个人中心');
    await page.click('text=编辑');
    
    // 修改商品信息
    await page.fill('input[name="title"]', '修改后的标题');
    await page.fill('textarea[name="description"]', '修改后的描述');
    await page.fill('input[name="price"]', '150');
    
    // 保存修改
    await page.click('text=保存');
    await expect(page.locator('text=商品信息更新成功')).toBeVisible();
    
    // 验证修改生效
    await expect(page.locator('text=修改后的标题')).toBeVisible();
    await expect(page.locator('text=$150')).toBeVisible();
    
    console.log('✅ ITEM-005: 编辑商品信息成功');
  });

  test('ITEM-006: 编辑商品 - 权限验证', async ({ browser }) => {
    // 创建另一个用户上下文
    const otherUserContext = await browser.newContext();
    const otherUserPage = await otherUserContext.newPage();
    
    // 其他用户尝试编辑不属于自己的商品
    await otherUserPage.goto('http://localhost:3000/item/edit/123');
    
    // 验证权限错误
    await expect(otherUserPage.locator('text=无权限编辑此商品')).toBeVisible();
    
    await otherUserContext.close();
    console.log('✅ ITEM-006: 编辑权限验证正确');
  });

  // ========== 商品删除测试 ==========
  
  test('ITEM-007: 删除商品', async ({ page }) => {
    // 先发布一个商品
    await page.click('text=发布商品');
    await page.fill('input[name="title"]', '待删除商品');
    await page.fill('textarea[name="description"]', '这个商品将被删除');
    await page.fill('input[name="price"]', '100');
    await page.selectOption('select[name="category"]', 'electronics');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // 进入个人中心删除商品
    await page.click('text=个人中心');
    await page.click('text=删除');
    
    // 确认删除
    await page.click('text=确认删除');
    await expect(page.locator('text=商品删除成功')).toBeVisible();
    
    // 验证商品已删除
    await expect(page.locator('text=待删除商品')).not.toBeVisible();
    
    console.log('✅ ITEM-007: 删除商品成功');
  });

  test('ITEM-008: 删除商品 - 确认对话框', async ({ page }) => {
    await page.click('text=个人中心');
    await page.click('text=删除');
    
    // 取消删除
    await page.click('text=取消');
    await expect(page.locator('text=待删除商品')).toBeVisible();
    
    console.log('✅ ITEM-008: 删除确认对话框正常');
  });

  // ========== 商品状态管理测试 ==========
  
  test('ITEM-009: 商品状态切换', async ({ page }) => {
    await page.click('text=个人中心');
    
    // 将商品标记为已售出
    await page.click('text=标记为已售出');
    await expect(page.locator('text=商品状态更新成功')).toBeVisible();
    await expect(page.locator('text=已售出')).toBeVisible();
    
    // 重新上架商品
    await page.click('text=重新上架');
    await expect(page.locator('text=商品状态更新成功')).toBeVisible();
    await expect(page.locator('text=在售')).toBeVisible();
    
    console.log('✅ ITEM-009: 商品状态切换成功');
  });

  test('ITEM-010: 商品下架', async ({ page }) => {
    await page.click('text=个人中心');
    
    // 下架商品
    await page.click('text=下架');
    await expect(page.locator('text=商品已下架')).toBeVisible();
    await expect(page.locator('text=已下架')).toBeVisible();
    
    // 验证商品不在搜索结果中显示
    await page.goto('http://localhost:3000/search');
    await page.fill('input[placeholder*="搜索"]', '测试商品');
    await page.press('input[placeholder*="搜索"]', 'Enter');
    
    // 下架的商品不应该出现在搜索结果中
    await expect(page.locator('text=测试商品')).not.toBeVisible();
    
    console.log('✅ ITEM-010: 商品下架成功');
  });

  // ========== 商品搜索测试 ==========
  
  test('ITEM-011: 关键词搜索', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // 搜索关键词
    await page.fill('input[placeholder*="搜索"]', 'iPhone');
    await page.press('input[placeholder*="搜索"]', 'Enter');
    
    // 验证搜索结果
    await expect(page.locator('.search-results')).toBeVisible();
    await expect(page.locator('text=iPhone')).toBeVisible();
    
    console.log('✅ ITEM-011: 关键词搜索成功');
  });

  test('ITEM-012: 分类筛选', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // 选择分类筛选
    await page.click('select[name="category"]');
    await page.selectOption('select[name="category"]', 'electronics');
    
    // 验证筛选结果
    await expect(page.locator('.search-results')).toBeVisible();
    
    // 验证所有显示的商品都属于电子分类
    const categoryLabels = page.locator('.item-category');
    const count = await categoryLabels.count();
    for (let i = 0; i < count; i++) {
      const category = await categoryLabels.nth(i).textContent();
      expect(category).toContain('电子');
    }
    
    console.log('✅ ITEM-012: 分类筛选成功');
  });

  test('ITEM-013: 价格范围筛选', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // 设置价格范围
    await page.fill('input[name="minPrice"]', '100');
    await page.fill('input[name="maxPrice"]', '500');
    await page.click('text=应用筛选');
    
    // 验证价格筛选结果
    await expect(page.locator('.search-results')).toBeVisible();
    
    // 验证所有商品价格在范围内
    const priceElements = page.locator('.item-price');
    const count = await priceElements.count();
    for (let i = 0; i < count; i++) {
      const priceText = await priceElements.nth(i).textContent();
      const price = parseInt(priceText.replace(/[^0-9]/g, ''));
      expect(price).toBeGreaterThanOrEqual(100);
      expect(price).toBeLessThanOrEqual(500);
    }
    
    console.log('✅ ITEM-013: 价格范围筛选成功');
  });

  test('ITEM-014: 成色筛选', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // 选择成色筛选
    await page.click('select[name="condition"]');
    await page.selectOption('select[name="condition"]', 'excellent');
    
    // 验证筛选结果
    await expect(page.locator('.search-results')).toBeVisible();
    
    // 验证所有商品都是优秀成色
    const conditionLabels = page.locator('.item-condition');
    const count = await conditionLabels.count();
    for (let i = 0; i < count; i++) {
      const condition = await conditionLabels.nth(i).textContent();
      expect(condition).toContain('优秀');
    }
    
    console.log('✅ ITEM-014: 成色筛选成功');
  });

  test('ITEM-015: 位置筛选', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // 选择位置筛选
    await page.fill('input[name="location"]', 'Auckland');
    await page.click('text=应用筛选');
    
    // 验证筛选结果
    await expect(page.locator('.search-results')).toBeVisible();
    
    // 验证所有商品都在奥克兰
    const locationLabels = page.locator('.item-location');
    const count = await locationLabels.count();
    for (let i = 0; i < count; i++) {
      const location = await locationLabels.nth(i).textContent();
      expect(location).toContain('Auckland');
    }
    
    console.log('✅ ITEM-015: 位置筛选成功');
  });

  test('ITEM-016: 排序功能', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // 按价格从低到高排序
    await page.click('select[name="sortBy"]');
    await page.selectOption('select[name="sortBy"]', 'price-asc');
    
    // 验证排序结果
    await expect(page.locator('.search-results')).toBeVisible();
    
    // 验证价格排序正确
    const priceElements = page.locator('.item-price');
    const count = await priceElements.count();
    if (count > 1) {
      const firstPrice = parseInt(await priceElements.first().textContent());
      const lastPrice = parseInt(await priceElements.last().textContent());
      expect(firstPrice).toBeLessThanOrEqual(lastPrice);
    }
    
    console.log('✅ ITEM-016: 排序功能成功');
  });

  test('ITEM-017: 分页功能', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // 验证分页控件存在
    const pagination = page.locator('.pagination');
    if (await pagination.isVisible()) {
      // 点击下一页
      await page.click('text=下一页');
      await expect(page.url()).toContain('page=2');
      
      // 点击上一页
      await page.click('text=上一页');
      await expect(page.url()).toContain('page=1');
      
      // 点击页码
      const pageNumbers = page.locator('.page-number');
      if (await pageNumbers.count() > 0) {
        await pageNumbers.nth(1).click();
        await expect(page.url()).toContain('page=');
      }
    }
    
    console.log('✅ ITEM-017: 分页功能正常');
  });

  // ========== 商品详情测试 ==========
  
  test('ITEM-018: 商品详情页面', async ({ page }) => {
    // 先发布一个商品
    await page.click('text=发布商品');
    await page.fill('input[name="title"]', '详情测试商品');
    await page.fill('textarea[name="description"]', '这是一个用于测试详情页面的商品');
    await page.fill('input[name="price"]', '200');
    await page.selectOption('select[name="category"]', 'electronics');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // 访问商品详情页
    await page.goto('http://localhost:3000/search');
    await page.fill('input[placeholder*="搜索"]', '详情测试商品');
    await page.press('input[placeholder*="搜索"]', 'Enter');
    await page.click('text=详情测试商品');
    
    // 验证详情页内容
    await expect(page.locator('text=详情测试商品')).toBeVisible();
    await expect(page.locator('text=$200')).toBeVisible();
    await expect(page.locator('text=这是一个用于测试详情页面的商品')).toBeVisible();
    await expect(page.locator('text=联系卖家')).toBeVisible();
    await expect(page.locator('text=收藏')).toBeVisible();
    
    console.log('✅ ITEM-018: 商品详情页面正常');
  });

  test('ITEM-019: 商品收藏功能', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    await page.fill('input[placeholder*="搜索"]', '详情测试商品');
    await page.press('input[placeholder*="搜索"]', 'Enter');
    await page.click('text=详情测试商品');
    
    // 点击收藏按钮
    await page.click('text=收藏');
    await expect(page.locator('text=已收藏')).toBeVisible();
    
    // 验证收藏列表
    await page.click('text=我的收藏');
    await expect(page.locator('text=详情测试商品')).toBeVisible();
    
    // 取消收藏
    await page.click('text=取消收藏');
    await expect(page.locator('text=收藏')).toBeVisible();
    
    console.log('✅ ITEM-019: 商品收藏功能正常');
  });

  test('ITEM-020: 商品举报功能', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    await page.fill('input[placeholder*="搜索"]', '详情测试商品');
    await page.press('input[placeholder*="搜索"]', 'Enter');
    await page.click('text=详情测试商品');
    
    // 点击举报按钮
    await page.click('text=举报');
    
    // 填写举报原因
    await page.selectOption('select[name="reportReason"]', 'spam');
    await page.fill('textarea[name="reportDescription"]', '这是一个测试举报');
    await page.click('text=提交举报');
    
    // 验证举报成功
    await expect(page.locator('text=举报提交成功')).toBeVisible();
    
    console.log('✅ ITEM-020: 商品举报功能正常');
  });

  // ========== API测试 ==========
  
  test('ITEM-021: 商品创建API', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/items', {
      data: {
        title: 'API测试商品',
        description: '通过API创建的商品',
        price: 300,
        category: 'electronics',
        condition: 'good',
        location: 'Wellington, New Zealand'
      }
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.title).toBe('API测试商品');
    
    console.log('✅ ITEM-021: 商品创建API正常');
  });

  test('ITEM-022: 商品搜索API', async ({ request }) => {
    const response = await request.get('http://localhost:8080/api/items/search?q=iPhone&category=electronics');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('items');
    expect(data).toHaveProperty('total');
    expect(Array.isArray(data.items)).toBe(true);
    
    console.log('✅ ITEM-022: 商品搜索API正常');
  });

  test('ITEM-023: 商品详情API', async ({ request }) => {
    // 先创建一个商品
    const createResponse = await request.post('http://localhost:8080/api/items', {
      data: {
        title: 'API详情测试商品',
        description: '用于测试详情API的商品',
        price: 400,
        category: 'electronics',
        condition: 'excellent',
        location: 'Christchurch, New Zealand'
      }
    });
    
    const createData = await createResponse.json();
    const itemId = createData.id;
    
    // 获取商品详情
    const detailResponse = await request.get(`http://localhost:8080/api/items/${itemId}`);
    
    expect(detailResponse.status()).toBe(200);
    const detailData = await detailResponse.json();
    expect(detailData.id).toBe(itemId);
    expect(detailData.title).toBe('API详情测试商品');
    
    console.log('✅ ITEM-023: 商品详情API正常');
  });

  test('ITEM-024: 商品更新API', async ({ request }) => {
    // 先创建一个商品
    const createResponse = await request.post('http://localhost:8080/api/items', {
      data: {
        title: 'API更新测试商品',
        description: '用于测试更新API的商品',
        price: 500,
        category: 'electronics',
        condition: 'good',
        location: 'Dunedin, New Zealand'
      }
    });
    
    const createData = await createResponse.json();
    const itemId = createData.id;
    
    // 更新商品
    const updateResponse = await request.put(`http://localhost:8080/api/items/${itemId}`, {
      data: {
        title: '更新后的商品标题',
        price: 600
      }
    });
    
    expect(updateResponse.status()).toBe(200);
    const updateData = await updateResponse.json();
    expect(updateData.title).toBe('更新后的商品标题');
    expect(updateData.price).toBe(600);
    
    console.log('✅ ITEM-024: 商品更新API正常');
  });

  test('ITEM-025: 商品删除API', async ({ request }) => {
    // 先创建一个商品
    const createResponse = await request.post('http://localhost:8080/api/items', {
      data: {
        title: 'API删除测试商品',
        description: '用于测试删除API的商品',
        price: 700,
        category: 'electronics',
        condition: 'fair',
        location: 'Hamilton, New Zealand'
      }
    });
    
    const createData = await createResponse.json();
    const itemId = createData.id;
    
    // 删除商品
    const deleteResponse = await request.delete(`http://localhost:8080/api/items/${itemId}`);
    
    expect(deleteResponse.status()).toBe(204);
    
    // 验证商品已删除
    const getResponse = await request.get(`http://localhost:8080/api/items/${itemId}`);
    expect(getResponse.status()).toBe(404);
    
    console.log('✅ ITEM-025: 商品删除API正常');
  });
});
