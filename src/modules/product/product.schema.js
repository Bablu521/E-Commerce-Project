import joi from "joi"
import { validObjectId } from './../../middleware/validation.js';


//createProduct
export const createProduct = joi.object({
    name : joi.string().min(3).max(20).required(),
    description : joi.string().min(10).max(200) ,
    availableItems : joi.number().integer().min(1).required() ,
    price :  joi.number().integer().min(1).required() ,
    discount : joi.number().integer().min(1).max(100) ,
    soldItems : joi.number().integer().min(0) ,
    categoryId : joi.string().custom(validObjectId).required() ,
    subcategoryId : joi.string().custom(validObjectId).required() ,
    brandId : joi.string().custom(validObjectId).required() 
}).required()


//updateProduct
export const updateProduct = joi.object({
    id : joi.string().custom(validObjectId).required() ,
    name : joi.string().min(3).max(20),
    description : joi.string().min(10).max(200) ,
    availableItems : joi.number().integer().min(1) ,
    price :  joi.number().integer().min(1) ,
    discount : joi.number().integer().min(1).max(100) ,
    soldItems : joi.number().integer().min(0) 
}).required()

//deleteProduct
export const deleteProduct = joi.object({
    id : joi.string().custom(validObjectId).required()
}).required()

