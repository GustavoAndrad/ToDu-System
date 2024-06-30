import Joi from "joi";
import { JoiValidatorError } from "../erros/erro.config.js";

/**
 * @description 
 * Classe com métodos estáticos para validação de entradas. Utiliza a biblioteca Joi.
 * Os métodos também tratam de instanciar os erros de validação a serem enviados nas respostas de requisições http 
 */
export class UserValidator {
  static async validateCreate({ name, date, email, password, repeat_password, notificate }) {
    try{
      const schema = Joi.object({
        name: Joi.string()
          .alphanum()
          .min(3)
          .max(100)
          .required()
          .messages({
            "string.alphanum": "Formato de nome inválido",
            "string.min": "O nome precisa ter no mínimo 3 caracteres",
            "string.max": "O nome precisa ter no máximo 100 caracteres",
            "any.required": "O nome é obrigatório"
          }),

        date: Joi.date()
          .required()
          .messages({
            "any.required": "A data é obrigatória"
          }),

        email: Joi.string()
          .email()
          .max(255)
          .required()
          .messages({
            "string.email": "Email inválido",
            "string.max": "O email deve ter no máximo 255 caracteres",
            "any.required": "O email é obrigatório"
          }),

        password: Joi.string()
          .min(8)
          .required()
          .messages({
            "string.min": "A senha precisa ter pelo menos 8 caracteres",
            "any.required": "A senha é obrigatória"
          }),

        repeat_password: Joi.any()
          .valid(Joi.ref("password"))
          .required()
          .messages({
            "any.only": "A confirmação da senha precisa ser igual à senha",
            "any.required": "A confirmação da senha é obrigatória"
          }),

        notificate: Joi.boolean()
          .messages({
            "boolean.base": "Notificate é um campo binário"
          })
      });

      await schema.validateAsync({ name, date, email, password, repeat_password, notificate });
    } catch(e){
      throw new JoiValidatorError(e.message);
    }
  }

  static async validateLogin({email, password}){
    try{
      const schema = Joi.object({
        email: Joi.string()
          .email()
          .max(255)
          .required()
          .messages({
            "string.email": "Email inválido",
            "string.max": "O email deve ter no máximo 255 caracteres",
            "any.required": "O email é obrigatório"
          }),

        password: Joi.string()
          .min(8)
          .required()
          .messages({
            "string.min": "A senha precisa ter pelo menos 8 caracteres",
            "any.required": "A senha é obrigatória"
          }),

      });

      await schema.validateAsync({ email, password });
    } catch(e){
      throw new JoiValidatorError(e.message);
    }
  }
  
}
