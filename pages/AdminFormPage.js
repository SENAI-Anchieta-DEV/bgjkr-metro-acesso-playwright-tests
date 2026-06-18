// pages/AdminFormPage.js
const { expect } = require('@playwright/test');

class AdminFormPage {
  constructor(page) {
    this.page = page;

    // Este formulário usa <label htmlFor="nome">, <label htmlFor="email">,
    // <label htmlFor="senha">, então getByLabel funciona bem.
    this.campoNome = page.getByLabel('Nome Completo');
    this.campoEmail = page.getByLabel('E-mail Corporativo');
    // Em modo edição, o label muda de texto ("Nova Senha (deixe em branco para manter)"),
    // por isso usamos um regex que cobre os dois casos.
    this.campoSenha = page.getByLabel(/senha/i);

    this.botaoSalvar = page.locator('.btn-salvar');
    this.botaoCancelar = page.locator('.btn-cancelar');
    this.bannerErro = page.locator('.error-banner');
  }

  async preencher({ nome, email, senha }) {
    if (nome !== undefined) await this.campoNome.fill(nome);
    if (email !== undefined) await this.campoEmail.fill(email);
    if (senha !== undefined) await this.campoSenha.fill(senha);
  }

  // No modo edição, o formulário começa vazio e só é preenchido com os dados
  // antigos depois de uma chamada assíncrona à API (useEffect no componente).
  // Sem esperar isso, o fill() roda antes do React popular o campo, e o
  // valor digitado acaba sendo sobrescrito pelo dado antigo logo em seguida.
  // Por isso, antes de editar, esperamos o campo Nome deixar de estar vazio.
  async esperarCarregarDadosExistentes() {
    await expect(this.campoNome).not.toHaveValue('', { timeout: 10_000 });
  }

  async salvar() {
    // O app usa window.alert() para confirmar sucesso; precisamos aceitar esse
    // diálogo, senão a navegação para /usuarios fica travada esperando.
    this.page.once('dialog', dialog => dialog.accept());
    await this.botaoSalvar.click();
  }
}

module.exports = { AdminFormPage };
