import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { EstacoesPage } from '../pages/EstacoesPage.js';
import { EntradaPage } from '../pages/EntradaPage.js';
import { usuarioValido, gerarEntradaAleatoria } from '../fixtures/dados.js';

test.describe('11 - Excluir Entrada', () => {
  test('deve remover uma entrada e confirmar a exclusão visual', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const estacoesPage = new EstacoesPage(page);
    const entradaPage = new EntradaPage(page);
    const entradaParaExcluir = gerarEntradaAleatoria();

    // 1. Prepara o cenário criando um dado
    await loginPage.login(usuarioValido.email, usuarioValido.senha);
    await entradaPage.acessarNovo(entradaParaExcluir.codigoEstacao);
    await entradaPage.preencherFormulario(entradaParaExcluir);
    await entradaPage.salvar();

    // 2. Na tela de Estações, expande a linha
    await estacoesPage.expandirEstacao(entradaParaExcluir.codigoEstacao);

    // 3. Aciona a exclusão (que aprova o window.confirm e valida o DELETE 204 automaticamente)
    await estacoesPage.excluirEntrada(entradaParaExcluir.codigoEntrada);

    // 4. Valida que o código da entrada sumiu da interface
    await estacoesPage.deveNaoExibirEntrada(entradaParaExcluir.codigoEntrada);
  });
});