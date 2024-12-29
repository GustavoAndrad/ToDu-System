import { v4 } from "uuid";
import database from "../database/index.js";
import { TaskValidator } from "../utils/joi_validator.js";
import { addMinutes, isBefore, parse, format } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { DeadlineConflict, DeadlineTooClose, DeniedOperationOnLateTask, DependentPropertyNotInformed, InvalidDeadlineFormat, InvalidDirection, PropertyNotFound, TaskNotFound } from "../erros/taskErro.js";
import { ProcessTimezoneError } from "../erros/erro.config.js";


class taskService{

  /** @private */
  static #validate_date_format(date){
    // format: YYYY-MM-DD HH:MM
    const valid_date_regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    return valid_date_regex.test(date);
  }

  /** @private */
  static #is_deadline_far_enough(deadline, timezone){

    const deadline_date = parse(deadline, "yyyy-MM-dd HH:mm", new Date());
    const thirty_minutes_in_future = toZonedTime(addMinutes(new Date(), 30),timezone);

    if(isBefore(deadline_date, thirty_minutes_in_future)){
      return false;
    }

    return true;
  }

  /**@private */
  static #verify_date_conversion(date){
    if(isNaN(date.getTime())){
      return false;
    }
    return true;
  }

  static async getTaskById(user_id, timezone, id){
    const task = await database("Task").select("*").where("ID_USER", user_id).andWhere("ID", id).first();

    if(!task) throw new TaskNotFound();

    task.DEADLINE = toZonedTime(task.DEADLINE, timezone);
    if(!(this.#verify_date_conversion(task.DEADLINE))) {
      throw new ProcessTimezoneError("Data inválida após processamento de conversão de UTC para timezone");
    }
    
    task.DEADLINE = format(new Date(task.DEADLINE), "yyyy-MM-dd HH:mm");
    return task;
  }

  static async getTask(
    {user_id, timezone, title, description, deadline, deadline_interval, priority, status, amount, order, direction}){
    
    //Não pode ser definido um prazo e um intervalo de prazo na mesma requisição
    if(deadline && deadline_interval) throw new DeadlineConflict(); 
    
    //Se um deles for informado o outro também precisa ser
    if((!order && direction) || (order && !direction)) throw new DependentPropertyNotInformed(); 

    //Montando a requisição de acordo com a entrada
    let query = database("Task").select("*").where("ID_USER", user_id);
    
    if (status) query = query.andWhere("STATUS", status);
    
    if (priority) query = query.andWhere("PRIORITY", priority);
    
    if (amount) query = query.limit(parseInt(amount));
    
    if (title) query = query.andWhere("TITLE", "like", `%${title}%`);

    if (deadline) {
      if(!(this.#validate_date_format(deadline))) throw new InvalidDeadlineFormat();

      const utc_deadline = fromZonedTime(deadline, timezone);
      if(!(this.#verify_date_conversion(utc_deadline))){
        throw new ProcessTimezoneError("Data inválida após processamento de conversão de timezone para UTC");
      }

      query = query.andWhere("DEADLINE", utc_deadline);
    }

    if (deadline_interval) {
      //YYYY-MM-DD HH:MM, YYYY-MM-DD HH:MM
      const [bottom, top] = deadline_interval.split(", ");

      if(!top || !bottom){
        throw new DependentPropertyNotInformed();
      }

      if((!(this.#validate_date_format(bottom))) || (!(this.#validate_date_format(top)))){
        throw new InvalidDeadlineFormat();
      }

      const utc_bottom = fromZonedTime(bottom, timezone);
      const utc_top = fromZonedTime(top, timezone);

      if((!(this.#verify_date_conversion(utc_bottom)) || (!(this.#verify_date_conversion(utc_top))))){
        throw new ProcessTimezoneError("Data inválida após processamento de conversão de timezone para UTC");
      }

      query = query.whereBetween("DEADLINE", [utc_bottom, utc_top]);
    }

    if (description) {
      if (description==="@!null-set!@") {
        query = query.andWhere("DESCRIPTION", null);
      } 
      else {
        query = query.andWhere("DESCRIPTION", "like", `%${description}%`);
      }
    }
    
    if (order && direction) {

      const columns_database = await database("Task").columnInfo();

      //Verificando se a propriedade para ordenar existe
      if(!Object.prototype.hasOwnProperty.call(columns_database, order.toUpperCase())){ 
        throw new PropertyNotFound();
      }

      //Verificando se a direção de ordanamento é válida
      if (direction === "desc") {
        query = query.orderBy(order, "desc");

      } else if(direction === "asc"){
        query = query.orderBy(order, "asc");
      
      } else{
        throw new InvalidDirection();
      }
    }
    
    //Execução da requisição ao banco de dados
    const task = await query;

    if(task.length===0){
      throw new TaskNotFound();
    }

    //Formatando prazos para YYYY-MM-DD HH:MM e na timezona solicitada para facilitar interpretação
    for (const item of task) {
      
      const zoned_deadline = toZonedTime(item.DEADLINE, timezone);
      if(!this.#verify_date_conversion(zoned_deadline)){
        throw new ProcessTimezoneError("Data inválida após processamento de conversão de UTC para timezone");
      }

      item.DEADLINE = format(zoned_deadline, "yyyy-MM-dd HH:mm");
    }

    return task;

  }

  static async createTask(user_id, timezone, title, description, deadline, priority){

    await TaskValidator.validateCreate({title, description, deadline, priority});

    if(!this.#is_deadline_far_enough(deadline, timezone)){
      throw new DeadlineTooClose();
    }

    //Datas são sempre armazenadas no banco como UTC
    const utc_deadline = fromZonedTime(deadline, timezone);
    if(!this.#verify_date_conversion(utc_deadline)){
      throw new ProcessTimezoneError("Data inválida após processamento de conversão de timezone para UTC");
    }

    const task_set = {
      ID: v4(),
      ID_USER: user_id,
      TITLE: title,
      DESCRIPTION: description,
      DEADLINE: utc_deadline,
      PRIORITY: priority
    };
    
    await database("Task").insert(task_set);

    return task_set.ID;
  }

  static async handleUpdateLateTask(status, user_id, id){
    if(!status || (status.toUpperCase())!=="DONE"){
      throw new DeniedOperationOnLateTask();
    }

    // Removendo tarefa feita cujo prazo já passou
    await this.deleteTask(user_id,id);

  }

  static async updateTask(user_id, id, timezone, title, description, deadline, priority, status){

    const task = await this.getTaskById(user_id, timezone, id);
    
    if((task.STATUS.toUpperCase())==="LATE"){ // Tarefas atrasadas só podem ser marcadas como feitas
      return await this.handleUpdateLateTask(status, user_id, id);
    }
    
    await TaskValidator.validateUpdate({title, description, deadline, priority, status});

    
    if(deadline){
      if(!this.#is_deadline_far_enough(deadline, timezone)){
        throw new DeadlineTooClose();
      }
    
      //Datas são sempre armazenadas no banco como UTC
      const utc_deadline = fromZonedTime(deadline, timezone);
      if(!this.#verify_date_conversion(utc_deadline)){
        throw new ProcessTimezoneError("Data inválida após processamento de conversão de timezone para UTC");
      }
    }

    const new_task_set = {
      TITLE: title,
      DESCRIPTION: description,
      DEADLINE: deadline,
      PRIORITY: priority,
      STATUS: status
    };


    await database("Task").update(new_task_set).where("ID", id).andWhere("ID_USER", user_id);

  }

  static async deleteTask(user_id, id){
    
    await this.getTaskById(user_id, undefined, id);

    await database("Task").where({id}).del();
  }
}

export default taskService;