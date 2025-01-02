
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
router.route('/meeting')
    .post(userAuth, controller.createMeetingHandler.bind(controller)) 
    .get(all, controller.getMeetingsHandler.bind(controller)) 
    .delete(userAuth, controller.deleteMeetingHandler.bind(controller))

router.get('/files',userAuth,controller.listDriveFiles.bind(controller))
router.get('/payment',userAuth,controller.paymentHandler.bind(controller))

router.post(
    '/webhook',
    express.raw({ type: 'application/json' }), 
    controller.webhookHandler.bind(controller)
  );
export default router