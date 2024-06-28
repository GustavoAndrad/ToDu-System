import Router from "express";
import auth from "../middleware/login_auth.js";
import AuthController from "../controllers/authController.js";

const auth_router = Router();

auth_router
  .post("/two_factor/sendCode", auth, AuthController.sendCode);
// .post("/two_factor/verifyCode", );


export default auth_router;