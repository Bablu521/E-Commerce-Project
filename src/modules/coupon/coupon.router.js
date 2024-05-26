import { Router } from "express";
const router = Router()
import * as couponController from './coupon.controller.js'
import * as couponSchema from './coupon.schema.js'
import { validation } from '../../middleware/validation.js'
import { isAuthenticated } from './../../middleware/authentication.js';
import { isAuthorized } from './../../middleware/authorization.js';

//createCoupon
router.post("/" ,
    isAuthenticated ,
    isAuthorized("seller") ,
    validation(couponSchema.createCoupon) ,
    couponController.createCoupon
)

//updateCoupon
router.put("/:name" ,
    isAuthenticated ,
    isAuthorized("seller") ,
    validation(couponSchema.updateCoupon) ,
    couponController.updateCoupon
)

//deleteCoupon
router.delete("/:name" ,
    isAuthenticated ,
    isAuthorized("seller") ,
    validation(couponSchema.deleteCoupon) ,
    couponController.deleteCoupon
)


//getAllCoupons
router.get("/" ,
    isAuthenticated ,
    isAuthorized("seller" , "admin") ,
    couponController.getAllCoupons
)


export default router