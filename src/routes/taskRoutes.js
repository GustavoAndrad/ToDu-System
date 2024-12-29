import { Router } from "express";
import login_auth from "../middleware/login_auth.js";
import TaskController from "../controllers/taskController.js";
import handle_timezone_change from "../middleware/handle_timezone_change.js";

const task_router = Router();

task_router
  .post("/task", login_auth, 
    handle_timezone_change, 
    TaskController.createTask)

  .get("/task/filter", 
    login_auth, 
    handle_timezone_change, 
    TaskController.getTask)

  .get("/task/:id", 
    login_auth, 
    handle_timezone_change,
    TaskController.getTaskById)


  .patch("/task/:id", 
    login_auth, 
    handle_timezone_change, 
    TaskController.updateTask)

  .delete("/task/:id", 
    login_auth,
    handle_timezone_change, 
    TaskController.deleteTask);


export default task_router;