import { Container } from "inversify"
import INTERFACE_TYPES from "../constants/inversify"
import IProjectController from "../interfaces/IProjectController";
import { IProjectInteractor } from "../interfaces/IProjectInteractor";
import IJwt from "../interfaces/IJwt";
import Jwt from "./jwt";
import ProjectController from "../../controllers/projectController";
import ProjectRepository from "../../database/repositories/projectRepository";
import IProjectRepository from "../interfaces/IProjectRepository";
import ProjectInteractor from "../../interactors/ProjectInteractor";
import ITeamRepository from "../interfaces/ITeamRepository";
import TeamRepository from "../../database/repositories/teamRepository";
import Auth from "../middleware/authMiddleware";

const container = new Container()

container.bind<IProjectController>(INTERFACE_TYPES.ProjectController).to(ProjectController);
container.bind<IProjectRepository>(INTERFACE_TYPES.ProjectRepository).to(ProjectRepository)
container.bind<ITeamRepository>(INTERFACE_TYPES.TeamRepository).to(TeamRepository)
// container.bind<IRefreshTokenRepository>(INTERFACE_TYPES.RefreshTokenRepository).to(refreshTokenRepository)
container.bind<IProjectInteractor>(INTERFACE_TYPES.ProjectInteractor).to(ProjectInteractor)
container.bind<IJwt>(INTERFACE_TYPES.jwt).to(Jwt)
container.bind<any>(INTERFACE_TYPES.Auth).to(Auth)

export default container 