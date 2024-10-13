

import express from "express";
import container from "../util/inversify";
import IUserController from "../interfaces/IUserController";
import INTERFACE_TYPES from "../constants/inversify";
import IEmployeeController from "../interfaces/IEmployeeController";

const router= express.Router()

const userController = container.get<IUserController>(INTERFACE_TYPES.UserController)
const employeeController=container.get<IEmployeeController>(INTERFACE_TYPES.EmployeeController)

router.post('/userLogin',userController.loginHandler.bind(userController))
router.post('/userRegister',userController.registerHandler.bind(userController))
router.post('/otp',userController.verifyOtpHandler.bind(userController))

router.post('/employeeLogin',employeeController.loginHandler.bind(employeeController))
router.post('/employeeRegister',employeeController.registerHandler.bind(employeeController))
router.post('/otp',employeeController.verifyOtpHandler.bind(employeeController))


export default router