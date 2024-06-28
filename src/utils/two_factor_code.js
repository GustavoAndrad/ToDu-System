
export function generateCode(){
  // Gera número inteiro de 5 dígitos
  return Math.floor(Math.random() * (65535 - 10000 + 1)) + 10000;
}

console.log(generateCode());