import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { EntradaPage } from '../pages/EntradaPage.js';
import { usuarioValido, gerarEntradaAleatoria } from '../fixtures/dados.js';

test.describe('07 - Cadastro de Entrada', () => {
  test('deve cadastrar uma entrada (MAC Address/BSSID) numa estação', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(usuarioValido.email, usuarioValido.senha);

    const entradaPage = new EntradaPage(page);
    const entradaMock = gerarEntradaAleatoria();

    await entradaPage.acessarNovo(entradaMock.codigoEstacao);
    await entradaPage.preencherFormulario(entradaMock);
    await entradaPage.salvar();
    
    // Verifica se voltou à listagem de estações como manda o componente React
    await entradaPage.deveRedirecionarParaEstacoes();
  });
});