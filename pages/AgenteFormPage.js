// pages/AgenteFormPage.js
const { expect } = require('@playwright/test');

class AgenteFormPage {
  constructor(page) {
    this.page = page;

    // ATENÇÃO: neste formulário os <label> não têm o atributo "htmlFor",
    // então getByLabel não funciona. Usamos o atributo "name" dos campos.
    this.campoNome = page.locator('input[name="nome"]');
    this.campoEmail = page.locator('input[name="email"]');
    this.campoSenha = page.locator('input[name="senha"]');
    this.campoInicioTurno = page.locator('input[name="inicioTurno"]');
    this.campoFimTurno = page.locator('input[name="fimTurno"]');
    this.selectEstacao = page.locator('select[name="codigoEstacao"]');

    this.botaoSalvar = page.locator('.btn-salvar');
    this.botaoCancelar = page.locator('.btn-cancelar');
    this.bannerErro = page.locator('.error-banner');
  }

  async preencher({ nome, email, senha, inicioTurno, fimTurno }) {
    if (nome !== undefined) await this.campoNome.fill(nome);
    if (email !== undefined) await this.campoEmail.fill(email);
    if (senha !== undefined) await this.campoSenha.fill(senha);
    if (inicioTurno !== undefined) await this.campoInicioTurno.fill(inicioTurno);
    if (fimTurno !== undefined) await this.campoFimTurno.fill(fimTurno);
  }

  // Mesmo problema do AdminFormPage: no modo edição, o formulário começa
  // vazio e só é preenchido com os dados antigos após uma chamada assíncrona
  // à API. É preciso esperar isso terminar antes de preencher novos valores,
  // senão o React sobrescreve o que acabamos de digitar.
  async esperarCarregarDadosExistentes() {
    await expect(this.campoNome).not.toHaveValue('', { timeout: 10_000 });
  }

  // Seleciona a primeira estação disponível na lista (ignora a opção em
  // branco "Selecione uma estação..." / "Não alterar estação").
  async selecionarPrimeiraEstacaoDisponivel() {
    const opcoes = this.selectEstacao.locator('option');
    const total = await opcoes.count();
    for (let i = 0; i < total; i++) {
      const valor = await opcoes.nth(i).getAttribute('value');
      if (valor) {
        await this.selectEstacao.selectOption(valor);
        return valor;
      }
    }
    throw new Error('Nenhuma estação disponível no select. Cadastre uma estação antes de rodar este teste.');
  }

  async salvar() {
    this.page.once('dialog', dialog => dialog.accept());
    await this.botaoSalvar.click();
  }
}

module.exports = { AgenteFormPage };
