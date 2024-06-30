/**
 * @description Gera e retorna um inteiro no intervalo [10000,65535]
 * @returns {Number}
 */
export function generateCode(){
  // Gera número inteiro de 5 dígitos
  return Math.floor(Math.random() * (65535 - 10000 + 1)) + 10000;
}