
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

const container = new Container()

container.bind<IUserRepository>(INTERFACE_TYPES.UserRepository).to(UserRepository)
container.bind<IEmployeeRepository>(INTERFACE_TYPES.EmployeeRepository).to(EmployeeRepository)

container.bind<IUserInteractor>(INTERFACE_TYPES.UserInteractor).to(UserInteractors)
container.bind<IAdminInteractor>(INTERFACE_TYPES.AdminInteractor).to(AdminInteractor)
container.bind<IUserInteractor>(INTERFACE_TYPES.EmployeeInteractor).to(EmployeeInteractor)

container.bind<IUserController>(INTERFACE_TYPES.UserController).to(userAuthController);
container.bind<IEmployeeController>(INTERFACE_TYPES.EmployeeController).to(EmployeeAuthController);

container.bind<IOtpRepository>(INTERFACE_TYPES.OtpRepository).to(OtpRepository)
container.bind<IJwt>(INTERFACE_TYPES.jwt).to(Jwt)
container.bind<IEmailService>(INTERFACE_TYPES.NodeMailerService).to(NodeMailerService)



export default container 