export const usuarioValido = {
  email: 'admin@metroacesso.com', 
  senha: 'admin123',       
};

export function gerarEntradaAleatoria() {
  const timestamp = Date.now();
  
  // Gera um MAC Address falso, porém num formato válido para testar o cadastro do roteador
  const octeto = () => Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase();
  const bssidFalso = `${octeto()}:${octeto()}:${octeto()}:${octeto()}:${octeto()}:${octeto()}`;

  return {
    codigoEstacao: "se01",
    bssid: bssidFalso,
    codigoEntrada: `ENT-TST-${timestamp}`,
  };
}