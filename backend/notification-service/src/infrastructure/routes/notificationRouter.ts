import express from 'express';
import container from '../util/inversify';
import ITaskController from '../interfaces/INotificationController';
import INTERFACE_TYPES from '../constants/inversify';
import IChatController from '../interfaces/INotificationController';
import INotificationController from '../interfaces/INotificationController';

const controller = container.get<INotificationController>(INTERFACE_TYPES.NotificationController);
const Router = express.Router();


Router.post('/getNotification', controller.getNotificationHandler.bind(controller));
Router.post('/deleteNotification', controller.deleteNotificationHandler.bind(controller));

export default Router;
