import { HttpCode, HttpErro, ImprevistError } from "../erros/erro.config.js";
import twoFactorVerifyService from "../services/twoFactorVerifyService.js";

class TwoFactorVerifyController{

  static async sendCode(req, res){
    try{
      const id_user = req.user_id;
      const user_email = await twoFactorVerifyService.sendCode(id_user);
        
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
}

export default TwoFactorVerifyController;