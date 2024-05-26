import joi from "joi"
import { validObjectId } from "../../middleware/validation.js"

//createSubcategory
export const createSubcategory = joi.object({
    name:joi.string().min(3).max(20).required() ,
    categoryId:joi.string().custom(validObjectId).required()
}).required()

//updateSubcategory
export const updateSubcategory = joi.object({
    name:joi.string().min(3).max(20) ,
    categoryId:joi.string().custom(validObjectId).required() ,
    id:joi.string().custom(validObjectId).required()
}).required()

//deleteSubcategory
export const deleteSubcategory = joi.object({
    categoryId:joi.string().custom(validObjectId).required() ,
    id:joi.string().custom(validObjectId).required()
}).required()

//getAllSubcategories
export const getAllSubcategories = joi.object({
    categoryId:joi.string().custom(validObjectId)
}).required()
