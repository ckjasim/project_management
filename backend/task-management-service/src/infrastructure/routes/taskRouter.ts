
import express from "express";
import container from "../util/inversify";
import ITaskController from "../interfaces/ITaskController";
import INTERFACE_TYPES from "../constants/inversify";

const router= express.Router()  

const taskController = container.get<ITaskController>(INTERFACE_TYPES.TaskController)
router.post('/createTask',taskController.createTaskHandler.bind(taskController))
router.post('/getTaskByTeam',taskController.getTasksByTeamHandler.bind(taskController))

router.get('/projectByTeam',taskController.getProjectByTeamHandler.bind(taskController))
router.post('/taskByProjectId',taskController.getTaskByProjectIdHandler.bind(taskController))



router.patch('/updateStatus',taskController.updateTaskStatusHandler.bind(taskController))
router.patch('/updateTask',taskController.updateTaskHandler.bind(taskController))
router.patch('/deleteTask',taskController.deleteTaskHandler.bind(taskController))

export default router