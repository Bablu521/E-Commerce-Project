import { Router } from "express";
import * as subcategoryController from './subcategory.controller.js'
import * as subcategorySchema from './subcategory.schema.js'
import { validation } from "../../middleware/validation.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from './../../middleware/authorization.js';
import { fileUpload, fileValidation } from "../../utils/multer.cloud.js";
//mergingParams
const router = Router ({mergeParams:true})

//createSubcategory
router.post("/",
    isAuthenticated ,
    isAuthorized("admin") , 
    fileUpload(fileValidation.image).single("subcategory") ,
    validation(subcategorySchema.createSubcategory) ,
    subcategoryController.createSubcategory
)


//updateSubcategory
router.put("/:id",
    isAuthenticated ,
    isAuthorized("admin") , 
    fileUpload(fileValidation.image).single("subcategory") ,
    validation(subcategorySchema.updateSubcategory) ,
    subcategoryController.updateSubcategory
)

//deleteSubcategory
router.delete("/:id",
    isAuthenticated ,
    isAuthorized("admin") , 
    fileUpload(fileValidation.image).single("subcategory") ,
    validation(subcategorySchema.deleteSubcategory) ,
    subcategoryController.deleteSubcategory
)

//getAllSubcategories
router.get("/" , subcategoryController.getAllSubcategories)


export default router