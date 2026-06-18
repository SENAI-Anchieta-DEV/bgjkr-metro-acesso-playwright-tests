// helpers/routes.js

// Centraliza as rotas do sistema. Se uma URL mudar no futuro, só precisa
// atualizar aqui em vez de procurar em cada arquivo de teste.
const routes = {
  login: '/login',

  adminDashboard: '/admin/dashboard',
  usuarios: '/usuarios',
  novoAdmin: '/usuarios/novo-admin',
  novoAgente: '/usuarios/novo-agente',
  editarAdmin: (email) => `/usuarios/editar-admin/${encodeURIComponent(email)}`,
  editarAgente: (email) => `/usuarios/editar-agente/${encodeURIComponent(email)}`,
  estacoes: '/estacoes',
  tags: '/tags',
  validacoes: '/validacoes',

  agenteDashboard: '/agente/dashboard',
  agentePendencias: '/agente/pendencias',
};

module.exports = { routes };
