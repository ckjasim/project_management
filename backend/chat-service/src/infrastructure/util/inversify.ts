import { Container } from "inversify"
import INTERFACE_TYPES from "../constants/inversify"

import IChatController from "../interfaces/IChatController";
import ChatController from "../../controllers/chatController";
import IChatUserRepository from "../interfaces/IChatUserRepository";
import ChatUserRepository from "../../database/repositories/chatUserRepository";
import { IChatInteractor } from "../interfaces/IChatInteractor";
import ChatInteractor from "../../interactors/ChatInteractor";

const container = new Container()

container.bind<IChatController>(INTERFACE_TYPES.ChatController).to(ChatController);
container.bind<IChatUserRepository>(INTERFACE_TYPES.ChatUserRepository).to(ChatUserRepository)

container.bind<IChatInteractor>(INTERFACE_TYPES.ChatInteractor).to(ChatInteractor)


export default container 