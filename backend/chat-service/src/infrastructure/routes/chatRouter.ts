import express from 'express';
import container from '../util/inversify';
import ITaskController from '../interfaces/IChatController';
import INTERFACE_TYPES from '../constants/inversify';
import IChatController from '../interfaces/IChatController';
import Auth from '../middleware/authMiddleware';

const controller = container.get<IChatController>(INTERFACE_TYPES.ChatController);
const Router = express.Router();
const auth = container.get<Auth>(INTERFACE_TYPES.Auth); 

const all = auth.Auth(['project manager', 'admin','employee']);
Router.get('/teamListByEmployee',all ,controller.teamListByEmployeeHandler.bind(controller));
Router.get('/getChats',all, controller.getChatsHandler.bind(controller));
Router.post('/markRead',all, controller.markReadHandler.bind(controller));
export default Router;
