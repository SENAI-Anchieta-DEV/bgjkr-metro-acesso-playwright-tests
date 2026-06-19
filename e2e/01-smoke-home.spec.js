import { test, expect } from '@playwright/test';

test.describe('01 - Smoke da aplicação', () => {
  test('deve carregar a página inicial de login', async ({ page }) => {
    await page.goto('/login'); // Ou '/' dependendo de como configurou a raiz
    
    // Valida o <h2> presente no seu LoginPage.jsx
    await expect(page.locator('h2', { hasText: 'Acesso o Sistema' })).toBeVisible(); 
    
    // Valida o parágrafo de subtítulo
    await expect(page.getByText('MetroAcesso — Autonomia Acessível')).toBeVisible();
  });
});