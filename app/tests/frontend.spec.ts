import { test, expect } from '@playwright/test';

test('Noisy Byte Front End Tests', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page).toHaveTitle(/noisy byte/);
  await page.waitForTimeout(5000);
});

test('Basic To Do Functions', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill('test');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('test');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByPlaceholder('Add a new task...').click();
  await page.getByPlaceholder('Add a new task...').fill('welcome home to playwrite');
  await page.getByRole('button', { name: 'Add' }).click();
  // await page.getByRole('checkbox').check();
  // await page.getByRole('checkbox').uncheck();
  await page.getByRole('button').nth(3).click();
  await page.getByRole('button').first().click();
  await page.getByRole('button', { name: 'Back to Studio' }).click();
  await page.getByRole('navigation').locator('div').getByRole('button').click();
  await page.getByRole('button', { name: 'Soundboard' }).click();
  await page.getByRole('navigation').locator('div').getByRole('button').click();
  await page.getByRole('button', { name: 'Logout' }).click();
});

