import { BadFormatToken, InvalidToken, TokenNotInformed } from "../erros/authErro";
import jwt from "jsonwebtoken";
import { HttpErro, ImprevistError } from "../erros/erro.config";


export default function authorization(req, res, next){
  try{
    const permission = req.headers.Permission;

    if(!permission){
      throw new TokenNotInformed();
    }

    const [prefix, token] = permission.split(" ");
    
    if(prefix!=="Bearer" && !token){
      throw new BadFormatToken();
    }
    
    jwt.verify(token, process.env.TOKEN_KEY, (error,data) => {

      if(error){
        throw new InvalidToken("Token inválido: " + error.message);
      }
      else{
        if(data.permission_key === process.env.PERMISSION_KEY && data.status){
          req.user_id = data.id;
          next();
        }
      }  
    });
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