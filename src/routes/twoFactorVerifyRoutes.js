import Router from "express";
import login_auth from "../middleware/login_auth.js";
import TwoFactorVerifyController from "../controllers/twoFactorVerifyController.js";

const two_factor_router = Router();

// Verificação de 2 fatores para operações críticas. Autenticação necessária!
two_factor_router
  .post("/two_factor/sendCode", login_auth, TwoFactorVerifyController.sendCode)
  .post("/two_factor/verifyCode", login_auth, TwoFactorVerifyController.verifyCode);


export default two_factor_router;