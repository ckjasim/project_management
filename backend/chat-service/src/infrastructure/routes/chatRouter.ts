import express from 'express';
import container from '../util/inversify';
import ITaskController from '../interfaces/IChatController';
import INTERFACE_TYPES from '../constants/inversify';
import IChatController from '../interfaces/IChatController';

const controller = container.get<IChatController>(INTERFACE_TYPES.ChatController);
const Router = express.Router();

// Router.patch('/project/delete', controller.deleteProjectHandler.bind(controller));
Router.get('/teamListByEmployee', controller.teamListByEmployeeHandler.bind(controller));
Router.get('/getChats', controller.getChatsHandler.bind(controller));
// Router.post('/project/createTeam', controller.createTeamHandler.bind(controller));

export default Router;
