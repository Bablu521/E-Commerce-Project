import { Router } from "express";
const router = Router()
import * as productController from "./product.controller.js"
import * as productSchema from "./product.schema.js"
import { validation } from "../../middleware/validation.js"
import { isAuthenticated } from './../../middleware/authentication.js';
import { isAuthorized } from './../../middleware/authorization.js';
import { fileUpload, fileValidation } from "../../utils/multer.cloud.js";
import reviewRouter from "../review/review.router.js"


router.use ("/:productId/review" , reviewRouter)
//createProduct
router.post("/",
    isAuthenticated,
    isAuthorized("seller"),
    fileUpload(fileValidation.image).fields([
     { name : "defaultImage" , maxCount: 1} ,
     { name : "subImages" , maxCount: 3 }
    ]),
    validation(productSchema.createProduct),
    productController.createProduct
)


//updateProduct
router.put("/:id",
    isAuthenticated,
    isAuthorized("seller"),
    fileUpload(fileValidation.image).fields([
     { name : "defaultImage" , maxCount: 1} ,
     { name : "subImages" , maxCount: 3 }
    ]),
    validation(productSchema.updateProduct),
    productController.updateProduct
)

//deleteProduct
router.delete("/:id",
    isAuthenticated,
    isAuthorized("seller"),
    fileUpload(fileValidation.image).fields([
     { name : "defaultImage" , maxCount: 1} ,
     { name : "subImages" , maxCount: 3 }
    ]),
    validation(productSchema.deleteProduct),
    productController.deleteProduct
)

//getAllProducts
router.get("/", productController.getAllProducts);

export default router