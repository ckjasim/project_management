import express from 'express';
import container from '../util/inversify';
import IProjectController from '../interfaces/IProjectController';
import INTERFACE_TYPES from '../constants/inversify';
import Auth from '../middleware/authMiddleware';

const controller = container.get<IProjectController>(INTERFACE_TYPES.ProjectController);
const auth = container.get<Auth>(INTERFACE_TYPES.Auth); 

const Router = express.Router(); 


const userAuth = auth.Auth(['project manager', 'admin']); 

Router.route('/project')
    .post(userAuth, controller.createProjectHandler.bind(controller)) 
    .get(userAuth, controller.getProjectsHandler.bind(controller)) 
    .patch(userAuth, controller.updateProjectHandler.bind(controller));

Router.patch('/project/delete',userAuth, controller.deleteProjectHandler.bind(controller));
Router.get('/project/teamList', userAuth, controller.getTeamsHandler.bind(controller));
Router.post('/project/teamsByProject', userAuth, controller.getTeamsByProjectHandler.bind(controller));
Router.post('/project/createTeam',userAuth, controller.createTeamHandler.bind(controller));
Router.post('/project/addTeamMember',userAuth, controller.addTeamMemberHandler.bind(controller));
Router.get('/project/singleProject', userAuth, controller.getProjectByProjectCodeHandler.bind(controller));
Router.post('/project/teamMembers', userAuth, controller.getTeamMembersByTeamIdHandler.bind(controller));

export default Router;
