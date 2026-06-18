// e2e/03-login-invalido.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { credenciaisInvalidas } = require('../fixtures/usuarios');

test.describe('Login inválido', () => {
  test('não autentica com e-mail/senha incorretos e mostra mensagem de erro', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.acessar();
    await loginPage.login(credenciaisInvalidas.email, credenciaisInvalidas.senha);

    // Continua na tela de login (não foi redirecionado)
    await expect(page).toHaveURL(/\/login/);
    await expect(loginPage.mensagemErro).toBeVisible();
  });
});
