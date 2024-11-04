
import express from "express";
import container from "../util/inversify";
import ITaskController from "../interfaces/ITaskController";
import INTERFACE_TYPES from "../constants/inversify";

const router= express.Router()  

const taskController = container.get<ITaskController>(INTERFACE_TYPES.TaskController)
router.post('/task/createTask',taskController.createTaskHandler.bind(taskController))
router.get('/task/getTask',taskController.getTasksByProjectCodeHandler.bind(taskController))
router.patch('/task/updateStatus',taskController.updateTaskStatusHandler.bind(taskController))

export default router