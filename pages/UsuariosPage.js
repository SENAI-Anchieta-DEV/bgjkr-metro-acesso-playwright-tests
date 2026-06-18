// pages/UsuariosPage.js

class UsuariosPage {
  constructor(page) {
    this.page = page;

    this.botaoAdicionarUsuario = page.getByRole('button', { name: /adicionar usuário/i });

    // Modal que aparece ao clicar em "Adicionar Usuário", com 3 opções de perfil
    this.opcaoAdministrador = page.locator('.modal-option.admin');
    this.opcaoAgente = page.locator('.modal-option.agente');

    this.tabela = page.locator('table.usuarios-table');
    this.linhasTabela = page.locator('table.usuarios-table tbody tr');
  }

  async acessar() {
    await this.page.goto('/usuarios');
  }

  async abrirNovoAdministrador() {
    await this.botaoAdicionarUsuario.click();
    await this.opcaoAdministrador.click();
  }

  async abrirNovoAgente() {
    await this.botaoAdicionarUsuario.click();
    await this.opcaoAgente.click();
  }

  // Localiza a linha da tabela que contém o e-mail informado
  linhaDoUsuario(email) {
    return this.page.locator('table.usuarios-table tbody tr', { hasText: email });
  }

  async editarUsuario(email) {
    await this.linhaDoUsuario(email).locator('.btn-edit').click();
  }

  async removerUsuario(email) {
    // O app usa window.confirm() nativo do navegador ao remover; é preciso
    // "escutar" esse diálogo e aceitar, senão o teste trava esperando ele.
    this.page.once('dialog', dialog => dialog.accept());
    await this.linhaDoUsuario(email).locator('.btn-delete').click();
  }
}

module.exports = { UsuariosPage };
