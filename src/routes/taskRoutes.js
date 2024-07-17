import { Router } from "express";
import login_auth from "../middleware/login_auth.js";
import TaskController from "../controllers/taskController.js";

const task_router = Router();

task_router
  .post("/task", login_auth, TaskController.createTask)
  .get("/task/filter", login_auth, TaskController.getTask)
  .get("/task/:id", login_auth, TaskController.getTaskById)
  .patch("/task/:id", login_auth, TaskController.updateTask)
  .delete("/task/:id", login_auth, TaskController.deleteTask);


export default task_router;