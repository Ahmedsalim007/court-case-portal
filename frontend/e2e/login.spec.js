import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('Clerk logs in and lands on cases page', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder(/enter your id/i).fill('200303');
    await page.getByPlaceholder(/enter your password/i).fill('@AhmedAsaad007');
    await page.getByRole('button', { name: /log in/i }).click();

    await expect(page).toHaveURL(/\/cases/);
  });

  test('shows an error on wrong password', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder(/enter your id/i).fill('200303');
    await page.getByPlaceholder(/enter your password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /log in/i }).click();

    await expect(page.getByText(/incorrect employee id or password/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Role-based access', () => {
  test('Clerk cannot reach the admin users page', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder(/enter your id/i).fill('200303');
    await page.getByPlaceholder(/enter your password/i).fill('@AhmedAsaad007');
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(page).toHaveURL(/\/cases/);

    await page.goto('/admin/users');

    await expect(page).not.toHaveURL(/\/admin\/users/);
  });

  test('Admin can reach the admin users page', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder(/enter your id/i).fill('000001');
    await page.getByPlaceholder(/enter your password/i).fill('ChangeMe123');
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(page).toHaveURL(/\/cases/);

    await page.goto('/admin/users');

    await expect(page).toHaveURL(/\/admin\/users/);
    await expect(page.getByRole('link', { name: /create user/i })).toBeVisible();
  });
});
