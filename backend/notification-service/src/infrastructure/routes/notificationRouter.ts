import express from 'express';
import container from '../util/inversify';
import ITaskController from '../interfaces/INotificationController';
import INTERFACE_TYPES from '../constants/inversify';
import IChatController from '../interfaces/INotificationController';
import INotificationController from '../interfaces/INotificationController';
import Auth from '../middleware/authMiddleware';

const controller = container.get<INotificationController>(INTERFACE_TYPES.NotificationController);
const Router = express.Router();
const auth = container.get<Auth>(INTERFACE_TYPES.Auth); 

const all = auth.Auth(['project manager', 'admin','employee']);

Router.post('/getNotification',all, controller.getNotificationHandler.bind(controller));
Router.delete('/deleteNotification',all, controller.deleteNotificationHandler.bind(controller));

export default Router;
