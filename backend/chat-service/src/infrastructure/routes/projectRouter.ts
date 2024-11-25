import express from 'express';
import container from '../util/inversify';
import ITaskController from '../interfaces/IChatController';
import INTERFACE_TYPES from '../constants/inversify';

// const controller = container.get<ITaskController>(INTERFACE_TYPES.ProjectController);
const Router = express.Router();

// Router.route('/project')
//     .post(controller.createProjectHandler.bind(controller))
//     .get(controller.getProjectsHandler.bind(controller))
//     .patch(controller.updateProjectHandler.bind(controller));

// Router.patch('/project/delete', controller.deleteProjectHandler.bind(controller));
// Router.get('/project/teamList', controller.getTeamsHandler.bind(controller));
// Router.post('/project/createTeam', controller.createTeamHandler.bind(controller));

export default Router;
