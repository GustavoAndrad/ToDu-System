import database from "../database/index.js";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import { generateHash, login_compare } from "../utils/crypt_security.js";
import { UserValidator } from "../utils/joi_validator.js";
import { EmailAlredyRegistered, EmailNotRegistered, IncorretPassword, UserNotFound } from "../erros/userErro.js";

class UserService{

  static async getUser(id){
    const user = await database("User")
      .select("ID","NAME","DATE_BIRTH", "EMAIL", "NOTIFICATE", "HOURS_NOTIFICATION")
      .where({id})
      .first();

    if(!user) throw new UserNotFound();
    
    return user;
  }

  static async createUser(name, date, email, password, repeat_password, notificate){
 
    //Verificando se já existe algum usuário com este e-mail
    const users = await database("User").select("*");
    
    for(const user_check of users){
      if(user_check.EMAIL === email){
        throw new EmailAlredyRegistered();
      }
    }
    
    await UserValidator.validateCreate({name, date, email, password, repeat_password, notificate});

    const passwordHash = await generateHash(password);
    
    const user = {
      ID: v4(),
      NAME: name,
      DATE_BIRTH: date,
      EMAIL: email,
      PASSWORD: passwordHash,
    };

    //Notificate é um campo opcional, adicionado ao objeto-criação apenas se informado
    if(notificate!=undefined){
      const isNotificatable = notificate? 1 : 0;
      user.NOTIFICATE = isNotificatable;
    }

    await database("User").insert(user);

    return user.ID;
  }

  static async login({email, password}){

    await UserValidator.validateLogin({email, password});

    const registered_user = await database("User").select("PASSWORD", "ID").where({EMAIL:email}).first();
    
    if(!registered_user){
      throw new EmailNotRegistered();
    }
    
    const registered_password = registered_user.PASSWORD;

    const isPasswordEqual = await login_compare(password, registered_password);
    if(!isPasswordEqual){
      throw new IncorretPassword();
    }

    const payload = {id: registered_user.ID};
    return jwt.sign(payload, process.env.TOKEN_KEY, {expiresIn: "24h"});
  }
}

export default UserService;