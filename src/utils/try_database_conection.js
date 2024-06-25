import mysql from "mysql2/promise";

const { DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT, DB_USER } = process.env;

async function try_database_conection(){
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
    console.error("Error while pre-connecting to the database:", error.message);
    console.error("\n\tSolve the problems to run the express server");
    console.error("\tHint: Try to review the connection credentials or make sure your mysql server is running correctly");
    console.log("\n\tMySQL full error log: \n", error);

    return false;
  }
};


export default try_database_conection;