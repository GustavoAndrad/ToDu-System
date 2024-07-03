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
          .min("1920-01-01")
          .max("now")
          .messages({
            "any.required": "A data é obrigatória",
            "date.min": "A data deve ser posterior a 01/01/1920",
            "date.max": "A data não pode ser no futuro"
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

  static async validateUpdate({name, date, notificate, hours_notification}){
    try{

      const schema = Joi.object({
        name: Joi.string()
          .alphanum()
          .min(3)
          .max(100)
          .messages({
            "string.alphanum": "Formato de nome inválido",
            "string.min": "O nome precisa ter no mínimo 3 caracteres",
            "string.max": "O nome precisa ter no máximo 100 caracteres",
          }),

        date: Joi.date()
          .min("1920-01-01")
          .max("now")
          .messages({
            "any.required": "A data é obrigatória",
            "date.min": "A data deve ser posterior a 01/01/1920",
            "date.max": "A data não pode ser no futuro"
          }),

        notificate: Joi.boolean()
          .messages({
            "boolean.base": "Notificate é um campo binário"
          }),
        
        hours_notification: Joi.number()
          .integer()
          .positive()
          .min(1)
          .max(72)
          .messages({
            "number.base": "O valor deve ser um número",
            "number.integer": "O valor deve ser um inteiro",
            "number.min": "O tempo deve ser no mímino 1 hora",
            "number.max": "O tempo deve ser no máximo 3 dias (72 horas)",
            "number.positive": "O valor deve ser um número positivo",
          })
      });

      await schema.validateAsync({ name, date, notificate, hours_notification });
    } catch(e){
      throw new JoiValidatorError(e.message);
    }
  }

  static async validateDangerUpdate({ actual_email, new_email, actual_pass, new_pass }) {
    try {
      const schema = Joi.object({
        actual_email: Joi.string()
          .email({ tlds: { allow: false } })
          .max(255)
          .messages({
            "string.email": "Formato de e-mail inválido",
            "string.max": "O email deve ter no máximo 255 caracteres",
          }),
  
        new_email: Joi.string()
          .email({ tlds: { allow: false } })
          .max(255)
          .messages({
            "string.email": "Formato de e-mail inválido",
            "string.max": "O email deve ter no máximo 255 caracteres",
          }),
  
        actual_pass: Joi.string()
          .min(8)
          .messages({
            "string.min": "A senha atual deve ter no mínimo 8 caracteres",
          }),
  
        new_pass: Joi.string()
          .min(8)
          .messages({
            "string.min": "A nova senha deve ter no mínimo 8 caracteres",
          })
      });

      //Essa validação condicional com Joi traria muita complexidade. Buscar refatoração futura.
      if((actual_email && !new_email) || (!actual_email && new_email)){
        throw new Error("É necessário preencher os dois campos de email");
      }

      if((actual_pass && !new_pass) || (!actual_pass && new_pass)){
        throw new Error("É necessário preencher os dois campos de senha");
      }
  
      await schema.validateAsync({ actual_email, new_email, actual_pass, new_pass });
    } catch (e) {
      throw new JoiValidatorError(e.message);
    }
  }  
  
}
