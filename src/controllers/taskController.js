import { HttpCode, HttpErro, ImprevistError } from "../erros/erro.config.js";
import taskService from "../services/taskService.js";
import UserService from "../services/userService.js";


class TaskController{

  static async getTaskById(req, res){
    try{
      const user_id = req.user_id;
      const id = req.params.id;
      
      await UserService.getUser(user_id); //Verificando se o id confere
      const task = await taskService.getTaskById(user_id, id);
          
      res.status(HttpCode.OK).json({task: task});
        
    } catch(e){
    
      console.log(e);
    
      if(e instanceof HttpErro){
        e.sendMessage(res);
      } else{
        const erro_classificado = new ImprevistError(e.message);
        erro_classificado.sendMessage(res);
      }
    }
  }

  static async getTask(req, res){
    try{
      const {title, description, deadline, deadline_interval, priority, status, amount, order, direction} = req.query;
      const user_id = req.user_id;
      console.log(req.url);
      
      await UserService.getUser(user_id); //Verificando se o id confere
      const tasks = await taskService.getTask(
        {user_id, title, description, deadline, deadline_interval, priority, status, amount, order, direction});
          
      res.status(HttpCode.OK).json({amount: tasks.length, tasks: tasks});
        
    } catch(e){
    
      console.log(e);
    
      if(e instanceof HttpErro){
        e.sendMessage(res);
      } else{
        const erro_classificado = new ImprevistError(e.message);
        erro_classificado.sendMessage(res);
      }
    }
  }

  static async createTask(req, res){
    try{
      const {title, description, deadline, priority} = req.body;
      const user_id = req.user_id;
      
      await UserService.getUser(user_id); //Verificando se o id confere
      const new_task_id = await taskService.createTask(user_id, title, description, deadline, priority);
          
      res.status(HttpCode.CREATED).json({message: "Sucessfully Created", public_id: new_task_id});
        
    } catch(e){
    
      console.log(e);
    
      if(e instanceof HttpErro){
        e.sendMessage(res);
      } else{
        const erro_classificado = new ImprevistError(e.message);
        erro_classificado.sendMessage(res);
      }
    }
  }

  static async updateTask(req, res){
    try{
      const {title, description, deadline, priority, status} = req.body;
      const id = req.params.id;
      const user_id = req.user_id;
      
      await UserService.getUser(user_id); //Verificando se o id confere
      await taskService.updateTask(user_id, id, title, description, deadline, priority, status);
          
      res.status(HttpCode.OK).json({message: "Sucessfully Updated"});
        
    } catch(e){
    
      console.log(e);
    
      if(e instanceof HttpErro){
        e.sendMessage(res);
      } else{
        const erro_classificado = new ImprevistError(e.message);
        erro_classificado.sendMessage(res);
      }
    }
  }

  static async deleteTask(req, res){
    try{
      const id = req.params.id;
      const user_id = req.user_id;
      
      await UserService.getUser(user_id); //Verificando se o id confere
      await taskService.deleteTask(user_id, id);
          
      res.status(HttpCode.OK).json({message: "Task Deleted"});
        
    } catch(e){
    
      console.log(e);
    
      if(e instanceof HttpErro){
        e.sendMessage(res);
      } else{
        const erro_classificado = new ImprevistError(e.message);
        erro_classificado.sendMessage(res);
      }
    }
  }
}

export default TaskController;