// pages/LoginPage.js

class LoginPage {
  constructor(page) {
    this.page = page;

    // No código-fonte, os campos têm <label htmlFor="email"> e <label htmlFor="senha">,
    // então getByLabel funciona perfeitamente aqui.
    this.campoEmail = page.getByLabel('E-mail');
    this.campoSenha = page.getByLabel('Senha');
    this.botaoEntrar = page.getByRole('button', { name: /entrar/i });

    // Mensagem de erro de login (div.erro-mensagem no código-fonte)
    this.mensagemErro = page.locator('.erro-mensagem');
  }

  async acessar() {
    await this.page.goto('/login');
  }

  async login(email, senha) {
    await this.campoEmail.fill(email);
    await this.campoSenha.fill(senha);
    await this.botaoEntrar.click();
  }
}

module.exports = { LoginPage };
