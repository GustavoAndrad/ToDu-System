import user_router from "./userRoutes.js";
import two_factor_router from "./twoFactorVerifyRoutes.js";
import task_router from "./taskRoutes.js";
import express from "express";
import { handleRouter404Error } from "../middleware/handle_erro_404.js";

/**
 * @description Mapeia as rotas da API
 * @param {*} app 
 */
const routes = (app) => {

  // Configração para manipulação de json
  app
    .use(express.json());

  // Funcionalidades do sistema
  app
    .use(user_router)
    .use(two_factor_router)
    .use(task_router);

  // Teste de conexão com a API
  app
    .get("/", (req, res) => {
      return res.status(200).json({ message: "✔ Server connection successfully established" });
    });

  // Tratamento solicitações em rota não definidas
  app
    .use(handleRouter404Error);
};

export default routes;
