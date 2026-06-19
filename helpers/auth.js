import { usuarioValido } from '../fixtures/dados.js';
import { LoginPage } from '../pages/LoginPage.js';

export async function realizarLoginPelaInterface(page, usuario = usuarioValido) {
  const loginPage = new LoginPage(page);
  await loginPage.login(usuario.email, usuario.senha);
  await loginPage.deveEstarNoDashboard();
}