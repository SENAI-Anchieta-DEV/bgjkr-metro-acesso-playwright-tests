import { expect } from '@playwright/test';

export class EstacoesPage {
  constructor(page) {
    this.page = page;
  }

  async acessar() {
    await this.page.goto('/estacoes');
    await expect(this.page.locator('h2', { hasText: 'Gestão de Estações' })).toBeVisible();
  }

  async expandirEstacao(codigoEstacao) {
    // Encontra a linha da tabela que corresponde à estação e clica nela para expandir
    const linhaEstacao = this.page.locator('tr', { hasText: codigoEstacao }).first();
    await linhaEstacao.click();
    
    // Valida se o painel interno com as entradas abriu corretamente
    await expect(this.page.locator('h4', { hasText: '🚪 Entradas' })).toBeVisible();
  }

  async clicarEditarEntrada(codigoEntrada) {
    // Encontra a <li> específica que contém o código da entrada
    const itemEntrada = this.page.locator('li', { hasText: codigoEntrada });
    
    // Clica no botão de edição com base no título de acessibilidade
    await itemEntrada.locator('button[title="Editar entrada"]').click();
  }

  async excluirEntrada(codigoEntrada) {
    // SUPERPODER DO PLAYWRIGHT: Aceita automaticamente o window.confirm() que vai aparecer na tela
    this.page.once('dialog', dialog => dialog.accept());
    
    const itemEntrada = this.page.locator('li', { hasText: codigoEntrada });
    
    // Clica no botão e valida se o backend retornou 204 No Content para o DELETE
    const [response] = await Promise.all([
      this.page.waitForResponse(resp => resp.url().includes('/api/entrada') && resp.request().method() === 'DELETE'),
      itemEntrada.locator('button[title="Remover entrada"]').click()
    ]);
    
    expect(response.status()).toBe(204); 
  }

  async deveNaoExibirEntrada(codigoEntrada) {
    // Garante que o elemento desapareceu da tela após a exclusão
    await expect(this.page.locator('li', { hasText: codigoEntrada })).toBeHidden();
  }
}