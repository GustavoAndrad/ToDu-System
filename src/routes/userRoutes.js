import { Router } from "express";
import UserController from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const user_router = Router();

user_router
  .get("/user", auth, UserController.getUser)
  .post("/user", UserController.createUser)
//  .patch("/user")
//  .delete("/user");

  .post("/user/login", UserController.login);

export default user_router;