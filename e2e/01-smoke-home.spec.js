// e2e/01-smoke-home.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Smoke - aplicação carrega', () => {
  test('a landing page carrega corretamente', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/MetroAcesso/i);
  });

  test('a tela de login carrega corretamente', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
  });
});
