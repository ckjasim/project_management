
import { Container } from "inversify"

import INTERFACE_TYPES from "../constants/inversify"

import IUserRepository from "../interfaces/IUserRepository"
import { IUserInteractor } from "../interfaces/IUserInteractors"

import UserInteractors from "../../interactors/userInteractor"
import UserRepository from "../../database/repositories/userRepository"
import userAuthController from "../../controllers/userAuthController"
import IUserController from "../interfaces/IUserController"
import IJwt from "../interfaces/IJwt"
import Jwt from "./jwt"
import  IEmailService  from "../interfaces/IEmailService"
import { NodeMailerService } from "./nodeMailerService"
import IOtpRepository from "../interfaces/IOtpRepository"
import OtpRepository from "../../database/repositories/otpRepository"
import IEmployeeRepository from "../interfaces/IEmployeeRepository"
import EmployeeRepository from "../../database/repositories/employeeRepository"
import EmployeeInteractor from "../../interactors/employeeInteractor"
import EmployeeAuthController from "../../controllers/employeeAuthController"
import IEmployeeController from "../interfaces/IEmployeeController"
import { IAdminInteractor } from "../interfaces/IAdminInteractors"
import AdminInteractor from "../../interactors/adminInteractor"
import { IEmployeeInteractor } from "../interfaces/IEmployeeInteractors"
import { GoogleAuthService } from "./passport"
import IGoogleAuthService from "../interfaces/IGoogleAuthService"
import IRefreshTokenRepository from "../interfaces/IRefreshTokenRepository"
import refreshTokenRepository from "../../database/repositories/refreshTokenRepository"
import IAdminController from "../interfaces/IAdminController"
import adminAuthController from "../../controllers/adminAuthController"
import IOrganizationRepository from "../interfaces/IOrganizationRepository"
import organizationRepository from "../../database/repositories/organizationRepository"
import IInvitationRepository from "../interfaces/IInvitationRepository"
import InvitationRepository from "../../database/repositories/invitationRepository"
import Auth from "../middleware/authMiddleware"

const container = new Container()

container.bind<IUserRepository>(INTERFACE_TYPES.UserRepository).to(UserRepository)
container.bind<IOrganizationRepository>(INTERFACE_TYPES.OrganizatonRepository).to(organizationRepository)
container.bind<IInvitationRepository >(INTERFACE_TYPES.invitationRepository).to(InvitationRepository)
container.bind<IEmployeeRepository>(INTERFACE_TYPES.EmployeeRepository).to(EmployeeRepository)
container.bind<IRefreshTokenRepository>(INTERFACE_TYPES.RefreshTokenRepository).to(refreshTokenRepository)

container.bind<IUserInteractor>(INTERFACE_TYPES.UserInteractor).to(UserInteractors)
container.bind<IAdminInteractor>(INTERFACE_TYPES.AdminInteractor).to(AdminInteractor)
container.bind<IEmployeeInteractor>(INTERFACE_TYPES.EmployeeInteractor).to(EmployeeInteractor)

container.bind<IUserController>(INTERFACE_TYPES.UserController).to(userAuthController);
container.bind<IGoogleAuthService>(INTERFACE_TYPES.GoogleAuthService).to(GoogleAuthService);
container.bind<IEmployeeController>(INTERFACE_TYPES.EmployeeController).to(EmployeeAuthController);
container.bind<IAdminController>(INTERFACE_TYPES.AdminController).to(adminAuthController);

container.bind<IOtpRepository>(INTERFACE_TYPES.OtpRepository).to(OtpRepository)
container.bind<IJwt>(INTERFACE_TYPES.jwt).to(Jwt)
container.bind<IEmailService>(INTERFACE_TYPES.NodeMailerService).to(NodeMailerService)
container.bind<any>(INTERFACE_TYPES.Auth).to(Auth)


export default container 