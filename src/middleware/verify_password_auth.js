import { BadFormatToken, InvalidToken, PermissionDenied, TokenNotInformed } from "../erros/authErro.js";
import jwt from "jsonwebtoken";
import { HttpErro, ImprevistError } from "../erros/erro.config.js";

//Não substitui a autenticação por login, apenas concede permissão.
export default function authorization_password(req, res, next){
  try{
    const permission = req.headers.permission_password;

    if(!permission){
      throw new TokenNotInformed();
    }

    const [prefix, token] = permission.split(" ");
    
    if(prefix!=="Bearer" || !token){
      throw new BadFormatToken();
    }
    
    jwt.verify(token, process.env.PERMISSION_TOKEN_KEY, (error,data) => {

      if(error){
        throw new InvalidToken("Token inválido: " + error.message);
      }
      else{

        //Mesmo se o token for válido, verifica permissões
        if(!data.is_password_verified){
          throw new PermissionDenied();
        } 

        req.password_permission = data.is_password_verified;
        next();

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