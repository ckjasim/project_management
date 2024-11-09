import express from 'express';
import container from '../util/inversify';
import ITaskController from '../interfaces/IProjectController';
import INTERFACE_TYPES from '../constants/inversify';

const controller = container.get<ITaskController>(INTERFACE_TYPES.ProjectController);
const Router = express.Router();

Router.route('/project')
    .post(controller.createProjectHandler.bind(controller))
    .get(controller.getProjectsHandler.bind(controller))
    .patch(controller.updateProjectHandler.bind(controller));

Router.patch('/project/delete', controller.deleteProjectHandler.bind(controller));

export default Router;
