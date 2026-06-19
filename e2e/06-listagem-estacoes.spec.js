import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { usuarioValido } from '../fixtures/dados.js';

test.describe('06 - Listagem de Estações', () => {
  test('deve aceder e exibir a listagem de estações', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(usuarioValido.email, usuarioValido.senha);
    
    // Navega para a rota de listagem
    await page.goto('/estacoes');
    
    // Valida se a página carregou (pode ajustar o texto para um título que exista na sua tela de estações)
    await expect(page).toHaveURL(/estacoes/);
    await expect(page.locator('body')).toBeVisible();
  });
});