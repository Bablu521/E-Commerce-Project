import { Router } from "express";
const router = Router()
import * as orderController from "./order.controller.js"
import * as orderSchema from "./order.schema.js"
import { validation } from "../../middleware/validation.js";
import { fileUpload , fileValidation } from "../../utils/multer.cloud.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";

//createOrder
router.post("/" ,
    isAuthenticated ,
    isAuthorized ("user") ,
    validation(orderSchema.createOrder) ,
    orderController.createOrder
)


//cancelOrder
router.patch("/:id" ,
    isAuthenticated ,
    isAuthorized ("user") ,
    validation(orderSchema.cancelOrder) ,
    orderController.cancelOrder
)

export default router