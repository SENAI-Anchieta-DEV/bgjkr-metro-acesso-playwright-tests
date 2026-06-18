// e2e/07-pendencias-agente.spec.js
const { test, expect } = require('@playwright/test');
const { loginComoAgente } = require('../helpers/auth');
const { PendenciasPage } = require('../pages/PendenciasPage');
const { agenteValido } = require('../fixtures/usuarios');

test.describe('Pendências - Agente de Atendimento', () => {
  test.beforeEach(async ({ page }) => {
    await loginComoAgente(page, agenteValido);
  });

  test('a tela de pendências carrega e exibe a lista (ou estado vazio)', async ({ page }) => {
    const pendenciasPage = new PendenciasPage(page);
    await pendenciasPage.acessar();

    await expect(page.getByRole('heading', { name: /pendências de atendimento/i })).toBeVisible();
  });

  test('agente consegue confirmar (concluir) uma pendência, removendo-a da lista', async ({ page }) => {
    const pendenciasPage = new PendenciasPage(page);
    await pendenciasPage.acessar();

    const totalAntes = await pendenciasPage.totalDePendencias();

    // Este teste só faz sentido se houver ao menos uma pendência no momento da execução.
    // Pendências dependem de validações feitas via app/totem, então não são criadas
    // pelo próprio teste -- ver observação no README sobre massa de dados.
    test.skip(totalAntes === 0, 'Não há pendências disponíveis para testar a confirmação.');

    await pendenciasPage.confirmarPrimeiraPendencia();

    const totalDepois = await pendenciasPage.totalDePendencias();
    expect(totalDepois).toBe(totalAntes - 1);
  });
});
