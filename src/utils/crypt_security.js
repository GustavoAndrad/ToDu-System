import "dotenv/config";
import bcrypt from "bcryptjs";

async function generateSalt(){
  const saltRounds = parseInt(process.env.SALT_ROUNDS);
  const salt = await bcrypt.genSalt(saltRounds);
  return salt;
}

export async function generateHash(data){
  const salt = await generateSalt();
  const hash = await bcrypt.hash(data, salt);
  return hash;
}