const { test, expect } = require('@playwright/test');

test.describe('Frontend Basic Functionality', () => {
  
  test('should load homepage and display basic elements', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check if the page loads
    await expect(page).toHaveTitle(/Kiwi Market/);
    
    // Check if navigation elements are present
    await expect(page.locator('nav').getByText('Kiwi Market').first()).toBeVisible();
    await expect(page.locator('text=Login')).toBeVisible();
    await expect(page.locator('text=Register')).toBeVisible();
    
    console.log('✅ Homepage loaded successfully with navigation elements');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Click on login button
    await page.click('text=Login');
    
    // Check if we're on login page
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('text=Sign in to your account')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    
    console.log('✅ Login page loaded successfully');
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Click on register button
    await page.click('text=Register');
    
    // Check if we're on register page
    await expect(page).toHaveURL(/.*\/register/);
    await expect(page.locator('text=Create your account')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="displayName"]')).toBeVisible();
    
    console.log('✅ Register page loaded successfully');
  });

  test('should test language switching', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check initial language (should be English)
    await expect(page.locator('text=Login')).toBeVisible();
    
    // Click language switcher
    await page.click('text=EN');
    
    // Check if language switched to Chinese
    await expect(page.locator('text=登录')).toBeVisible();
    await expect(page.locator('text=注册')).toBeVisible();
    
    // Switch back to English
    await page.click('text=中文');
    await expect(page.locator('text=Login')).toBeVisible();
    
    console.log('✅ Language switching works correctly');
  });

  test('should test search functionality', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Find search input and type something
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('test item');
    
    // Press Enter to search
    await searchInput.press('Enter');
    
    // Check if we're on search page
    await expect(page).toHaveURL(/.*\/search/);
    
    console.log('✅ Search functionality works');
  });
});
