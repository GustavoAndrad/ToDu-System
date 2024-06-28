import user_router  from "./userRoutes.js";
import auth_router from "./authRoutes.js";
import express from "express";

const routes = (app) => {

  app
    .use(express.json())
    .use(user_router)
    .use(auth_router)

    .use("/", (req, res) =>{
      res.status(200).json({message : "Server connection sucessfully stablished"});
    });
};

export default routes ;