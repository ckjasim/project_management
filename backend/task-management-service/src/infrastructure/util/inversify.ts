import { Container } from "inversify"
import INTERFACE_TYPES from "../constants/inversify"
import ITaskController from "../interfaces/ITaskController";
import taskController from "../../controllers/taskController";
import { ITaskInteractor } from "../interfaces/ITaskInteractors";
import TaskInteractor from "../../interactors/TaskInteractor";
import ITaskRepository from "../interfaces/ITaskRepository";
import TaskRepository from "../../database/repositories/taskRepository";
import TeamRepository from "../../database/repositories/teamRepository";
import ProjectRepository from "../../database/repositories/projectRepository";
import IJwt from "../interfaces/IJwt";
import Jwt from "./jwt";
import ITeamRepository from "../interfaces/ITeamRepository";
import IProjectRepository from "../interfaces/IProjectRepository";
import Auth from "../middleware/authMiddleware";

const container = new Container()

container.bind<ITaskController>(INTERFACE_TYPES.TaskController).to(taskController);
container.bind<ITaskRepository>(INTERFACE_TYPES.TaskRepository).to(TaskRepository)
container.bind<ITeamRepository>(INTERFACE_TYPES.TeamRepository).to(TeamRepository)
container.bind<IProjectRepository>(INTERFACE_TYPES.ProjectRepository).to(ProjectRepository)
// container.bind<IRefreshTokenRepository>(INTERFACE_TYPES.RefreshTokenRepository).to(refreshTokenRepository)
container.bind<ITaskInteractor>(INTERFACE_TYPES.TaskInteractor).to(TaskInteractor)
container.bind<IJwt>(INTERFACE_TYPES.jwt).to(Jwt)
container.bind<any>(INTERFACE_TYPES.Auth).to(Auth)


export default container 