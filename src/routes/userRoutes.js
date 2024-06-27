import { Router } from "express";
import UserController from "../controllers/userController.js";

const user_router = Router();

user_router
  .get("/user/:id", UserController.getUser)
  .post("/user", UserController.createUser);
//  .patch("/user")
//  .delete("/user");

export default user_router;