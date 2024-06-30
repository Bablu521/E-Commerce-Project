import joi from "joi"
import { validObjectId } from './../../middleware/validation.js';

//createOrder
export const createOrder = joi.object({
    phone: joi.string().required(),
    address: joi.string().required(),
    payment: joi.string().valid("cash", "visa").required(),
    coupon: joi.string().length(5)
}).required()


//cancelOrder
export const cancelOrder = joi.object({
    id: joi.string().custom(validObjectId).required()
}).required()