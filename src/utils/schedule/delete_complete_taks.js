import database from "../../database/index.js";

/**
 * @description Exclui tarefas concluídas cujo prazo já passou
 * @returns {Promisse<Number>} Quantidade de tarefas excluídas
 */
export async function delete_complete_task(){
  const currentTime = new Date().toISOString().slice(0, 19).replace("T", " "); 
    
  return await database("Task")
    .delete()
    .where("deadline", "<", currentTime)
    .andWhere("STATUS", "=", "DONE");
}