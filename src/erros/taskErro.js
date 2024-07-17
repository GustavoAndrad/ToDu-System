import { HttpCode, HttpErro } from "./erro.config.js";

export class TaskNotFound extends HttpErro{
  constructor(message = "Nenhuma tarefa encontrada"){
    super(HttpCode.NOT_FOUND, message);
  }
}

export class DeadlineConflict extends HttpErro{
  constructor(message = "Não pode ser definido um prazo e um intervalo de prazo na mesma requisição"){
    super(HttpCode.BAD_REQUEST, message);
  }
}

export class DependentPropertyNotInformed extends HttpErro{
  constructor(message = "Um campo informado precisa de algum outro para completar a requisição"){
    super(HttpCode.BAD_REQUEST, message);
  }
}

export class InvalidDeadlineFormat extends HttpErro{
  constructor(message = "Prazo inválido. Formato esperado (América/São Paulo): YYYY-MM-DD HH:MM"){
    super(HttpCode.BAD_REQUEST, message);
  }
}

export class PropertyNotFound extends HttpErro{
  constructor(message = "Propriedade da tarefa não encontrada para ordenamento"){
    super(HttpCode.BAD_REQUEST, message);
  }
}

export class InvalidDirection extends HttpErro{
  constructor(message = "A direção de ordenamento só pode ser 'desc' ou 'asc'"){
    super(HttpCode.BAD_REQUEST, message);
  }
}

export class DeadlineTooClose extends HttpErro{
  constructor(message = "O prazo deve ser de, no mínimo, mais que 30 minutos"){
    super(HttpCode.BAD_REQUEST, message);
  }
}
