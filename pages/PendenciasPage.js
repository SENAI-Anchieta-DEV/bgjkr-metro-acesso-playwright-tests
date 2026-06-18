// pages/PendenciasPage.js
const { expect } = require('@playwright/test');

class PendenciasPage {
  constructor(page) {
    this.page = page;

    this.tabela = page.locator('table.admin-table');
    this.linhasTabela = page.locator('table.admin-table tbody tr');
  }

  async acessar() {
    await this.page.goto('/agente/pendencias');
  }

  async totalDePendencias() {
    // Enquanto loading === true, a página mostra só "Carregando pendências...",
    // sem nenhuma tabela no DOM. Contar linhas nesse momento sempre dá 0,
    // mesmo que existam pendências -- por isso esperamos esse estado sumir antes.
    await this.page.getByText('Carregando pendências...').waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});

    // Quando a lista está vazia, existe uma única linha "Nenhuma pendência encontrada."
    // Por isso verificamos o texto antes de contar.
    const vazio = await this.page.getByText('Nenhuma pendência encontrada.').isVisible().catch(() => false);
    if (vazio) return 0;
    return this.linhasTabela.count();
  }

  // Confirma (conclui) a primeira pendência da lista
  async confirmarPrimeiraPendencia() {
    // Guardamos um identificador da pendência (nome do passageiro) ANTES de
    // clicar. Não dá pra esperar "a primeira linha sumir", porque a primeira
    // posição da tabela é reocupada pela linha "Nenhuma pendência encontrada."
    // assim que a lista esvazia -- o locator genérico nunca fica "detached".
    const nomePassageiro = await this.linhasTabela.first().locator('td').first().innerText();

    this.page.once('dialog', dialog => dialog.accept());
    await this.linhasTabela.first().locator('.btn-approve').click();

    // Espera o texto daquele passageiro específico sumir da tabela.
    await expect(this.page.locator('table.admin-table').getByText(nomePassageiro, { exact: true }))
      .toHaveCount(0, { timeout: 15_000 });
  }
}

module.exports = { PendenciasPage };
