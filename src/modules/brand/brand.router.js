import { Router } from "express";
const router = Router()
import * as brandController from './brand.controller.js'
import * as brandSchema from './brand.schema.js'
import { validation } from '../../middleware/validation.js'
import { isAuthenticated } from './../../middleware/authentication.js';
import { isAuthorized } from './../../middleware/authorization.js';
import { fileUpload, fileValidation } from "../../utils/multer.cloud.js";

//createBrand
router.post("/" ,
    isAuthenticated ,
    isAuthorized("admin") ,
    fileUpload(fileValidation.image).single("brand") ,
    validation(brandSchema.createBrand) ,
    brandController.createBrand
)

//updateBrand
router.put("/:id" ,
    isAuthenticated ,
    isAuthorized("admin") ,
    fileUpload(fileValidation.image).single("brand") ,
    validation(brandSchema.updateBrand) ,
    brandController.updateBrand
)

//deleteBrand
router.delete("/:id" ,
    isAuthenticated ,
    isAuthorized("admin") ,
    fileUpload(fileValidation.image).single("brand") ,
    validation(brandSchema.deleteBrand) ,
    brandController.deleteBrand
)

 //getAllBrands
 router.get("/", brandController.getAllBrands);


export default router
