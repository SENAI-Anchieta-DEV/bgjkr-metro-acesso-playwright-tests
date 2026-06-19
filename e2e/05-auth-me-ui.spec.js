import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { usuarioValido } from '../fixtures/dados.js';

test.describe('05 - Usuário autenticado na interface', () => {
  test('deve carregar a área do dashboard após o login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(usuarioValido.email, usuarioValido.senha);
    
    // Garante que o URL mudou para o dashboard e o utilizador não é expulso
    await loginPage.deveEstarNoDashboard();
    await expect(page.locator('body')).toBeVisible();
  });
});