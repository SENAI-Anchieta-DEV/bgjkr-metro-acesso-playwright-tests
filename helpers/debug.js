// helpers/debug.js

/**
 * Tira um screenshot manual a qualquer momento do teste, salvo em test-results/.
 * Útil para inspecionar o estado da tela durante o desenvolvimento de um teste.
 */
async function printarTela(page, nomeArquivo) {
  await page.screenshot({ path: `test-results/${nomeArquivo}.png`, fullPage: true });
}

/**
 * Imprime no console o texto visível da página inteira -- ajuda a entender
 * rapidamente "o que está na tela" quando um seletor não é encontrado.
 */
async function logTextoDaPagina(page) {
  const texto = await page.locator('body').innerText();
  console.log('--- TEXTO DA PÁGINA ---');
  console.log(texto);
  console.log('-----------------------');
}

module.exports = { printarTela, logTextoDaPagina };
