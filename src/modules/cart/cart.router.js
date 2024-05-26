import { Router } from "express";
const router = Router ()
import * as cartController from "./cart.controller.js"
import * as cartSchema from "./cart.schema.js"
import { validation } from "../../middleware/validation.js"
import { isAuthenticated } from './../../middleware/authentication.js';
import { isAuthorized } from './../../middleware/authorization.js';

//addToCart
router.post("/",
    isAuthenticated ,
    isAuthorized("user") ,
    validation(cartSchema.addToCart) ,
    cartController.addToCart
)

//getUserCart
router.get("/",
    isAuthenticated ,
    isAuthorized("user" , "admin") ,
    validation(cartSchema.getUserCart) ,
    cartController.getUserCart
)


//updateCart
router.patch("/",
    isAuthenticated ,
    isAuthorized("user") ,
    validation(cartSchema.updateCart) ,
    cartController.updateCart
)

//removeFromCart
router.put("/",
    isAuthenticated ,
    isAuthorized("user") ,
    validation(cartSchema.removeFromCart) ,
    cartController.removeFromCart
)


//clearCart
router.put("/clearCart",
    isAuthenticated ,
    isAuthorized("user") ,
    cartController.clearCart
)

export default router