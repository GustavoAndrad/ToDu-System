import database from "../../database/index.js";

/**
 * @description Marca como atrasadas as tarefas não feitas cujo prazo já passou
 * @returns {Promisse<Number>} Quantidade de tarefas marcadas
 */
export async function update_late_tasks(){
  const currentTime = new Date().toISOString().slice(0, 19).replace("T", " "); 

  return await database("Task")
    .update({ STATUS: "LATE" })
    .where("deadline", "<", currentTime)
    .andWhere("STATUS", "!=", "DONE")
    .andWhere("STATUS", "!=", "LATE");
}