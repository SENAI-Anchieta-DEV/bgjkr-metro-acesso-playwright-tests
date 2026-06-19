import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';

test.describe('03 - Login inválido', () => {
  test('deve mostrar mensagem de erro ao informar credenciais inválidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Tenta fazer login com dados falsos
    await loginPage.login('invalido@metroacesso.com', 'senhaerrada123');
    
    // Valida se a mensagem de erro renderizou no DOM
    await loginPage.deveExibirErro();
    
    // Garante que o utilizador não saiu da página de login
    await loginPage.deveEstarNaTelaDeLogin();
  });
});