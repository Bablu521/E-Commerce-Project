import joi from "joi"
import { validObjectId } from './../../middleware/validation.js';


//addToCart
export const addToCart = joi.object({
    productId:joi.string().custom(validObjectId).required(),
    quantity:joi.number().integer().min(1).required()
}).required()

//getUserCart
export const getUserCart = joi.object({
    cartId:joi.string().custom(validObjectId)
}).required()

//updateCart
export const updateCart = joi.object({
    productId:joi.string().custom(validObjectId).required(),
    quantity:joi.number().integer().min(1).required()
}).required()

//removeFromCart
export const removeFromCart = joi.object({
    productId:joi.string().custom(validObjectId).required()
}).required()