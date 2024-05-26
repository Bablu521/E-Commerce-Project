import joi from 'joi'
import { validObjectId } from '../../middleware/validation.js'

//addReview
export const addReview = joi.object({
    productId:joi.string().custom(validObjectId).required(),
    rating:joi.number().integer().min(1).max(5).required(),
    comment:joi.string().required()
}).required()

//updateReview
export const updateReview = joi.object({
    id : joi.string().custom(validObjectId).required(),
    productId:joi.string().custom(validObjectId).required(),
    rating:joi.number().integer().min(1).max(5),
    comment:joi.string()
}).required()