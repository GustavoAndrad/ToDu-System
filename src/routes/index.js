import user_router  from "./userRoutes.js";
import two_factor_router from "./twoFactorVerifyRoutes.js";
import task_router from "./taskRoutes.js";
import express from "express";

const routes = (app) => {

  app
    .use(express.json())
    .use(user_router)
    .use(two_factor_router)
    .use(task_router)

    .use("/", (req, res) =>{
      res.status(200).json({message : "Server connection sucessfully stablished"});
    });
};

export default routes ;