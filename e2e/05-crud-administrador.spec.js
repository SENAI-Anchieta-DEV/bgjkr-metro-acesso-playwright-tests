// e2e/05-crud-administrador.spec.js
const { test, expect } = require('@playwright/test');
const { loginComoAdmin } = require('../helpers/auth');
const { UsuariosPage } = require('../pages/UsuariosPage');
const { AdminFormPage } = require('../pages/AdminFormPage');
const { adminValido, gerarAdminTeste } = require('../fixtures/usuarios');
const { routes } = require('../helpers/routes');

test.describe('CRUD - Administrador', () => {
  // Cada teste loga novamente como admin antes de começar.
  test.beforeEach(async ({ page }) => {
    await loginComoAdmin(page, adminValido);
  });

  test('fluxo completo: criar, ler, atualizar e remover um administrador', async ({ page }) => {
    const usuariosPage = new UsuariosPage(page);
    const adminFormPage = new AdminFormPage(page);
    const novoAdmin = gerarAdminTeste();

    // ----- CREATE -----
    await usuariosPage.acessar();
    await usuariosPage.abrirNovoAdministrador();
    await expect(page).toHaveURL(new RegExp(routes.novoAdmin));

    await adminFormPage.preencher({
      nome: novoAdmin.nome,
      email: novoAdmin.email,
      senha: novoAdmin.senha,
    });
    await adminFormPage.salvar();

    // Após salvar, o sistema volta para a listagem
    await expect(page).toHaveURL(new RegExp(routes.usuarios));

    // ----- READ -----
    // Confirma que o novo administrador aparece na tabela
    await expect(usuariosPage.linhaDoUsuario(novoAdmin.email)).toBeVisible();
    await expect(usuariosPage.linhaDoUsuario(novoAdmin.email)).toContainText('Administrador');

    // ----- UPDATE -----
    const nomeAtualizado = `${novoAdmin.nome} (Editado)`;
    await usuariosPage.editarUsuario(novoAdmin.email);
    await expect(page).toHaveURL(new RegExp(`editar-admin`));

    // Espera o formulário carregar os dados antigos do admin antes de
    // preencher o novo nome (ver explicação em AdminFormPage.js).
    await adminFormPage.esperarCarregarDadosExistentes();

    await adminFormPage.preencher({ nome: nomeAtualizado });
    await adminFormPage.salvar();

    await expect(page).toHaveURL(new RegExp(routes.usuarios));
    await expect(usuariosPage.linhaDoUsuario(novoAdmin.email)).toContainText(nomeAtualizado);

    // ----- DELETE -----
    await usuariosPage.removerUsuario(novoAdmin.email);

    // A linha do usuário removido não deve mais existir na tabela
    await expect(usuariosPage.linhaDoUsuario(novoAdmin.email)).toHaveCount(0);
  });
});
