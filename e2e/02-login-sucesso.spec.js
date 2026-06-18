// e2e/02-login-sucesso.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { adminValido, agenteValido } = require('../fixtures/usuarios');

test.describe('Login com sucesso', () => {
  test('administrador consegue logar e é redirecionado para /admin/dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.acessar();
    await loginPage.login(adminValido.email, adminValido.senha);

    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test('agente de atendimento consegue logar e é redirecionado para /agente/dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.acessar();
    await loginPage.login(agenteValido.email, agenteValido.senha);

    await expect(page).toHaveURL(/\/agente\/dashboard/);
  });
});
