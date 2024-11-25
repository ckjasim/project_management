import { Container } from "inversify"
import INTERFACE_TYPES from "../constants/inversify"
import IProjectController from "../interfaces/IChatController";
// import { IProjectInteractor } from "../interfaces/IChatInteractor";
import IJwt from "../interfaces/IJwt";
import Jwt from "./jwt";
// import ProjectController from "../../controllers/projectController";
import ProjectRepository from "../../database/repositories/projectRepository";
import IProjectRepository from "../interfaces/IProjectRepository";
import ProjectInteractor from "../../interactors/ChatInteractor";
import ITeamRepository from "../interfaces/ITeamRepository";
import TeamRepository from "../../database/repositories/teamRepository";
import IChatController from "../interfaces/IChatController";
import ChatController from "../../controllers/chatController";

const container = new Container()

container.bind<IChatController>(INTERFACE_TYPES.ChatController).to(ChatController);
// container.bind<IProjectRepository>(INTERFACE_TYPES.ProjectRepository).to(ProjectRepository)
// container.bind<ITeamRepository>(INTERFACE_TYPES.TeamRepository).to(TeamRepository)
// // container.bind<IRefreshTokenRepository>(INTERFACE_TYPES.RefreshTokenRepository).to(refreshTokenRepository)
// container.bind<IProjectInteractor>(INTERFACE_TYPES.ProjectInteractor).to(ProjectInteractor)
container.bind<IJwt>(INTERFACE_TYPES.jwt).to(Jwt)

export default container 