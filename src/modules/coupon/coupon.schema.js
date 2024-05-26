import joi from 'joi';

//createCoupon
export const createCoupon = joi .object({
    discount : joi.number().integer().options({convert:false}).min(1).max(100).required() ,
    expiredAt : joi.date().greater(Date.now()).required() ,
}).required()


//updateCoupon
export const updateCoupon = joi.object({
    name : joi.string().length(5).required() ,
    discount : joi.number().integer().options({convert:false}).min(1).max(100).required() ,
    expiredAt : joi.date().greater(Date.now()).required()
}).required()

////deleteCoupon
export const deleteCoupon = joi.object({
    name : joi.string().length(5).required()
}).required()