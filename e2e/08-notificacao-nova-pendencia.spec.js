// e2e/08-notificacao-nova-pendencia.spec.js
const { test, expect } = require('@playwright/test');
const { loginComoAgente } = require('../helpers/auth');
const { agenteValido } = require('../fixtures/usuarios');

// O DashboardLayout consulta este endpoint a cada 5 segundos enquanto o
// agente está logado, comparando a quantidade de pendências com a consulta
// anterior. Se aumentou, mostra o banner "Nova Pendência de Atendimento!".
const ENDPOINT_PENDENCIAS = '**/api/pendencia-atendimento/agente/**';

function pendencia(id, nomePcd, nomeEstacao) {
  return {
    id,
    pcdAtendido: { nome: nomePcd, tiposDeficiencia: ['VISUAL'], desejaSuporte: true },
    estacao: { nome: nomeEstacao },
    entrada: { codigoEntrada: 'E1' },
    dataHora: new Date().toISOString(),
  };
}

test.describe('Notificação de nova pendência (mock de API)', () => {
  test('exibe o banner quando a contagem de pendências aumenta', async ({ page }) => {
    // Começa retornando 1 pendência -- essa é a "leitura inicial" que o
    // DashboardLayout usa só para guardar a contagem de referência, sem notificar.
    let pendencias = [pendencia(1, 'Maria Teste', 'Estação Sé')];

    await page.route(ENDPOINT_PENDENCIAS, (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(pendencias) });
    });

    await loginComoAgente(page, agenteValido);

    // Garante que a primeira leitura (contagem de referência) já aconteceu
    // antes de "criarmos" a nova pendência.
    await page.waitForTimeout(500);

    // Agora a lista "cresce": simula uma nova pendência chegando.
    pendencias = [...pendencias, pendencia(2, 'João da Silva', 'Estação Sé')];

    // O DashboardLayout faz polling a cada 5s; esperamos um pouco mais que isso
    // para dar tempo da próxima checagem ocorrer e o banner aparecer.
    await expect(page.getByText('Nova Pendência de Atendimento!')).toBeVisible({ timeout: 7000 });
    await expect(page.getByText(/João da Silva/)).toBeVisible();
    await expect(page.getByText(/Estação Sé/)).toBeVisible();
  });

  test('botão "Ver pendências agora" navega para a tela de pendências', async ({ page }) => {
    let pendencias = [pendencia(1, 'Maria Teste', 'Estação Sé')];

    await page.route(ENDPOINT_PENDENCIAS, (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(pendencias) });
    });

    await loginComoAgente(page, agenteValido);
    await page.waitForTimeout(500);

    pendencias = [...pendencias, pendencia(2, 'João da Silva', 'Estação Sé')];

    await expect(page.getByText('Nova Pendência de Atendimento!')).toBeVisible({ timeout: 7000 });
    await page.getByRole('button', { name: /ver pendências agora/i }).click();

    await expect(page).toHaveURL(/\/agente\/pendencias/);
  });

  test('botão "Dispensar" fecha o banner sem navegar', async ({ page }) => {
    let pendencias = [pendencia(1, 'Maria Teste', 'Estação Sé')];

    await page.route(ENDPOINT_PENDENCIAS, (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(pendencias) });
    });

    await loginComoAgente(page, agenteValido);
    await page.waitForTimeout(500);

    pendencias = [...pendencias, pendencia(2, 'João da Silva', 'Estação Sé')];

    await expect(page.getByText('Nova Pendência de Atendimento!')).toBeVisible({ timeout: 7000 });
    await page.getByRole('button', { name: /dispensar/i }).click();

    await expect(page.getByText('Nova Pendência de Atendimento!')).not.toBeVisible();
    // Permanece na mesma tela (dashboard do agente), não navegou para pendências
    await expect(page).toHaveURL(/\/agente\/dashboard/);
  });
});
