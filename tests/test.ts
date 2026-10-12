import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Welcome to Hamrah.com' })).toBeVisible();
});

test('Flow navigation renders and resizes the canvas without browser errors', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/');
	await page.getByRole('link', { name: 'Flow', exact: true }).click();
	await expect(page).toHaveURL(/\/flow$/);
	const canvas = page.locator('canvas');
	await expect(canvas).toBeVisible();
	await page.setViewportSize({ width: 800, height: 600 });
	await expect(canvas).toHaveAttribute('width', '800');
	await expect(canvas).toHaveAttribute('height', '600');
	expect(errors).toEqual([]);
});
