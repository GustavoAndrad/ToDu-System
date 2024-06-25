import mysql from "mysql2/promise";

const { DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT, DB_USER } = process.env;

async function teste_conexao(){
  try {
    //São necessárias alterações nas credenciais para testes fora dos conteiners
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT
    });

    console.log("Successfully connected to the database.");
    await connection.end();
    return true;
    
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return false;
  }
};


export default teste_conexao;