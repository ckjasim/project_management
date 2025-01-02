import express from "express";
import container from "../util/inversify";
import IUserController from "../interfaces/IUserController";
import IEmployeeController from "../interfaces/IEmployeeController";
import INTERFACE_TYPES from "../constants/inversify";
import  { IDriveAuthService, IGoogleAuthService } from "../interfaces/IGoogleAuthService";
import { employeeLoginValidation, employeeRegisterValidation, loginValidation, registerValidation } from "../middleware/validationMiddleware";
import IAdminController from "../interfaces/IAdminController";
import Auth from "../middleware/authMiddleware";

const router = express.Router();


const userController = container.get<IUserController>(INTERFACE_TYPES.UserController);
const employeeController = container.get<IEmployeeController>(INTERFACE_TYPES.EmployeeController);
const adminController = container.get<IAdminController>(INTERFACE_TYPES.AdminController);
const googleAuthService = container.get<IGoogleAuthService>(INTERFACE_TYPES.GoogleAuthService);
const DriveAuthService = container.get<IDriveAuthService>(INTERFACE_TYPES.DriveAuthService);
const auth = container.get<Auth>(INTERFACE_TYPES.Auth); 

const adminAuth = auth.Auth([ 'admin']);  
const userAuth = auth.Auth(['project manager', 'admin']);  
const all = auth.Auth(['project manager', 'admin','employee']);  
  



router.post('/userLogin', loginValidation, userController.loginHandler.bind(userController));
router.post('/userRegister', registerValidation, userController.registerHandler.bind(userController));
router.post('/otp', userController.verifyOtpHandler.bind(userController));
router.post('/resendOtp', userController.resendOtp.bind(userController));
router.post('/refresh', userController.refreshToken.bind(userController));
router.post('/role', userController.authRole.bind(userController));
router.post('/logout', userController.logoutHandler.bind(userController));


router.post('/employeeInvitation',userAuth, employeeController.employeeInvitation.bind(employeeController));
router.post('/verifyInvitation',userAuth, employeeController.verifyInvitationHandler.bind(employeeController));
router.post('/employeeLogin', employeeController.loginHandler.bind(employeeController));
router.post('/employeeRegister', employeeRegisterValidation, employeeController.registerHandler.bind(employeeController));
router.post('/employeeOtp', employeeController.verifyOtpHandler.bind(employeeController));
router.post('/resendEmpOtp', employeeController.resendOtp.bind(employeeController));
router.get('/employeesByOrg',all, employeeController.employeeByOrganization.bind(employeeController));



router.post('/adminLogin', adminController.loginHandler.bind(adminController));
router.get('/usersList',adminAuth, adminController.getAllUsers.bind(adminController));
router.get('/employeesList',adminAuth, adminController.getAllEmployees.bind(adminController));
router.post('/userManage', adminAuth,adminController.manageUser.bind(adminController));
router.post('/employeeManage',adminAuth, adminController.manageEmployee.bind(adminController));

router.post('/updateSubscription',userController.updateSubscriptionHandler.bind(userController));
router.get('/checkPremium',userController.checkPremiumHandler.bind(userController));
router.post('/getAccessToken',userController.getAccessTokenHandler.bind(userController));

router.get('/google', googleAuthService.googleAuth()); 
router.get('/drive', DriveAuthService.driveAuth()); 
router.get('/google/callback', googleAuthService.googleCallback()); 
router.get('/google/driveCallback', DriveAuthService.driveCallback()); 
export default router;
