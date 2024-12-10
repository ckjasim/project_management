import { Container } from "inversify"
import INTERFACE_TYPES from "../constants/inversify"

import IChatController from "../interfaces/IChatController";
import ChatController from "../../controllers/chatController";
import { IChatInteractor } from "../interfaces/IChatInteractor";
import ChatInteractor from "../../interactors/ChatInteractor";
import IJwt from "../interfaces/IJwt";
import Jwt from "./jwt";
import ITeamRepository from "../interfaces/ITeamRepository";
import TeamRepository from "../../database/repositories/teamRepository";
import IChatRepository from "../interfaces/IChatRepository";
import ChatRepository from "../../database/repositories/chatRepository";

const container = new Container()
container.bind<ITeamRepository>(INTERFACE_TYPES.TeamRepository).to(TeamRepository)
container.bind<IChatRepository>(INTERFACE_TYPES.ChatRepository).to(ChatRepository)
container.bind<IJwt>(INTERFACE_TYPES.jwt).to(Jwt)

container.bind<IChatController>(INTERFACE_TYPES.ChatController).to(ChatController);


container.bind<IChatInteractor>(INTERFACE_TYPES.ChatInteractor).to(ChatInteractor)


export default container 