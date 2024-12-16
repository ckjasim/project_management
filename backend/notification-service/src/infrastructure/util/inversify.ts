import { Container } from "inversify"
import INTERFACE_TYPES from "../constants/inversify"

import IChatController from "../interfaces/INotificationController";
import ChatController from "../../controllers/notificationController";
// import { IChatInteractor } from "../interfaces/INotificationInteractor";
import ChatInteractor from "../../interactors/NotificationInteractor";
import IJwt from "../interfaces/IJwt";
import Jwt from "./jwt";
import ITeamRepository from "../interfaces/ITeamRepository";
import TeamRepository from "../../database/repositories/teamRepository";
import IChatRepository from "../interfaces/INotificationRepository";
import ChatRepository from "../../database/repositories/notificationRepository";
import INotificationRepository from "../interfaces/INotificationRepository";
import NotificationRepository from "../../database/repositories/notificationRepository";
import { INotificationInteractor } from "../interfaces/INotificationInteractor";
import NotificationInteractor from "../../interactors/NotificationInteractor";
import INotificationController from "../interfaces/INotificationController";
import NotificationController from "../../controllers/notificationController";

const container = new Container()
container.bind<ITeamRepository>(INTERFACE_TYPES.TeamRepository).to(TeamRepository)
container.bind<INotificationRepository>(INTERFACE_TYPES.NotificationRepository).to(NotificationRepository)
container.bind<IJwt>(INTERFACE_TYPES.jwt).to(Jwt)

container.bind<INotificationController>(INTERFACE_TYPES.NotificationController).to(NotificationController);


container.bind<INotificationInteractor>(INTERFACE_TYPES.NotificationInteractor).to(NotificationInteractor)


export default container 