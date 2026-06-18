// e2e/04-rota-protegida.spec.js
const { test, expect } = require('@playwright/test');
const { loginComoAgente } = require('../helpers/auth');
const { agenteValido } = require('../fixtures/usuarios');
const { routes } = require('../helpers/routes');

test.describe('Proteção de rotas', () => {
  test('acessar /usuarios sem estar logado redireciona para o login', async ({ page }) => {
    await page.goto(routes.usuarios);
    await expect(page).toHaveURL(/\/login/);
  });

  test('agente não consegue acessar área exclusiva de administrador', async ({ page }) => {
    await loginComoAgente(page, agenteValido);

    // Agente autenticado tentando acessar uma rota exclusiva de ADMINISTRADOR.
    // O ProtectedRoute redireciona quem não tem a role exigida para /dashboard,
    // que por sua vez redireciona o agente para /agente/dashboard.
    await page.goto(routes.usuarios);

    await expect(page).toHaveURL(/\/agente\/dashboard/);
    await expect(page.getByRole('heading', { name: /gestão de usuários/i })).not.toBeVisible();
  });
});
