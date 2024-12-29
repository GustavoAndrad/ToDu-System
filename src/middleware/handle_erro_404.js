import { HttpCode, HttpErro } from "../erros/erro.config.js";

export function handleRouter404Error(req, res){
  const err404 = new HttpErro(HttpCode.NOT_FOUND, "Serviço solicitado não encontrado. Revise a documentação do sistema");
  err404.sendMessage(res);
}