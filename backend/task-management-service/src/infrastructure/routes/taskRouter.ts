
import express from "express";
import container from "../util/inversify";
import ITaskController from "../interfaces/ITaskController";
import INTERFACE_TYPES from "../constants/inversify";
import Auth from "../middleware/authMiddleware";

const router= express.Router()  
const taskController = container.get<ITaskController>(INTERFACE_TYPES.TaskController)
const auth = container.get<Auth>(INTERFACE_TYPES.Auth); 

const userAuth = auth.Auth(['project manager', 'admin']); 
const all = auth.Auth(['project manager', 'admin','employee']); 

router.post('/createTask',userAuth,taskController.createTaskHandler.bind(taskController))
router.post('/getTaskByTeam',all,taskController.getTasksByTeamHandler.bind(taskController))

router.get('/projectByTeam',all,taskController.getProjectByTeamHandler.bind(taskController))
router.post('/taskByProjectId',all,taskController.getTaskByProjectIdHandler.bind(taskController))


router.patch('/updateTask',all,taskController.updateTaskHandler.bind(taskController))
router.delete('/deleteTask',all,taskController.deleteTaskHandler.bind(taskController))

router.patch('/updateStatus',all,taskController.updateTaskStatusHandler.bind(taskController))

router.post('/comments',all,taskController.addCommentsHandler.bind(taskController))
export default router