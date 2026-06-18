// fixtures/usuarios.js

// Usuários já existentes no sistema, usados para fazer login nos testes.
const adminValido = {
  email: process.env.ADMIN_EMAIL || 'admin@metroacesso.com',
  senha: process.env.ADMIN_SENHA || 'admin123',
};

const agenteValido = {
  email: process.env.AGENTE_EMAIL || 'junior@metroacesso.com',
  senha: process.env.AGENTE_SENHA || 'junior123',
};

const credenciaisInvalidas = {
  email: 'naoexiste@metroacesso.com',
  senha: 'senhaerrada123',
};

// Gera dados únicos a cada execução, para não colidir com testes anteriores
// (ex: não tentar cadastrar o mesmo e-mail duas vezes).
function gerarAdminTeste() {
  const sufixo = Date.now();
  return {
    nome: `Admin Playwright ${sufixo}`,
    email: `admin.playwright.${sufixo}@teste.com`,
    senha: 'TesteSenha123',
  };
}

function gerarAgenteTeste() {
  const sufixo = Date.now();
  return {
    nome: `Agente Playwright ${sufixo}`,
    email: `agente.playwright.${sufixo}@teste.com`,
    senha: 'TesteSenha123',
    inicioTurno: '08:00',
    fimTurno: '16:00',
    // codigoEstacao precisa ser preenchido com um código de estação que já exista
    // no sistema -- ver helpers/estacoes.js
  };
}

module.exports = {
  adminValido,
  agenteValido,
  credenciaisInvalidas,
  gerarAdminTeste,
  gerarAgenteTeste,
};
