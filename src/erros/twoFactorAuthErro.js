import { HttpCode, HttpErro } from "./erro.config.js";

export class MailerError extends HttpErro{
  constructor(message = "Erro ao enviar e-mail"){
    super(HttpCode.INTERNAL_SERVER_ERROR, "Erro ao enviar e-mail: " + message);
  }
}