import { Router } from "express";
import UserController from "../controllers/userController.js";
import auth from "../middleware/login_auth.js";

const user_router = Router();

user_router
  .post("/user", UserController.createUser)
  .get("/user", auth, UserController.getUser)
//  .patch("/user", )
//  .delete("/user");

  .post("/user/login", UserController.login);

export default user_router;