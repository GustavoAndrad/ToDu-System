import "dotenv/config";
import bcrypt from "bcryptjs";

async function generateSalt(){
  const saltRounds = parseInt(process.env.SALT_ROUNDS);
  const salt = await bcrypt.genSalt(saltRounds);
  return salt;
}

/**
 * @description Gera e retorna o salted hash de uma string.
 * @param {string} data - A string a ser hashada.
 * @returns {Promise<string>} - O hash gerado.
 */
export async function generateHash(data){
  const salt = await generateSalt();
  const hash = await bcrypt.hash(data, salt);
  return hash;
}

/**
 * @description Compara uma string de senha com uma hash. Se forem compatíveis, retorna verdadeiro, se não, retorna falso.
 * @param {*} password
 * @param {*} registered_password 
 * @returns {Promise<boolean>}
 */
export async function password_compare(password, registered_password){
  return ( await bcrypt.compare(password, registered_password) );
}