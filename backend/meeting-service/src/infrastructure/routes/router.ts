
import express from "express";
import container from "../util/inversify";
import ITaskController from "../interfaces/IController";
import INTERFACE_TYPES from "../constants/inversify";
import Auth from "../middleware/authMiddleware";

import IController from "../interfaces/IController";

const router= express.Router()  
const controller = container.get<IController>(INTERFACE_TYPES.Controller)
const auth = container.get<Auth>(INTERFACE_TYPES.Auth); 

const userAuth = auth.Auth(['project manager', 'admin']); 
const all = auth.Auth(['project manager', 'admin','employee']); 
console.log('ioioioioi')
router.route('/meeting')
    .post(userAuth, controller.createMeetingHandler.bind(controller)) 
    .get(all, controller.getMeetingsHandler.bind(controller)) 
    // .patch(userAuth, controller.updateProjectHandler.bind(controller));


// router.post('/createMeeting',userAuth,controller.createMeetingHandler.bind(controller))
// router.post('/getMeetingByTeam',all,taskController.getTasksByTeamHandler.bind(taskController))

// router.get('/projectByTeam',all,taskController.getProjectByTeamHandler.bind(taskController))
// router.post('/taskByProjectId',all,taskController.getTaskByProjectIdHandler.bind(taskController))


// router.patch('/updateTask',all,taskController.updateTaskHandler.bind(taskController))
// router.patch('/deleteTask',all,taskController.deleteTaskHandler.bind(taskController))

// router.patch('/updateStatus',all,taskController.updateTaskStatusHandler.bind(taskController))

export default router