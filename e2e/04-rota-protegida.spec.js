import { test, expect } from '@playwright/test';

test.describe('04 - Rota protegida', () => {
  test('deve redirecionar para o login ao tentar aceder ao dashboard diretamente', async ({ page }) => {
    // Tenta aceder a uma rota protegida à força
    await page.goto('/dashboard');
    
    // Se o seu useAuth() estiver bem configurado, ele deve expulsar o utilizador de volta para a raiz ou /login
    await expect(page).not.toHaveURL(/dashboard/);
  });
});