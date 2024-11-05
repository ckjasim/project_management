import express from "express";
import container from "../util/inversify";
import ITaskController from "../interfaces/ITaskController";
import INTERFACE_TYPES from "../constants/inversify";
import RoleChecker from "../middleware/authMiddleware";
import IJwt from "../interfaces/IJwt";

const router = express.Router();  
const taskController = container.get<ITaskController>(INTERFACE_TYPES.TaskController);
const roleChecker = new RoleChecker(container.get<IJwt>(INTERFACE_TYPES.jwt));

// Route Definitions
router.post('/task/createTask', 
    roleChecker.checkRole(['employee']), 
    taskController.createTaskHandler.bind(taskController)
);

router.get('/task/getTask', 
    roleChecker.checkRole(['employee', 'manager']), 
    taskController.getTasksByProjectCodeHandler.bind(taskController)
);

router.patch('/task/updateStatus', 
    roleChecker.checkRole(['manager']), 
    taskController.updateTaskStatusHandler.bind(taskController)
);

router.patch('/task/updateTask', 
    roleChecker.checkRole(['employee', 'manager']), 
    taskController.updateTaskHandler.bind(taskController)
);

router.patch('/task/deleteTask', 
    roleChecker.checkRole(['manager']), 
    taskController.deleteTaskHandler.bind(taskController)
);

export default router;
