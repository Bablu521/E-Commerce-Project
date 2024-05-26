import { Router } from "express";
const router = Router()
import * as authController from './auth.controller.js'
import { validation } from "../../middleware/validation.js";
import * as authSchema from "./auth.schema.js"
import { isAuthenticated } from './../../middleware/authentication.js';

//signup
router.post ("/signup" , validation(authSchema.signup) ,  authController.signup)

//activate_account
router.get ("/activate_account/:token" , validation(authSchema.activate_account) , authController.activate_account)

//login
router.get ("/login" , validation(authSchema.login) ,  authController.login)

//forgetCode
router.patch ("/forgetCode" , validation(authSchema.forgetCode) ,  authController.forgetCode)

//resetPassword
router.patch ("/resetPassword" , validation(authSchema.resetPassword) ,  authController.resetPassword)

//getAllUsers
router.get("/getAllUsers" , isAuthenticated , authController.getAllUsers)

export default router