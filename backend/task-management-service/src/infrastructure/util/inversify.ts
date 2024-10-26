import { Container } from "inversify"
import INTERFACE_TYPES from "../constants/inversify"
import ITaskController from "../interfaces/ITaskController";
import taskController from "../../controllers/taskController";
import { ITaskInteractor } from "../interfaces/ITaskInteractors";
import TaskInteractor from "../../interactors/TaskInteractor";
import ITaskRepository from "../interfaces/ITaskRepository";
import TaskRepository from "../../database/repositories/taskRepository";
import IJwt from "../interfaces/IJwt";
import Jwt from "./jwt";

const container = new Container()

container.bind<ITaskController>(INTERFACE_TYPES.TaskController).to(taskController);
container.bind<ITaskRepository>(INTERFACE_TYPES.TaskRepository).to(TaskRepository)
// container.bind<IRefreshTokenRepository>(INTERFACE_TYPES.RefreshTokenRepository).to(refreshTokenRepository)
container.bind<ITaskInteractor>(INTERFACE_TYPES.TaskInteractor).to(TaskInteractor)
container.bind<IJwt>(INTERFACE_TYPES.jwt).to(Jwt)

export default container 