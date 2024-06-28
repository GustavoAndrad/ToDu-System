import { HttpCode, HttpErro, ImprevistError } from "../erros/erro.config.js";
import UserService from "../services/userService.js";

class UserController{
  static async getUser(req, res){
    try{
      const id_user = req.user_id;

      const user = await UserService.getUser(id_user);
      
      res.status(HttpCode.OK).json(user);
    
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

  static async createUser(req, res){
    try{
      const {name, date, email, password, repeat_password, notificate} = req.body;
        
      const new_user_id = await UserService.createUser(name, date, email, password, repeat_password, notificate);
      
      res.status(HttpCode.CREATED).json({message: "Sucessfully Created", public_id: new_user_id});
    
    } catch(e){

      console.log(e);

      if(e instanceof HttpErro){
        e.sendMessage(res);
      } else{
        const erro_classificado = new ImprevistError(e.message);
        erro_classificado.sendMessage(res);
      }
    }
  }

  static async login(req, res){
    try{
      const {email, password} = req.body;

      const acess_token = await UserService.login({email, password});

      res.status(HttpCode.OK).json({token: acess_token});

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

export default UserController;