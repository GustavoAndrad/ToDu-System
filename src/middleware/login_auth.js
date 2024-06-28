import jwt from "jsonwebtoken";
import { BadFormatToken, InvalidToken, TokenNotInformed } from "../erros/authErro.js";
import { HttpErro, ImprevistError } from "../erros/erro.config.js";

export default function auth(req, res, next){
  try{
    const auth = req.headers.authorization;

    if(!auth){
      throw new TokenNotInformed();
    }

    
    const [prefix, token] = auth.split(" ");
    
    if(prefix!=="Bearer" && !token){
      throw new BadFormatToken();
    }
    
    jwt.verify(token, process.env.TOKEN_KEY, (error,data) => {

      if(error){
        throw new InvalidToken(error.message);
      }
      else{
        req.user_id = data.id;
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