import { test, expect } from '@playwright/test';

test.describe('09 - Responsividade', () => {
  test('deve carregar login corretamente no formato mobile', async ({ page }) => {
    // Simula o ecrã de um telemóvel
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/login'); // Ou '/' dependendo de onde fica o seu LoginPage.jsx
    
    // Valida se o botão de entrar está visível no ecrã pequeno
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
  });
});