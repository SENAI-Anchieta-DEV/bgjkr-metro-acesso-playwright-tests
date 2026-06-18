// helpers/auth.js
const { LoginPage } = require('../pages/LoginPage');

/**
 * Faz login pela tela e espera o redirecionamento para a área correta.
 * @param {import('@playwright/test').Page} page
 * @param {{email: string, senha: string}} credenciais
 * @param {RegExp} urlEsperada - padrão de URL que confirma o login (ex: /\/admin/)
 */
async function fazerLogin(page, credenciais, urlEsperada) {
  const loginPage = new LoginPage(page);
  await loginPage.acessar();
  await loginPage.login(credenciais.email, credenciais.senha);
  await page.waitForURL(urlEsperada, { timeout: 10_000 });
}

async function loginComoAdmin(page, credenciais) {
  await fazerLogin(page, credenciais, /\/admin/);
}

async function loginComoAgente(page, credenciais) {
  await fazerLogin(page, credenciais, /\/agente/);
}

module.exports = { fazerLogin, loginComoAdmin, loginComoAgente };
