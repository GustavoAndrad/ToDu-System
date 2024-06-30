import "dotenv/config";
import database from "../database/index.js";
import { MailerError } from "../erros/erro.config.js";
import { ExpiredCode, IncompatibleCode, InvalidCode } from "../erros/twoFactorAuthErro.js";
import Mailer from "../utils/mailer.js";
import { generateCode } from "../utils/two_factor_code.js";
import UserService from "./userService.js";
import { addMinutes, format, isBefore, parse } from "date-fns";
import jwt from "jsonwebtoken";

class TwoFactorVerifyService{

  /**@private*/
  static async #getCreatedCodes(){
    const codes = await database("Code_2FA").select("IDENTITY_CODE");
    return codes;
  }

  /**@private*/
  static async #verifyAlredySendedCode(user_id){
    const user_with_code = await database("Code_2FA").select("ID_USER");

    const isAlredySended = user_with_code.some(user => user.ID_USER === user_id);

    //Se o usuário já tiver u código, ele é apagado
    if(isAlredySended){
      await database("Code_2FA").where({ID_USER: user_id}).del();
    }
  }

  /**@private*/
  static #isValidCode(code){
    if(typeof(code)==="number" && code >= 10000 && code<=65535){
      return true;
    }
    return false;
  }

  static async sendCode(user_id){
    
    /*
      Code é uma entidade única na base de dados. Cada registro deve ser único. 
      Um usuário só pode ter um code relacionado a ele, se ele solicitar e já houver, o antigo será excluído.
      É gerado um código até ele ser único dentro de [10000,65535], colaborando para a eficiência da operação.
    */
    await this.#verifyAlredySendedCode(user_id);

    const created_codes = await this.#getCreatedCodes();
    let code = undefined;

    do{
      code = generateCode();
    } while (created_codes.some(registered_code => registered_code.IDENTITY_CODE === code));


    //Gerando horário de validade do código
    const qnt_minutos_to_expire = 10;
    const expiration_date = format(addMinutes(new Date(), qnt_minutos_to_expire), "yyyy-MM-dd HH:mm:ss");

    //Inserindo as informações do código no banco de dados
    const code_set = {
      ID_USER: user_id,
      IDENTITY_CODE: code,
      EXPIRATION_DATE: expiration_date
    };
    
    await database("Code_2FA").insert(code_set);
    
    //Construindo e enviando e-mail
    const user = await UserService.getUser(user_id);
    const user_email = user.EMAIL;
    
    const mailer = new Mailer();
    const isSended = await mailer.sendCodeMail(code, user_email);

    if(!isSended.status){
      throw new MailerError(isSended.message);
    }
    

    return user_email;
  }

  static async verifyCode(informed_code, user_id){

    if(!(this.#isValidCode(informed_code))){
      throw new InvalidCode();
    }

    const registered_code = await database("Code_2FA")
      .select("*")
      .where("IDENTITY_CODE", informed_code)
      .andWhere("ID_USER", user_id)
      .first();

    if(!registered_code){
      throw new IncompatibleCode();
    }

    const expirationDate = new Date(registered_code.EXPIRATION_DATE);
    const expirationDateString = expirationDate.toISOString().slice(0, 19).replace("T", " ");

    const expire_date = parse(expirationDateString, "yyyy-MM-dd HH:mm:ss", new Date());
    const actual_date = new Date();

    const isValid = isBefore(actual_date, expire_date);

    if(!isValid){
      throw new ExpiredCode();
    }

    const payload = {
      status: true,
      permission_key: process.env.PERMISSION_KEY,
      id: registered_code.ID_USER
    };

    return jwt.sign(payload, process.env.TOKEN_KEY, {expiresIn: "1h"});

  }
}

export default TwoFactorVerifyService;