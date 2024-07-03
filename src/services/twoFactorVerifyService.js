import "dotenv/config";
import database from "../database/index.js";
import { MailerError } from "../erros/erro.config.js";
import { ExpiredCode, IncompatibleCode, InvalidCode } from "../erros/twoFactorAuthErro.js";
import Mailer from "../utils/mailer.js";
import { generateCode } from "../utils/two_factor_code.js";
import UserService from "./userService.js";
import { addMinutes, format, isAfter, isBefore, parse } from "date-fns";
import jwt from "jsonwebtoken";
import hideEmail from "../utils/hideEmailAdress.js";

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

    //Se o usuário já tiver um código, ele é apagado
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
      Um usuário só pode ter um code relacionado a ele, caso haja solicitação e já houver algum, o antigo será excluído.
      É gerado um código até que seja único dentro de [10000,65535], colaborando para a eficiência da operação.
      Cabe refatoração do algoritimo  de geração em caso de escalabilidade da aplicação, mas para fins de estudo cumpre suas necessidades
    */
    await this.#verifyAlredySendedCode(user_id);

    const created_codes = await this.#getCreatedCodes();
    let code = undefined;

    do{
      code = generateCode();
    } while (created_codes.some(registered_code => registered_code.IDENTITY_CODE === code));


    //Gerando horário de validade do código
    const qnt_minutes_to_expire = 10;
    const expiration_date = format(addMinutes(new Date(), qnt_minutes_to_expire), "yyyy-MM-dd HH:mm:ss");

    //Inserindo as informações do código no banco de dados
    const code_set = {
      ID_USER: user_id,
      IDENTITY_CODE: code,
      EXPIRATION_DATE: expiration_date
    };
    
    await database("Code_2FA").insert(code_set);
    
    //Construindo e enviando e-mail
    const user = await database("User").select("EMAIL").where({ID: user_id}).first();
    const user_email = user.EMAIL;
    
    const mailer = new Mailer();
    const isSended = await mailer.sendCodeMail(code, user_email);

    if(!isSended.status){
      throw new MailerError(isSended.message);
    }
    
    const formated_email = hideEmail(user_email);
    return formated_email;
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
    const format_expiration_date = expirationDate.toISOString().slice(0, 19).replace("T", " ");

    const expire_date = parse(format_expiration_date, "yyyy-MM-dd HH:mm:ss", new Date());
    const actual_date = new Date();

    const is_expired = isBefore(expire_date, actual_date);

    if(is_expired){
      throw new ExpiredCode();
    }

    const payload = {
      status: true,
      permission_key: process.env.PERMISSION_KEY,
    };

    // O token é valido por 1 hora, depois disso o processo de 2FA deve ser completamente refeito
    return jwt.sign(payload, process.env.PERMISSION_TOKEN_KEY, {expiresIn: "1h"});

  }
}

export default TwoFactorVerifyService;