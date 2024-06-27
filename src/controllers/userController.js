import { HttpErro, ImprevistError } from "../erros/erro.config.js";
import UserService from "../services/userService.js";

class UserController{
  static async getUser(req, res){
    try{
      const id_usuario = req.params.id;

      const user = await UserService.getUser(id_usuario);
      
      res.status(200).json(user);
    
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
        
      await UserService.createUser(name, date, email, password, repeat_password, notificate);
      
      res.status(201).json({message: "Created"});
    
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
}

export default UserController;