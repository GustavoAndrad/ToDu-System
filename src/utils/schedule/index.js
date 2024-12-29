import schedule from "node-schedule";
import { notify_user } from "./task_notification.js";
import { update_late_tasks } from "./update_task_status.js";
import { delete_complete_task } from "./delete_complete_taks.js";
import { format } from "date-fns";

/**
 * @description Monitora a execução das operações automatizadas
 */
export async function schedule_operations(){
  // Agendar uma tarefa para executar a cada minuto
  schedule.scheduleJob("*/1 * * * *", async ()=>{

    const id_agendamento = format(new Date(), "yyyy/MM/dd.HH:mm"); 

    console.log(`\n====================== TAREFAS AGENDADAS - ${id_agendamento} ======================\n`);

    // Monitorando status das tarefas
    console.log("🤓   Verificando status das tarefas...");
    
    const set_as_late = await update_late_tasks();
    const deleted = await delete_complete_task();

    console.log(`🥴   Atualização de ${id_agendamento} concluída.` +
        "\n\t✅   Marcadas como Atrasadas: " + set_as_late +
        "\n\t✅   Concluídas deletadas: " + deleted + 
        "\n"
    );

    // Lidando com notificações
    console.log("⏰   Verificando necessidade de notificações de tarefas...");
    await notify_user(id_agendamento);
    console.log(`🎯   Verificação de notificação de ${id_agendamento} finalizada.\n`);


  });  
}