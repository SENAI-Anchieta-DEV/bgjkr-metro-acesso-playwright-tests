import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { EstacoesPage } from '../pages/EstacoesPage.js';
import { EntradaPage } from '../pages/EntradaPage.js';
import { usuarioValido, gerarEntradaAleatoria } from '../fixtures/dados.js';

test.describe('10 - Editar Entrada', () => {
  // Para este teste ser robusto, criamos uma entrada e logo a seguir editamo-la
  test('deve editar o BSSID de uma entrada existente com sucesso', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const estacoesPage = new EstacoesPage(page);
    const entradaPage = new EntradaPage(page);
    const entradaMock = gerarEntradaAleatoria();

    // 1. Login
    await loginPage.login(usuarioValido.email, usuarioValido.senha);
    
    // 2. Criar uma entrada nova para garantir que existe dados para editar
    await entradaPage.acessarNovo(entradaMock.codigoEstacao);
    await entradaPage.preencherFormulario(entradaMock);
    await entradaPage.salvar();

    // 3. O React volta para a listagem. Vamos expandir a estação e clicar em Editar
    await estacoesPage.expandirEstacao(entradaMock.codigoEstacao);
    await estacoesPage.clicarEditarEntrada(entradaMock.codigoEntrada);

    // 4. Valida se o título mudou para "Editar Entrada" conforme a lógica do frontend
    await expect(page.locator('h2', { hasText: 'Editar Entrada' })).toBeVisible();

    await expect(page.getByPlaceholder('Ex: 123321')).toHaveValue(entradaMock.codigoEntrada);

    // 5. Gera um BSSID totalmente novo e único no momento da execução
    const novoBssidUnico = gerarEntradaAleatoria().bssid; 
    
    // Preenche o input com o BSSID novo gerado (e NÃO com a string fixa '26:0B...')
    await page.getByPlaceholder('Ex: 26:0B:02:11:73:3F').fill(novoBssidUnico);
    
    // Clica em salvar
    await entradaPage.salvar();
  });
});