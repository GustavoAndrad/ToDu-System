import { HttpCode, HttpErro, ImprevistError } from "../erros/erro.config.js";
import TwoFactorVerifyService from "../services/twoFactorVerifyService.js";

class TwoFactorVerifyController{

  static async sendCode(req, res){
    try{
      const id_user = req.user_id;
      const user_email = await TwoFactorVerifyService.sendCode(id_user);
        
      res.status(HttpCode.OK).json({message: "Código enviado para " + user_email});
    } catch(e){
            
      console.log(e);

      if(e instanceof HttpErro){
        e.sendMessage(res);
      } else{
        const erro_imprevisto = new ImprevistError(e.message);
        erro_imprevisto.sendMessage(res);
      }
    }
  }

  static async verifyCode(req, res){
    try{
      const id_user = req.user_id;
      const code = req.body.code;

      const permission_token = await TwoFactorVerifyService.verifyCode(code, id_user);

      res.status(HttpCode.OK).json({temporary_permission_token: permission_token});
    }catch(e){
            
      console.log(e);

      if(e instanceof HttpErro){
        e.sendMessage(res);
      } else{
        const erro_imprevisto = new ImprevistError(e.message);
        erro_imprevisto.sendMessage(res);
      }
    }
  }
}

export default TwoFactorVerifyController;