import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;
    // Seletores mapeados do LoginPage.jsx usando o htmlFor/id explícito
    this.emailInput = page.getByLabel('E-mail');
    this.senhaInput = page.getByLabel('Senha');
    this.entrarButton = page.getByRole('button', { name: /entrar/i });
  }

  async acessar() { 
    // Rota padrão assumida para o login no React
    await this.page.goto('/login'); 
  }

  async login(email, senha) {
    await this.acessar();
    await this.emailInput.fill(email);
    await this.senhaInput.fill(senha);
    await this.entrarButton.click();
  }

  async deveEstarNoDashboard() { 
    // O seu LoginPage.jsx faz navigate('/dashboard') após o sucesso
    await expect(this.page).toHaveURL(/dashboard/); 
  }

  async deveExibirErro() {
    // Mapeamento da div de erro: <div className="erro-mensagem">
    const mensagemErro = this.page.locator('.erro-mensagem');
    await expect(mensagemErro).toBeVisible();
  }

  async deveEstarNaTelaDeLogin() {
    // Garante que o usuário não foi redirecionado para o dashboard
    await expect(this.page).toHaveURL(/login/);
  }

}