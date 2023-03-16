import { Router } from "express";
import * as controller from '../controllers/loginController.js';
import * as middleware from '../middlewares/loginMiddleware.js';
import { registerMail } from "../controllers/mailer.js";
const router = Router();

router.route('/register').post(controller.register);
router.route('/registerMail').post(registerMail);
router.route('/authenticate').post(middleware.verifyUser, controller.authenticate);
router.route('/login').post(middleware.verifyUser,controller.login);


router.route('/user/:username').get(controller.getUser);
router.route('/generateOTP').get(middleware.verifyUser,middleware.localVariables,controller.generateOTP);
router.route('/verifyOTP').get(middleware.verifyUser , controller.verifyOTP);
router.route('/createResetSession').get(controller.createResetSession);


router.route('/updateUser').put(middleware.checkAuthorize,controller.updateUser);
router.route('/resetPassword').put(middleware.verifyUser,controller.resetPassword);

export default router;