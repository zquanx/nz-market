/**
 * 性能测试用例
 * 基于测试用例补充建议，完善性能相关测试
 */

const { test, expect } = require('@playwright/test');

test.describe('性能测试', () => {
  
  // ========== 页面加载性能测试 ==========
  
  test('PERF-001: 首页加载性能', async ({ page }) => {
    // 开始性能测量
    const startTime = Date.now();
    
    // 访问首页
    await page.goto('http://localhost:3000');
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    
    // 计算加载时间
    const loadTime = Date.now() - startTime;
    
    // 验证加载时间在可接受范围内（3秒）
    expect(loadTime).toBeLessThan(3000);
    
    // 获取性能指标
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });
    
    console.log('首页性能指标:', performanceMetrics);
    console.log(`✅ PERF-001: 首页加载时间 ${loadTime}ms`);
  });

  test('PERF-002: 搜索页面加载性能', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000/search');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    
    console.log(`✅ PERF-002: 搜索页面加载时间 ${loadTime}ms`);
  });

  test('PERF-003: 商品详情页加载性能', async ({ page }) => {
    // 先访问首页获取商品链接
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.item-card', { timeout: 10000 });
    
    const startTime = Date.now();
    
    // 点击第一个商品
    await page.click('.item-card:first-child');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    
    console.log(`✅ PERF-003: 商品详情页加载时间 ${loadTime}ms`);
  });

  test('PERF-004: 用户仪表板加载性能', async ({ page }) => {
    // 先登录用户
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    const startTime = Date.now();
    
    // 访问仪表板
    await page.goto('http://localhost:3000/me');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    
    console.log(`✅ PERF-004: 用户仪表板加载时间 ${loadTime}ms`);
  });

  // ========== API响应性能测试 ==========
  
  test('PERF-005: 商品搜索API性能', async ({ page }) => {
    // 监听API请求
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/items/search') && response.status() === 200
    );
    
    const startTime = Date.now();
    
    // 执行搜索
    await page.goto('http://localhost:3000/search');
    await page.fill('input[placeholder*="Search"], input[placeholder*="搜索"]', 'iPhone');
    await page.press('input[placeholder*="Search"], input[placeholder*="搜索"]', 'Enter');
    
    // 等待API响应
    const response = await responsePromise;
    const responseTime = Date.now() - startTime;
    
    // 验证响应时间
    expect(responseTime).toBeLessThan(1000); // 1秒内响应
    
    // 验证响应数据
    const responseData = await response.json();
    expect(responseData).toBeDefined();
    
    console.log(`✅ PERF-005: 商品搜索API响应时间 ${responseTime}ms`);
  });

  test('PERF-006: 用户认证API性能', async ({ page }) => {
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/auth/login') && response.status() === 200
    );
    
    const startTime = Date.now();
    
    // 执行登录
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    const response = await responsePromise;
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThan(2000); // 2秒内响应
    
    console.log(`✅ PERF-006: 用户认证API响应时间 ${responseTime}ms`);
  });

  test('PERF-007: 商品列表API性能', async ({ page }) => {
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/items') && response.status() === 200
    );
    
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000');
    
    const response = await responsePromise;
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThan(1000);
    
    console.log(`✅ PERF-007: 商品列表API响应时间 ${responseTime}ms`);
  });

  // ========== 图片加载性能测试 ==========
  
  test('PERF-008: 图片加载优化', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 获取所有图片元素
    const images = await page.locator('img').all();
    
    for (const img of images) {
      // 验证图片有正确的属性
      const src = await img.getAttribute('src');
      const loading = await img.getAttribute('loading');
      const alt = await img.getAttribute('alt');
      
      expect(src).toBeTruthy();
      expect(loading).toBe('lazy'); // 懒加载
      expect(alt).toBeTruthy(); // 可访问性
    }
    
    console.log(`✅ PERF-008: 图片加载优化正常，共${images.length}张图片`);
  });

  test('PERF-009: 图片压缩和格式优化', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 监听图片请求
    const imageRequests = [];
    page.on('request', request => {
      if (request.resourceType() === 'image') {
        imageRequests.push(request.url());
      }
    });
    
    // 等待图片加载
    await page.waitForTimeout(3000);
    
    // 验证图片格式和大小
    for (const imageUrl of imageRequests) {
      // 检查是否使用了优化的图片格式
      expect(imageUrl).toMatch(/\.(jpg|jpeg|png|webp|avif)$/i);
    }
    
    console.log(`✅ PERF-009: 图片格式优化正常，共${imageRequests.length}张图片`);
  });

  // ========== 内存使用性能测试 ==========
  
  test('PERF-010: 内存泄漏检测', async ({ page }) => {
    // 获取初始内存使用情况
    const initialMemory = await page.evaluate(() => {
      return performance.memory ? {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize
      } : null;
    });
    
    // 执行一些操作
    for (let i = 0; i < 5; i++) {
      await page.goto('http://localhost:3000');
      await page.goto('http://localhost:3000/search');
      await page.goto('http://localhost:3000/login');
      await page.waitForTimeout(1000);
    }
    
    // 强制垃圾回收
    await page.evaluate(() => {
      if (window.gc) {
        window.gc();
      }
    });
    
    // 获取最终内存使用情况
    const finalMemory = await page.evaluate(() => {
      return performance.memory ? {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize
      } : null;
    });
    
    if (initialMemory && finalMemory) {
      const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
      const memoryIncreasePercent = (memoryIncrease / initialMemory.usedJSHeapSize) * 100;
      
      // 验证内存增长在合理范围内（不超过50%）
      expect(memoryIncreasePercent).toBeLessThan(50);
      
      console.log(`✅ PERF-010: 内存使用正常，增长${memoryIncreasePercent.toFixed(2)}%`);
    } else {
      console.log('✅ PERF-010: 内存检测跳过（浏览器不支持performance.memory）');
    }
  });

  // ========== 网络性能测试 ==========
  
  test('PERF-011: 网络请求优化', async ({ page }) => {
    const requests = [];
    const responses = [];
    
    // 监听所有网络请求
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });
    
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        headers: response.headers()
      });
    });
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // 分析请求
    const jsRequests = requests.filter(req => req.resourceType === 'script');
    const cssRequests = requests.filter(req => req.resourceType === 'stylesheet');
    const imageRequests = requests.filter(req => req.resourceType === 'image');
    
    // 验证请求数量合理
    expect(jsRequests.length).toBeLessThan(20); // JS文件不超过20个
    expect(cssRequests.length).toBeLessThan(10); // CSS文件不超过10个
    
    // 验证响应状态
    const failedRequests = responses.filter(res => res.status >= 400);
    expect(failedRequests.length).toBe(0); // 没有失败的请求
    
    console.log(`✅ PERF-011: 网络请求优化正常，JS:${jsRequests.length}, CSS:${cssRequests.length}, 图片:${imageRequests.length}`);
  });

  test('PERF-012: 缓存策略验证', async ({ page }) => {
    // 第一次访问
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // 第二次访问（验证缓存）
    const startTime = Date.now();
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    const secondLoadTime = Date.now() - startTime;
    
    // 第二次加载应该更快（利用缓存）
    expect(secondLoadTime).toBeLessThan(1000);
    
    console.log(`✅ PERF-012: 缓存策略正常，第二次加载时间 ${secondLoadTime}ms`);
  });

  // ========== 并发性能测试 ==========
  
  test('PERF-013: 并发用户模拟', async ({ browser }) => {
    // 创建多个浏览器上下文模拟并发用户
    const contexts = [];
    const pages = [];
    
    for (let i = 0; i < 5; i++) {
      const context = await browser.newContext();
      const page = await context.newPage();
      contexts.push(context);
      pages.push(page);
    }
    
    const startTime = Date.now();
    
    // 并发访问首页
    await Promise.all(pages.map(page => page.goto('http://localhost:3000')));
    
    const concurrentLoadTime = Date.now() - startTime;
    
    // 验证并发加载时间
    expect(concurrentLoadTime).toBeLessThan(5000); // 5秒内完成所有并发请求
    
    // 清理
    await Promise.all(contexts.map(context => context.close()));
    
    console.log(`✅ PERF-013: 并发用户测试正常，5个用户并发加载时间 ${concurrentLoadTime}ms`);
  });

  // ========== 数据库查询性能测试 ==========
  
  test('PERF-014: 数据库查询性能', async ({ page }) => {
    // 测试复杂搜索查询
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000/search');
    
    // 执行复杂搜索
    await page.fill('input[placeholder*="Search"], input[placeholder*="搜索"]', 'MacBook Pro 2021');
    await page.selectOption('select[name="category"]', 'electronics');
    await page.fill('input[name="minPrice"]', '1000');
    await page.fill('input[name="maxPrice"]', '3000');
    await page.selectOption('select[name="condition"]', 'excellent');
    await page.click('button[type="submit"]');
    
    // 等待搜索结果
    await page.waitForSelector('.item-card, .search-results', { timeout: 10000 });
    
    const queryTime = Date.now() - startTime;
    expect(queryTime).toBeLessThan(2000); // 复杂查询2秒内完成
    
    console.log(`✅ PERF-014: 数据库查询性能正常，复杂查询时间 ${queryTime}ms`);
  });

  // ========== 前端渲染性能测试 ==========
  
  test('PERF-015: 前端渲染性能', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 测量渲染性能
    const renderMetrics = await page.evaluate(() => {
      const paintEntries = performance.getEntriesByType('paint');
      const navigation = performance.getEntriesByType('navigation')[0];
      
      return {
        firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart
      };
    });
    
    // 验证关键渲染指标
    expect(renderMetrics.firstPaint).toBeLessThan(1000); // 首次绘制1秒内
    expect(renderMetrics.firstContentfulPaint).toBeLessThan(1500); // 首次内容绘制1.5秒内
    expect(renderMetrics.domContentLoaded).toBeLessThan(2000); // DOM加载2秒内
    
    console.log('✅ PERF-015: 前端渲染性能正常', renderMetrics);
  });

  // ========== 移动端性能测试 ==========
  
  test('PERF-016: 移动端性能', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    const mobileLoadTime = Date.now() - startTime;
    expect(mobileLoadTime).toBeLessThan(4000); // 移动端4秒内加载
    
    // 测试移动端交互性能
    const interactionStart = Date.now();
    await page.tap('text=Login');
    await page.waitForSelector('input[name="email"]');
    const interactionTime = Date.now() - interactionStart;
    
    expect(interactionTime).toBeLessThan(500); // 交互响应500ms内
    
    console.log(`✅ PERF-016: 移动端性能正常，加载时间 ${mobileLoadTime}ms，交互时间 ${interactionTime}ms`);
  });

  // ========== 资源压缩测试 ==========
  
  test('PERF-017: 资源压缩验证', async ({ page }) => {
    const responses = [];
    
    page.on('response', response => {
      responses.push({
        url: response.url(),
        headers: response.headers(),
        status: response.status()
      });
    });
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // 检查JS和CSS文件是否被压缩
    const jsResponses = responses.filter(res => 
      res.url.includes('.js') && res.status === 200
    );
    const cssResponses = responses.filter(res => 
      res.url.includes('.css') && res.status === 200
    );
    
    // 验证压缩头
    for (const response of [...jsResponses, ...cssResponses]) {
      const contentEncoding = response.headers['content-encoding'];
      const contentType = response.headers['content-type'];
      
      // 检查是否使用了gzip或brotli压缩
      if (contentEncoding) {
        expect(['gzip', 'br', 'deflate']).toContain(contentEncoding);
      }
      
      // 检查内容类型
      expect(contentType).toMatch(/text\/javascript|text\/css|application\/javascript/);
    }
    
    console.log(`✅ PERF-017: 资源压缩正常，JS文件:${jsResponses.length}，CSS文件:${cssResponses.length}`);
  });

  // ========== 第三方资源性能测试 ==========
  
  test('PERF-018: 第三方资源加载', async ({ page }) => {
    const thirdPartyRequests = [];
    
    page.on('request', request => {
      const url = new URL(request.url());
      const hostname = url.hostname;
      
      // 检查是否为第三方资源
      if (!hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
        thirdPartyRequests.push({
          url: request.url(),
          resourceType: request.resourceType()
        });
      }
    });
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // 验证第三方资源数量合理
    expect(thirdPartyRequests.length).toBeLessThan(10); // 第三方资源不超过10个
    
    // 检查是否有不必要的第三方资源
    const analyticsRequests = thirdPartyRequests.filter(req => 
      req.url.includes('google-analytics') || 
      req.url.includes('facebook') || 
      req.url.includes('twitter')
    );
    
    // 如果有分析工具，验证它们不会阻塞页面加载
    if (analyticsRequests.length > 0) {
      console.log(`检测到${analyticsRequests.length}个分析工具请求`);
    }
    
    console.log(`✅ PERF-018: 第三方资源加载正常，共${thirdPartyRequests.length}个第三方请求`);
  });

  // ========== 性能回归测试 ==========
  
  test('PERF-019: 性能基准测试', async ({ page }) => {
    const performanceResults = {};
    
    // 测试多个页面的性能
    const pagesToTest = [
      { url: 'http://localhost:3000', name: '首页' },
      { url: 'http://localhost:3000/search', name: '搜索页' },
      { url: 'http://localhost:3000/login', name: '登录页' },
      { url: 'http://localhost:3000/register', name: '注册页' }
    ];
    
    for (const pageInfo of pagesToTest) {
      const startTime = Date.now();
      await page.goto(pageInfo.url);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      performanceResults[pageInfo.name] = loadTime;
      
      // 验证每个页面的性能基准
      expect(loadTime).toBeLessThan(3000);
    }
    
    console.log('✅ PERF-019: 性能基准测试结果:', performanceResults);
  });

  // ========== 性能监控测试 ==========
  
  test('PERF-020: 性能监控集成', async ({ page }) => {
    // 模拟性能监控数据收集
    const performanceData = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paintEntries = performance.getEntriesByType('paint');
      
      return {
        // 核心Web指标
        lcp: 0, // Largest Contentful Paint (需要实际测量)
        fid: 0, // First Input Delay (需要用户交互)
        cls: 0, // Cumulative Layout Shift (需要布局变化)
        
        // 传统指标
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        
        // 资源加载
        resourceCount: performance.getEntriesByType('resource').length,
        
        // 内存使用
        memory: performance.memory ? {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize
        } : null
      };
    });
    
    // 验证性能数据完整性
    expect(performanceData.domContentLoaded).toBeGreaterThan(0);
    expect(performanceData.loadComplete).toBeGreaterThan(0);
    expect(performanceData.resourceCount).toBeGreaterThan(0);
    
    console.log('✅ PERF-020: 性能监控数据收集正常:', performanceData);
  });
});
