import { addHours, getDate, getHours, getMinutes, getMonth, getYear } from "date-fns";
import database from "../../database/index.js";
import Mailer from "../mailer.js";

/**
 * @description Verifica se duas datas são as mesmas (precisão de minutos)
 * @param {*} deadline_date - data a ser verificada
 * @param {*} hour_notificate - data a ser verificada
 * @returns {boolean}
 */
function is_same_date(deadline_date, hour_notificate) {
  const isSameYear = getYear(deadline_date) === getYear(hour_notificate);
  const isSameMonth = getMonth(deadline_date) === getMonth(hour_notificate);
  const isSameDay = getDate(deadline_date) === getDate(hour_notificate);
  const isSameHour = getHours(deadline_date) === getHours(hour_notificate);
  const isSameMinute = getMinutes(deadline_date) === getMinutes(hour_notificate);

  return isSameYear && isSameMonth && isSameDay && isSameHour && isSameMinute;
}


/**
 * @description Mostra tarefas de usuários notificáveis cuja data de prazo é igual a data atual (precisão de minutos)
 * @returns {Promisse<[{ID: Number, USER_NOTIFICATE: Number, HOURS_NOTIFICATION: Number, TITLE: string, DEADLINE: string, NAME: string, EMAIL: string}]>}
 */
async function get_tasks_to_notiity() {
  const able_to_notificate = await database("User")
    .join("Task", "User.ID", "=", "Task.ID_USER")
    .select("User.ID", "User.NOTIFICATE", "User.HOURS_NOTIFICATION", "Task.TITLE", "Task.DEADLINE", "User.NAME", "User.EMAIL")
    .where("User.NOTIFICATE", 1);

  const to_notificate = able_to_notificate.filter((t) => {
    const deadline_date = new Date(t.DEADLINE);
    const notification_time = addHours(deadline_date, -t.HOURS_NOTIFICATION);

    return is_same_date(new Date(), notification_time);
  });

  return to_notificate;
}

/**
 * @description Notifica os usuários sobre suas tarefas cujo prazo é igual à data atual (precisão de minutos)
 */
export async function notify_user(schedule_id) {
  const queue_notify = await get_tasks_to_notiity();
  const mailer = new Mailer();

  for (const node of queue_notify){
    const response = await mailer.sendTaskNotification(node.NAME, node.EMAIL, node.TITLE, node.HOURS_NOTIFICATION);
    if(response.status){
      console.log(`------- 📨   Email enviado para ${node.EMAIL} - SCHEDULE_ID: ${schedule_id}`);
    } else{
      console.log(`------- ⚠️   Falha ao notiifcar ${node.EMAIL}  - SCHEDULE_ID: ${schedule_id} \n Err: ${response.message}`);
    }
  };
}

