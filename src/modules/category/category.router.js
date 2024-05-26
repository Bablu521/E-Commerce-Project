import { Router } from "express";
const router = Router()
import * as categoryController from './category.controller.js'
import * as categorySchema from './category.schema.js'
import { validation } from "../../middleware/validation.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from './../../middleware/authorization.js';
import { fileUpload, fileValidation } from "../../utils/multer.cloud.js";
import subcategoryRouter from "../subcategory/subcategory.router.js"


router.use("/:categoryId/subcategory" , subcategoryRouter)

//createCategory
router.post("/" ,
  isAuthenticated ,
  isAuthorized("admin") ,
  fileUpload(fileValidation.image).single("category") ,
  validation(categorySchema.createCategory) ,
  categoryController.createCategory)

  //updateCategory
  router.put("/:id" ,
  isAuthenticated ,
  isAuthorized("admin") ,
  fileUpload(fileValidation.image).single("category") ,
  validation(categorySchema.updateCategory) ,
  categoryController.updateCategory)

  //deleteCategory
  router.delete("/:id" ,
  isAuthenticated ,
  isAuthorized("admin") ,
  fileUpload(fileValidation.image).single("category") ,
  validation(categorySchema.deleteCategory) ,
  categoryController.deleteCategory)

  //getAllCategories
router.get("/", categoryController.getAllCategories);



export default router
