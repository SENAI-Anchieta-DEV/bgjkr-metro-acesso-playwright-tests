# Testes E2E (Playwright) - MetroAcesso

Testes automatizados de ponta a ponta (E2E) para o frontend do MetroAcesso, focados no **CRUD de Administrador e Agente de Atendimento**.

---

## 1. O que é Playwright?

Uma ferramenta que abre um navegador de verdade (Chrome, no nosso caso) e simula um usuário usando o sistema: digitar, clicar, navegar. Em vez de testar manualmente toda vez, escrevemos o roteiro uma vez em código e ele roda sozinho.

## 2. O que é um teste E2E?

E2E = "End-to-End" (ponta a ponta). Testa o fluxo completo:

```
navegador → frontend → backend/API → banco de dados → resposta na tela
```

Exemplo real deste projeto: logar como admin → abrir Usuários → cadastrar um agente → ver ele aparecer na lista → editar → ver a mudança → remover → ver que sumiu.

---

## 3. Estrutura do projeto

```
metro-acesso-playwright-tests/
├── README.md
├── package.json
├── playwright.config.js
├── e2e/                          # os testes em si
│   ├── 01-smoke-home.spec.js
│   ├── 02-login-sucesso.spec.js
│   ├── 03-login-invalido.spec.js
│   ├── 04-rota-protegida.spec.js
│   ├── 05-crud-administrador.spec.js   ← CRUD de Administrador
│   ├── 06-crud-agente.spec.js          ← CRUD de Agente de Atendimento
│   └── 07-pendencias-agente.spec.js
├── pages/                        # Page Objects (1 classe por tela)
│   ├── LoginPage.js
│   ├── UsuariosPage.js
│   ├── AdminFormPage.js
│   ├── AgenteFormPage.js
│   └── PendenciasPage.js
├── fixtures/
│   └── usuarios.js               # dados de teste (emails, senhas)
└── helpers/
    ├── auth.js                   # função pronta para fazer login
    ├── debug.js                  # screenshot/log manual durante desenvolvimento
    └── routes.js                 # todas as rotas do sistema, num só lugar
```

---

## 4. Conceitos fundamentais

| Conceito | O que é | Exemplo |
|---|---|---|
| `page` | a aba do navegador controlada pelo robô | `await page.goto('/login')` |
| `locator` | "aponta" para um elemento da tela | `page.getByRole('button', { name: 'Entrar' })` |
| `expect` | verifica se algo é verdade | `await expect(page).toHaveURL(/admin/)` |
| Page Object | uma classe que junta os seletores de uma tela | `pages/LoginPage.js` |
| fixture | dado de teste fixo/gerado | `fixtures/usuarios.js` |
| helper | função auxiliar reaproveitável | `helpers/auth.js` |

### Os seletores que usamos (`getByLabel`, `getByRole`, `locator`)

Preferimos seletores estáveis baseados em como o usuário enxerga a tela (texto do botão, label do campo), evitando depender de classes CSS que podem mudar com facilidade. Quando o HTML não tinha `label` associado ao campo (caso do formulário de Agente), usamos o atributo `name` do input, que é estável.

---

## 5. Instalação

```bash
npm install
npx playwright install
```

O segundo comando baixa os navegadores que o Playwright usa (Chrome, etc).

---

## 6. Como rodar

Rodar tudo (modo "headless", sem abrir janela visível):
```bash
npm test
```

Rodar vendo o navegador abrir e clicar sozinho (ótimo para aprender/debugar):
```bash
npm run test:headed
```

Rodar com a interface visual do Playwright (recomendado enquanto você ainda está aprendendo):
```bash
npm run test:ui
```

Rodar só o CRUD de Administrador:
```bash
npm run test:crud-admin
```

Rodar só o CRUD de Agente:
```bash
npm run test:crud-agente
```

Ver o relatório da última execução (com screenshots e vídeos dos testes que falharam):
```bash
npm run report
```

---

## 7. Contra qual ambiente os testes rodam?

Por padrão, os testes rodam contra produção:
```
https://metro-acesso-frontend.web.app
```

Isso está configurado em `playwright.config.js`. Para rodar contra o frontend local (ex: enquanto desenvolve, com `npm run dev` rodando o frontend em `localhost:5173`), use a variável de ambiente `BASE_URL`:

```bash
BASE_URL=http://localhost:5173 npm test
```

No Windows (PowerShell):
```powershell
$env:BASE_URL="http://localhost:5173"
npx playwright test
```

⚠️ **Atenção:** os testes de CRUD (05 e 06) criam, editam e removem dados de verdade. Evite rodá-los direto em produção sem necessidade — prefira um ambiente local/homologação quando possível.

---

## 8. Usuários usados nos testes

Por padrão (já configurados em `fixtures/usuarios.js`):

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@metroacesso.com | admin123 |
| Agente de Atendimento | junior@metroacesso.com | junior123 |

Você pode sobrescrever via variáveis de ambiente, se precisar usar outro usuário:
```bash
ADMIN_EMAIL=outro@email.com ADMIN_SENHA=outrasenha npm test
```

---

## 9. O que cada teste faz

### 01 — Smoke
Verifica que a landing page e a tela de login carregam, sem erros.

### 02 — Login com sucesso
Loga como Administrador e como Agente, confirma o redirecionamento correto (`/admin/dashboard` e `/agente/dashboard`).

### 03 — Login inválido
Tenta logar com credenciais erradas; confirma que o sistema bloqueia e mostra mensagem de erro.

### 04 — Rota protegida
- Tenta acessar `/usuarios` sem estar logado → deve redirecionar para `/login`.
- Loga como Agente e tenta acessar `/usuarios` (área exclusiva de Administrador) → o sistema redireciona de volta para a área do agente.

### 05 — CRUD de Administrador ⭐
Fluxo completo, na tela `/usuarios`:
1. **Create**: cadastra um novo administrador
2. **Read**: confirma que ele aparece na tabela
3. **Update**: edita o nome dele
4. **Delete**: remove e confirma que sumiu da tabela

### 06 — CRUD de Agente de Atendimento ⭐
Mesmo fluxo do administrador, mas com os campos extras do agente (turno e estação vinculada). Inclui também um teste negativo: tentar cadastrar sem selecionar uma estação.

### 07 — Pendências do Agente
Verifica que a tela de pendências carrega, e (se houver pendências disponíveis no momento) testa a confirmação/remoção de uma pendência.

### 08 — Notificação de nova pendência ⭐
O sistema consulta a API de pendências a cada 5 segundos enquanto o agente está logado (em `DashboardLayout.jsx`). Se a contagem aumentar, aparece um banner vermelho fixo: "Nova Pendência de Atendimento!".

Como o Playwright não tem como criar uma pendência real no backend, este teste **mocka** (simula) a resposta da API usando `page.route()`: primeiro retorna 1 pendência, depois passa a retornar 2, e o teste espera o banner aparecer sozinho, sem dar refresh na página. Também testa os dois botões do banner ("Ver pendências agora" e "Dispensar").

---

## 10. Avisos importantes sobre este sistema (coisas que descobrimos no código)

- **Diálogos nativos (`window.confirm` / `window.alert`)**: ao remover um usuário ou salvar um cadastro, o sistema usa pop-ups nativos do navegador. Os Page Objects já tratam isso automaticamente (`page.once('dialog', ...)`) — você não precisa se preocupar, mas é bom saber que existe.
- **Cadastro de Agente exige uma estação já existente**: o teste busca dinamicamente a primeira estação disponível no `<select>`. Se o banco de dados não tiver nenhuma estação cadastrada, esse teste falha — não é um bug do teste, é um pré-requisito de dados.
- **Pendências não são criadas pela tela do Agente**: elas vêm da API (criadas por outro fluxo, fora do frontend web). O teste de confirmação de pendência (`07`) usa `test.skip()` quando não há nenhuma pendência disponível no momento, em vez de falhar. Já o teste de notificação (`08`) contorna esse problema **mockando** a resposta da API com `page.route()`, simulando uma pendência nova sem depender de dados reais.
- **Polling a cada 5 segundos**: enquanto logado, o Agente fica perguntando à API se há pendências novas (`GET /api/pendencia-atendimento/agente/:email`). Isso é o que dispara o banner de notificação no rodapé da tela.
- **Autenticação é via `localStorage`** (token JWT), não via cookies. Isso não muda como você roda os testes, mas é relevante caso decidam evoluir o projeto futuramente para "login via API" (mais rápido que logar pela tela em todo teste).

---

## 11. Quando um teste falhar

A mensagem geralmente parece com:
```
waiting for getByRole('button', { name: 'Entrar' })
```

Isso quer dizer que o Playwright esperou um elemento aparecer na tela e ele nunca apareceu. Causas comuns:
- a rota está errada;
- o login não funcionou (sessão expirada, credenciais erradas);
- o texto do botão/label mudou no frontend;
- a tela ainda estava carregando.

Para investigar, rode:
```bash
npm run report
```
Isso abre um relatório com screenshot, vídeo e o passo a passo exato de onde o teste parou.

---

## 12. Próximos passos possíveis

- Adicionar `data-testid` nos componentes React para seletores ainda mais estáveis.
- Fazer login via chamada direta à API (mais rápido que preencher o formulário toda vez).
- Criar uma rotina de limpeza automática dos usuários de teste, caso algum teste falhe no meio do caminho e não chegue a remover o que criou.
- Integrar com GitHub Actions para rodar os testes automaticamente a cada push.
