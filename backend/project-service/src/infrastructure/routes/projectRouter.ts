import express from 'express';
import container from '../util/inversify';
import IProjectController from '../interfaces/IProjectController';
import INTERFACE_TYPES from '../constants/inversify';

const controller = container.get<IProjectController>(INTERFACE_TYPES.ProjectController);
const Router = express.Router();

Router.route('/project')
    .post(controller.createProjectHandler.bind(controller))
    .get(controller.getProjectsHandler.bind(controller))
    .patch(controller.updateProjectHandler.bind(controller));

Router.patch('/project/delete', controller.deleteProjectHandler.bind(controller));
Router.get('/project/teamList', controller.getTeamsHandler.bind(controller));
Router.post('/project/teamsByProject', controller.getTeamsByProjectHandler.bind(controller));
Router.post('/project/createTeam', controller.createTeamHandler.bind(controller));
Router.get('/project/singleProject', controller.getProjectByProjectCodeHandler.bind(controller));
Router.post('/project/teamMembers', controller.getTeamMembersByTeamIdHandler.bind(controller));

export default Router;
