// Uso do modelo de importações do ES Modules (padrão do projeto)
import "dotenv/config";
import express from "express";
import routes from "./routes/index.js";

import try_database_conection from "./utils/try_mysql_conection.js";
import { schedule_operations } from "./utils/schedule/index.js";

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST;
const ENVIRONMENT = process.env.NODE_ENV;

console.log("\n===================== INICILIZANDO SISTEMA =====================\n");

// Configurações do sistema
const app = express();
routes(app);

const isConectedToDatabase = await try_database_conection();

if(isConectedToDatabase){

  app.listen(PORT, HOST, async ()=>{
    console.log(`🚀   Server listening on: http://${HOST}:${PORT}`);
    console.log(`🌱   Environment: \x1b[4m${ENVIRONMENT}\x1b[0m`);

    await schedule_operations();
    
  });

}
