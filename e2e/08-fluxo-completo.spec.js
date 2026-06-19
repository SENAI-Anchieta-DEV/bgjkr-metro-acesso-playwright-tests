import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { EntradaPage } from '../pages/EntradaPage.js';
import { usuarioValido, gerarEntradaAleatoria } from '../fixtures/dados.js';

test.describe('08 - Fluxo completo de Gestão de Entradas', () => {
  test('deve realizar login, cadastrar um ponto de entrada com sucesso e retornar à listagem', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const entradaPage = new EntradaPage(page);
    
    // 1. Instancia uma massa de dados única para evitar duplicidade de chaves no banco de dados
    const novaEntrada = gerarEntradaAleatoria();

    // 2. Executa o fluxo de autenticação (disparando internamente a validação do AuthController)
    await loginPage.login(usuarioValido.email, usuarioValido.senha);
    await loginPage.deveEstarNoDashboard(); // Garante o redirecionamento inicial pós-login

    // 3. Navega de forma direcionada ao formulário de inclusão contendo o parâmetro da estação alvo
    await entradaPage.acessarNovo(novaEntrada.codigoEstacao);

    // 4. Preenche os campos de input do formulário mapeados por placeholder (Código e BSSID do roteador)
    await entradaPage.preencherFormulario(novaEntrada);

    // 5. Aciona o botão de salvar, monitorando e assegurando o status 201 (Created) retornado pela API
    await entradaPage.salvar();

    // 6. Confirma se o hook de navegação do React redirecionou o usuário de volta para a rota esperada
    await entradaPage.deveRedirecionarParaEstacoes();
  });
});