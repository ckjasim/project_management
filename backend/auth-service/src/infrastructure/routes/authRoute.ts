import express from "express";
import container from "../util/inversify";
import IUserController from "../interfaces/IUserController";
import IEmployeeController from "../interfaces/IEmployeeController";
import INTERFACE_TYPES from "../constants/inversify";
import IGoogleAuthService from "../interfaces/IGoogleAuthService";
import { employeeLoginValidation, employeeRegisterValidation, loginValidation, registerValidation } from "../middleware/validationMiddleware";
import IAdminController from "../interfaces/IAdminController";

const router = express.Router();


const userController = container.get<IUserController>(INTERFACE_TYPES.UserController);
const employeeController = container.get<IEmployeeController>(INTERFACE_TYPES.EmployeeController);
const adminController = container.get<IAdminController>(INTERFACE_TYPES.AdminController);
const googleAuthService = container.get<IGoogleAuthService>(INTERFACE_TYPES.GoogleAuthService);




router.post('/userLogin', loginValidation, userController.loginHandler.bind(userController));
router.post('/userRegister', registerValidation, userController.registerHandler.bind(userController));
router.post('/otp', userController.verifyOtpHandler.bind(userController));
router.post('/resendOtp', userController.resendOtp.bind(userController));
router.post('/refresh', userController.refreshToken.bind(userController));
router.post('/role', userController.authRole.bind(userController));
router.post('/Logout', userController.logoutHandler.bind(userController));


router.post('/employeeInvitation', employeeController.employeeInvitation.bind(employeeController));
router.post('/verifyInvitation', employeeController.verifyInvitationHandler.bind(employeeController));
router.post('/employeeLogin', employeeController.loginHandler.bind(employeeController));
router.post('/employeeRegister', employeeRegisterValidation, employeeController.registerHandler.bind(employeeController));
router.post('/employeeOtp', employeeController.verifyOtpHandler.bind(employeeController));
router.post('/resendEmpOtp', employeeController.resendOtp.bind(employeeController));
router.get('/employeesByOrg', employeeController.employeeByOrganization.bind(employeeController));



router.post('/adminLogin', adminController.loginHandler.bind(adminController));
router.get('/usersList', adminController.getAllUsers.bind(adminController));
router.get('/employeesList', adminController.getAllEmployees.bind(adminController));
router.post('/userManage', adminController.manageUser.bind(adminController));
router.post('/employeeManage', adminController.manageEmployee.bind(adminController));


router.get('/google', googleAuthService.googleAuth()); 
router.get('/google/callback', googleAuthService.googleCallback()); 
export default router;
