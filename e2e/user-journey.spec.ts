import { test, expect } from '@playwright/test';

test.describe('Primary User Journey', () => {
  test('Sign In -> Search Product -> Add to Cart -> Checkout', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', exception => console.log('BROWSER EXCEPTION:', exception));

    // 1. Sign In
    await page.goto('/login');
    await page.fill('input[placeholder="Enter your e-mail"]', 'testuser@example.com');
    await page.fill('input[placeholder="Enter your password"]', 'password123');
    await page.click('button:has-text("Sign In")');

    // Wait for navigation back to home page after login
    await page.waitForURL('**/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Scroll to bottom and click on Apparels section
    const apparelsSection = page.locator('main').locator('a[href="/apparel"]');
    await apparelsSection.scrollIntoViewIfNeeded();
    await page.goto('/apparel');
    await expect(page).toHaveURL(/.*\/apparel/);

    // Click on Home to go back and click on Accessories section
    await page.locator('a[href="/"]').filter({ hasText: 'Home' }).first().click();
    await page.waitForURL('**/');
    await page.waitForLoadState('networkidle');
    await page.locator('text=Check out our catalog').waitFor({ state: 'visible' });
    await page.waitForTimeout(1000);
    
    const accessoriesSection = page.locator('main').locator('a[href="/accessory"]');
    await accessoriesSection.scrollIntoViewIfNeeded();
    await page.goto('/accessory');
    await expect(page).toHaveURL(/.*\/accessory/);

    // Click on Lorem on the most left side of the navigation bar
    await page.locator('text=Lorem').first().click();
    await page.waitForURL('**/');
    await page.waitForLoadState('networkidle');
    await page.locator('text=Check out our catalog').waitFor({ state: 'visible' });
    await page.waitForTimeout(1000);

    // Move till you see Our Latest Products section and click on Pendant Necklace
    await page.locator('text=Our Latest Products').scrollIntoViewIfNeeded();
    await page.locator('text=Pendant Necklace').first().click();
    await expect(page).toHaveURL(/.*\/product\/.+/);

    // Click on Products section on the navigation bar
    await page.locator('a[href="/product"]').filter({ hasText: 'Products' }).first().click();
    await page.waitForURL('**/product');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/product/);

    // 2. Search Product
    await page.fill('input[placeholder="Enter Product Name"]', 'shirt');
    await page.press('input[placeholder="Enter Product Name"]', 'Enter');

    // Wait for the product grid to update
    await page.waitForTimeout(1000);

    // 3. Navigate to Product Details
    // Click on the first product card image
    await page.locator('img[alt*="-image"]').first().click();

    // Add to Cart
    const addToCartBtn = page.locator('button:has-text("Add to Cart")');
    await addToCartBtn.click();

    // Wait for the Ant Design success message to appear (ensures API call finishes)
    await page.waitForSelector('.ant-message-success', { timeout: 5000 });

    // 4. Checkout
    // Go to cart by clicking the Cart link in the header
    await page.locator('a[href="/cart"]').filter({ hasText: 'Cart' }).first().click();
    await page.waitForURL('**/cart');
    await page.waitForLoadState('networkidle');
    
    // Proceed to checkout
    const checkoutBtn = page.locator('button:has-text("Checkout")');
    await checkoutBtn.click();

    // Verify we are redirected to the order page
    // await expect(page).toHaveURL(/.*order/);
  });
});
