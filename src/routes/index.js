import user_router  from "./userRoutes.js";
import express from "express";

const routes = (app) => {

  app
    .use(express.json());

  app
    .use(user_router)

    .use("/", (req, res) =>{
      res.status(200).json({message : "Server connection sucessfully stablished"});
    });
};

export default routes ;