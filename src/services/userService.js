import database from "../database/index.js";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import { generateHash, password_compare } from "../utils/crypt_security.js";
import { UserValidator } from "../utils/joi_validator.js";
import { EmailAlredyRegistered, EmailNotRegistered, IncorretPassword, NothingToUpdate, UserNotFound } from "../erros/userErro.js";
import hideEmail from "../utils/hideEmailAdress.js";

class UserService{

  static async getUser(id){
    const user = await database("User")
      .select("ID","NAME","DATE_BIRTH", "EMAIL", "NOTIFICATE", "HOURS_NOTIFICATION")
      .where({id})
      .first();

    if(!user) throw new UserNotFound();

    //Reescrita para proteger e facilitar a interpretação dos dados
    user.NOTIFICATE = (user.NOTIFICATE)==1 ? true : false;

    user.EMAIL = hideEmail(user.EMAIL);
    
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
      NOTIFICATE: notificate     //Notificate é um campo opcional, levado em consideração apenas se informado
    };

    await database("User").insert(user);

    return user.ID;
  }

  static async updateUser(id, name, date, notificate, hours_notification){

    if(!name && !date && !notificate && !hours_notification){
      throw new NothingToUpdate();
    }

    await UserValidator.validateUpdate({name, date, notificate, hours_notification});

    //Campos não informados são marcados como undefided e não alteram o estado do banco
    const new_user = {
      NAME: name,
      DATE_BIRTH: date,
      NOTIFICATE: notificate,
      HOURS_NOTIFICATION: hours_notification
    };

    await database("User").update(new_user).where({id});
  }

  static async dangerUpdateUser(id, actual_email, new_email, actual_pass, new_pass){

    if(!actual_email && !new_email && !actual_pass && !new_pass){
      throw new NothingToUpdate();
    }

    await UserValidator.validateDangerUpdate({actual_email, new_email, actual_pass, new_pass});

    const registered_user = await database("User").select("EMAIL", "PASSWORD").where({id}).first();
    const new_user = {};
    
    if(actual_email && new_email){
      if(actual_email===registered_user.EMAIL){
        new_user.EMAIL = new_email;
      } else{
        throw new EmailNotRegistered();
      }
    }

    if(actual_pass && new_pass){
      if(password_compare(actual_pass, registered_user.PASSWORD)){
        new_user.PASSWORD = await generateHash(new_pass);
      } else{
        throw new IncorretPassword();
      }
    }

    await database("User").update(new_user).where({id});
  }

  static async login(email, password){

    await UserValidator.validateLogin({email, password});

    const registered_user = await database("User").select("PASSWORD", "ID").where({EMAIL:email}).first();
    
    if(!registered_user){
      throw new EmailNotRegistered();
    }
    
    const registered_password = registered_user.PASSWORD;

    const isPasswordEqual = await password_compare(password, registered_password);
    if(!isPasswordEqual){
      throw new IncorretPassword();
    }

    const payload = {id: registered_user.ID};
    return jwt.sign(payload, process.env.LOGIN_TOKEN_KEY, {expiresIn: "24h"});
  }

  static async verifyPassword(id, informed_password){
    const registered_user = await database("User").select("PASSWORD").where({id}).first();

    if(!registered_user) throw new UserNotFound();

    const isPasswordEqual = password_compare(informed_password, registered_user.PASSWORD);
    if(!isPasswordEqual) throw new IncorretPassword();

    const payload = {is_password_verified: true};
    return jwt.sign(payload, process.env.PERMISSION_TOKEN_KEY, {expiresIn: "1h"});
  }

}

export default UserService;