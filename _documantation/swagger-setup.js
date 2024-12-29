import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import Router from "express";
import { fileURLToPath } from "url";
import path from "path";

let swaggerDocument = {};

// "Monta" __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  swaggerDocument = yaml.load(path.resolve(__dirname, "./openapi.yml"));
} catch (error) {
  console.error("Erro ao carregar o YML do OpenAPI:", error.message);
}

const swaggerRoute = Router();

swaggerRoute.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default swaggerRoute;