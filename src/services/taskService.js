import { v4 } from "uuid";
import database from "../database/index.js";
import { TaskValidator } from "../utils/joi_validator.js";
import { addMinutes, isBefore, parse, format } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { DeadlineConflict, DeadlineTooClose, DependentPropertyNotInformed, InvalidDeadlineFormat, InvalidDirection, PropertyNotFound, TaskNotFound } from "../erros/taskErro.js";


class taskService{

  /** @private */
  static #validate_date_format(date){
    // format: YYYY-MM-DD HH:MM
    const valid_date_regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    return valid_date_regex.test(date);
  }

  /** @private */
  static #is_deadline_far_enough(deadline){
    const time_zone = "America/Sao_Paulo"; // Versão 1.0.0 projetada para essa timezone. Buscar maneira mais escalável.

    const deadline_date = parse(deadline, "yyyy-MM-dd HH:mm", new Date());
    const deadline_date_utc = fromZonedTime(deadline_date, time_zone);

    const now = new Date();
    const thirty_minutes_in_future = addMinutes(now, 30);

    if(isBefore(deadline_date_utc, thirty_minutes_in_future)){
      return false;
    }

    return true;
  }

  static async getTaskById(user_id, id){
    const task = await database("Task").select("*").where("ID_USER", user_id).andWhere("ID", id).first();

    if(!task) throw new TaskNotFound();

    task.DEADLINE = format(new Date(task.DEADLINE), "yyyy-MM-dd HH:mm");
    return task;
  }

  static async getTask(
    {user_id, title, description, deadline, deadline_interval, priority, status, amount, order, direction}){
    
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
      
      query = query.andWhere("DEADLINE", deadline);
    }

    if (deadline_interval) {
      const [bottom, top] = deadline_interval.split(", ");

      if(!top || !bottom){
        throw new DependentPropertyNotInformed();
      }

      if((!(this.#validate_date_format(bottom))) || (!(this.#validate_date_format(top)))){
        throw new InvalidDeadlineFormat();
      }

      query = query.whereBetween("DEADLINE", [bottom, top]);
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
      /*
        columns_database.hasOwnProperty(order) funcionaria, mas, por segurança de impelementação (evitar acessar um método sobrescrito),
        acessei por Object mesmo que implicasse em uma estrutura um pouco mais verbosa 
      */
      if(!Object.prototype.hasOwnProperty.call(columns_database, order.toUpperCase())){ //Verificando se a propriedade para ordenar existe
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
    

    const task = await query;

    if(task.length===0){
      throw new TaskNotFound();
    }

    //Formatando prazos para YYYY-MM-DD HH:MM
    for (const item of task) {
      item.DEADLINE = format(new Date(item.DEADLINE), "yyyy-MM-dd HH:mm");
    }

    return task;

  }

  static async createTask(user_id, title, description, deadline, priority){

    await TaskValidator.validateCreate({title, description, deadline, priority});

    if(!this.#is_deadline_far_enough(deadline)){
      throw new DeadlineTooClose();
    }

    const task_set = {
      ID: v4(),
      ID_USER: user_id,
      TITLE: title,
      DESCRIPTION: description,
      DEADLINE: deadline,
      PRIORITY: priority
    };

    await database("Task").insert(task_set);

    return task_set.ID;
  }

  static async updateTask(user_id, id, title, description, deadline, priority, status){

    await this.getTaskById(user_id, id);

    await TaskValidator.validateUpdate({title, description, deadline, priority, status});

    if(deadline){
      if(!this.#is_deadline_far_enough(deadline)) throw new DeadlineTooClose();
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
    
    await this.getTaskById(user_id, id);

    await database("Task").where({id}).del();
  }
}

export default taskService;