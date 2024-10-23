import express from "express";
import container from "../util/inversify";
import IUserController from "../interfaces/IUserController";
import IEmployeeController from "../interfaces/IEmployeeController";
import INTERFACE_TYPES from "../constants/inversify";
import { GoogleAuthService } from "../util/passport";
import IGoogleAuthService from "../interfaces/IGoogleAuthService";
import { employeeLoginValidation, employeeRegisterValidation, loginValidation, registerValidation } from "../middleware/validationMiddleware";
import IAdminController from "../interfaces/IAdminController";

const router = express.Router();

// Controllers
const userController = container.get<IUserController>(INTERFACE_TYPES.UserController);
const employeeController = container.get<IEmployeeController>(INTERFACE_TYPES.EmployeeController);
const adminController = container.get<IAdminController>(INTERFACE_TYPES.AdminController);

// Google Authentication Service
const googleAuthService = container.get<IGoogleAuthService>(INTERFACE_TYPES.GoogleAuthService);

// User routes
router.post('/userLogin',loginValidation, userController.loginHandler.bind(userController));
router.post('/userRegister',registerValidation, userController.registerHandler.bind(userController));
router.post('/otp', userController.verifyOtpHandler.bind(userController));
router.post('/resendOtp', userController.resendOtp.bind(userController));

router.post('/refresh', userController.refreshToken.bind(userController));

// Employee routes
router.post('/employeeLogin',employeeLoginValidation, employeeController.loginHandler.bind(employeeController));
router.post('/employeeRegister',employeeRegisterValidation, employeeController.registerHandler.bind(employeeController));
router.post('/employeeOtp', employeeController.verifyOtpHandler.bind(employeeController));
router.post('/resendEmpOtp', employeeController.resendOtp.bind(employeeController));


router.post('/admin',loginValidation,adminController.loginHandler.bind(adminController))

router.get('/google', googleAuthService.googleAuth.bind(googleAuthService)); 
router.get('/google/callback', googleAuthService.googleCallback.bind(googleAuthService));

export default router;
