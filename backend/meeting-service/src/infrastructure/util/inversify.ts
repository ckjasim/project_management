import { Container } from "inversify"
import INTERFACE_TYPES from "../constants/inversify"

import { IInteractor } from "../interfaces/IInteractors";

import TeamRepository from "../../database/repositories/teamRepository";
import IJwt from "../interfaces/IJwt";
import Jwt from "./jwt";
import ITeamRepository from "../interfaces/ITeamRepository";

import Auth from "../middleware/authMiddleware";
import IController from "../interfaces/IController";
import controller from "../../controllers/controller";
import MeetingRepository from "../../database/repositories/meetingRepository";
import Interactor from "../../interactors/interactor";
import IMeetingRepository from "../interfaces/IMeetingRepository";

const container = new Container()

container.bind<IController>(INTERFACE_TYPES.Controller).to(controller);
container.bind<IMeetingRepository>(INTERFACE_TYPES.MeetingRepository).to(MeetingRepository)
container.bind<ITeamRepository>(INTERFACE_TYPES.TeamRepository).to(TeamRepository)
container.bind<IInteractor>(INTERFACE_TYPES.interactor).to(Interactor)
container.bind<IJwt>(INTERFACE_TYPES.jwt).to(Jwt)
container.bind<any>(INTERFACE_TYPES.Auth).to(Auth)


export default container 