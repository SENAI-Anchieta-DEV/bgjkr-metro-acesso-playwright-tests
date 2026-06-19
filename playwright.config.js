// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,// Desabilita execução paralela para evitar conflitos em ambiente de teste compartilhado
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Força execução sequencial para evitar conflitos em ambiente de teste compartilhado
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173', // Define a URL base para os testes, facilitando a manutenção e flexibilidade
    trace: 'on',// Grava trace de todos os testes para facilitar análise, mesmo os que passam
    screenshot: 'only-on-failure',// Captura screenshot apenas em falhas para facilitar análise sem gerar muitos arquivos
    video: 'on',// Grava vídeo de todos os testes para facilitar análise, mesmo os que passam
    headless: true,// Executa em modo headed para facilitar visualização durante o desenvolvimento
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    viewport: null,// Utiliza o tamanho padrão da viewport para garantir consistência nos testes
    launchOptions: { 
      args: ['--start-maximized'], // Inicia o navegador maximizado para melhor visualização
      slowMo: 2000 // slowMo para facilitar visualização durante o desenvolvimento
    }
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],

});