// Uso do modelo de importações do ES Modules (padrão do projeto)
import "dotenv/config";
import express from "express";
import routes from "./routes/index.js";
import try_database_conection from "./utils/try_database_conection.js";

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST;
const ENVIRONMENT = process.env.NODE_ENV;

// Configurações do servidor
const app = express();
routes(app);

if(await try_database_conection()){

  app.listen(PORT, HOST, async ()=>{
    console.log(`Server listening on: http://${HOST}:${PORT}`);
    console.log(`Environment: ${ENVIRONMENT}`);
    
  });

}
