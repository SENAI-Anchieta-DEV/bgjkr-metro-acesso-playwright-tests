// e2e/06-crud-agente.spec.js
const { test, expect } = require('@playwright/test');
const { loginComoAdmin } = require('../helpers/auth');
const { UsuariosPage } = require('../pages/UsuariosPage');
const { AgenteFormPage } = require('../pages/AgenteFormPage');
const { adminValido, gerarAgenteTeste } = require('../fixtures/usuarios');
const { routes } = require('../helpers/routes');

test.describe('CRUD - Agente de Atendimento', () => {
  test.beforeEach(async ({ page }) => {
    await loginComoAdmin(page, adminValido);
  });

  test('fluxo completo: criar, ler, atualizar e remover um agente', async ({ page }) => {
    const usuariosPage = new UsuariosPage(page);
    const agenteFormPage = new AgenteFormPage(page);
    const novoAgente = gerarAgenteTeste();

    // ----- CREATE -----
    await usuariosPage.acessar();
    await usuariosPage.abrirNovoAgente();
    await expect(page).toHaveURL(new RegExp(routes.novoAgente));

    await agenteFormPage.preencher({
      nome: novoAgente.nome,
      email: novoAgente.email,
      senha: novoAgente.senha,
      inicioTurno: novoAgente.inicioTurno,
      fimTurno: novoAgente.fimTurno,
    });
    // O sistema exige vincular o agente a uma estação já existente.
    await agenteFormPage.selecionarPrimeiraEstacaoDisponivel();
    await agenteFormPage.salvar();

    await expect(page).toHaveURL(new RegExp(routes.usuarios));

    // ----- READ -----
    await expect(usuariosPage.linhaDoUsuario(novoAgente.email)).toBeVisible();
    await expect(usuariosPage.linhaDoUsuario(novoAgente.email)).toContainText('Agente');

    // ----- UPDATE -----
    const nomeAtualizado = `${novoAgente.nome} (Editado)`;
    await usuariosPage.editarUsuario(novoAgente.email);
    await expect(page).toHaveURL(new RegExp('editar-agente'));

    // Espera o formulário carregar os dados antigos do agente antes de
    // preencher o novo nome (ver explicação em AgenteFormPage.js).
    await agenteFormPage.esperarCarregarDadosExistentes();

    await agenteFormPage.preencher({ nome: nomeAtualizado });
    await agenteFormPage.salvar();

    await expect(page).toHaveURL(new RegExp(routes.usuarios));
    await expect(usuariosPage.linhaDoUsuario(novoAgente.email)).toContainText(nomeAtualizado);

    // ----- DELETE -----
    await usuariosPage.removerUsuario(novoAgente.email);
    await expect(usuariosPage.linhaDoUsuario(novoAgente.email)).toHaveCount(0);
  });

  test('não permite cadastrar agente sem selecionar uma estação', async ({ page }) => {
    const usuariosPage = new UsuariosPage(page);
    const agenteFormPage = new AgenteFormPage(page);
    const novoAgente = gerarAgenteTeste();

    await usuariosPage.acessar();
    await usuariosPage.abrirNovoAgente();

    await agenteFormPage.preencher({
      nome: novoAgente.nome,
      email: novoAgente.email,
      senha: novoAgente.senha,
      inicioTurno: novoAgente.inicioTurno,
      fimTurno: novoAgente.fimTurno,
    });
    // Propositalmente NÃO seleciona estação

    await agenteFormPage.botaoSalvar.click();

    // O formulário não deve navegar para a listagem; o backend deve recusar
    // o cadastro sem uma estação válida.
    await expect(page).not.toHaveURL(new RegExp(`${routes.usuarios}$`));
  });
});
