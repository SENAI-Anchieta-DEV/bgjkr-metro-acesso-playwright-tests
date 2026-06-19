import { expect } from '@playwright/test';

export class EntradaPage {
  constructor(page) {
    this.page = page;
    
    // Usando getByPlaceholder porque não há htmlFor nas labels do EntradaFormPage.jsx
    this.codigoEntradaInput = page.getByPlaceholder('Ex: 123321');
    this.bssidInput = page.getByPlaceholder('Ex: 26:0B:02:11:73:3F');
    this.salvarButton = page.getByRole('button', { name: /salvar entrada/i });
  }

  async acessarNovo(codigoEstacao) {
    // Ajuste esta rota conforme o configurado no seu react-router-dom
    await this.page.goto(`/estacoes/${codigoEstacao}/entradas/nova`);
    
    // Valida o carregamento da tela verificando o título
    await expect(this.page.locator('h2', { hasText: 'Nova Entrada' })).toBeVisible();
  }

  async preencherFormulario(entrada) {
    await this.codigoEntradaInput.fill(entrada.codigoEntrada);
    await this.bssidInput.fill(entrada.bssid);
  }

  async salvar() {
    // Intercepta a requisição POST (Criação) ou PUT (Atualização) para a API do backend
    const [response] = await Promise.all([
      this.page.waitForResponse((resp) =>
        resp.url().includes('/api/entrada') &&
        ['POST', 'PUT'].includes(resp.request().method()) // Agora aceita ambos os métodos HTTP
      ),
      this.salvarButton.click(),
    ]);

    // O EntradaController.java retorna 201 Created no POST e 200 OK no PUT
    expect([200, 201]).toContain(response.status());
  }

  async deveRedirecionarParaEstacoes() {
    // O seu EntradaFormPage.jsx faz navigate('/estacoes') no try do handleSubmit
    await expect(this.page).toHaveURL(/estacoes/);
  }
}