import database from "../database/index.js";
import { v4 } from "uuid";
import { generateHash } from "../utils/crypt_security.js";
import { UserValidator } from "../utils/joi_validator.js";
import { EmailAlredyRegistered, UserNotFound } from "../erros/userErro.js";

class UserService{

  static async getUser(id){
    const user = await database("User")
      .select("ID","NOME","DATE_BIRTH", "EMAIL", "NOTIFICATE", "HOURS_NOTIFICATION")
      .where({id})
      .first();

    if(!user) throw new UserNotFound();
    
    return user;
  }

  //Método absolutamente confidencial. Informações sensíveis sobre todos os usuários. Não torná-lo acessível.
  async #getAllUser(){
    const users = await database("User").select("*");

    if(users.length === 0) throw new UserNotFound();

    return users;
  }

  static async createUser(name, date, email, password, repeat_password, notificate){

    const auxiliarInstance = new UserService(); // Acessar método privado
    const users = await auxiliarInstance.#getAllUser();
    
    //Verificando se já existe algum usuário com este e-mail
    for(const user_check of users){
      if(user_check.EMAIL === email){
        throw new EmailAlredyRegistered();
      }
    }
    
    await UserValidator.validateCreate({name, date, email, password, repeat_password, notificate});

    const passwordHash = await generateHash(password);
    
    const user = {
      ID: v4(),
      NOME: name,
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
  }
}

export default UserService;