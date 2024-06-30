import Router from "express";
import auth from "../middleware/login_auth.js";
import TwoFactorVerifyController from "../controllers/twoFactorVerifyController.js";

const two_factor_router = Router();

two_factor_router
  .post("/two_factor/sendCode", auth, TwoFactorVerifyController.sendCode);
// .post("/two_factor/verifyCode", );


export default two_factor_router;