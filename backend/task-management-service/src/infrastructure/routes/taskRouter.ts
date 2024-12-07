
import express from "express";
import container from "../util/inversify";
import ITaskController from "../interfaces/ITaskController";
import INTERFACE_TYPES from "../constants/inversify";

const router= express.Router()  

const taskController = container.get<ITaskController>(INTERFACE_TYPES.TaskController)
router.post('/task/createTask',taskController.createTaskHandler.bind(taskController))
router.post('/task/getTaskByTeam',taskController.getTasksByTeamHandler.bind(taskController))

router.get('/task/projectByTeam',taskController.getProjectByTeamHandler.bind(taskController))
router.post('/task/taskByProjectId',taskController.getTaskByProjectIdHandler.bind(taskController))



router.patch('/task/updateStatus',taskController.updateTaskStatusHandler.bind(taskController))
router.patch('/task/updateTask',taskController.updateTaskHandler.bind(taskController))
router.patch('/task/deleteTask',taskController.deleteTaskHandler.bind(taskController))

export default router