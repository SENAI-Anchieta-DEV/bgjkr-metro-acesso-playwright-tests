import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { usuarioValido } from '../fixtures/dados.js';

test.describe('02 - Login com sucesso', () => {
  test('deve autenticar com utilizador válido e aceder ao dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Executa o login usando os dados da fixture
    await loginPage.login(usuarioValido.email, usuarioValido.senha);
    
    // Valida se o React Router redirecionou para o Dashboard
    await loginPage.deveEstarNoDashboard();
  });
});