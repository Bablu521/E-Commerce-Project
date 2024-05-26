import { asyncHandler } from './../../utils/errorHandling.js';
import voucher_codes from "voucher-code-generator"
import couponModel from './../../../DB/model/coupon.model.js';

//createCoupon
export const createCoupon = asyncHandler(async(req,res,next)=>{
    const { discount , expiredAt } = req.body
    const code = voucher_codes.generate({ length: 5});
    const coupon = await couponModel.create({
        name: code[0] ,
        discount ,
        expiredAt ,
        createdBy : req.user._id
    });
    return res.status(201).json({message:"Done" , coupon})
})


//updateCoupon
export const updateCoupon = asyncHandler(async(req,res,next)=>{
    const {name} = req.params
    const coupon = await couponModel.findOne({name})
    if (!coupon){
        return next (new Error("Coupon Not Found" , {cause:404}))
    }
    if (req.user._id.toString() != coupon.createdBy.toString()) {
        return next (new Error("You Are Not Allowed To Update Coupon" , {cause:403}))
    }
    coupon.discount = req.body.discount ? req.body.discount : coupon.discount
    coupon.expiredAt = req.body.expiredAt ? req.body.expiredAt : coupon.expiredAt
    await coupon.save()
    return res.status(200).json({message:"Done" , coupon})
})


//deleteCoupon
export const deleteCoupon = asyncHandler(async(req,res,next)=>{
    const {name} = req.params
    const coupon = await couponModel.findOne({name})
    if (!coupon){
        return next (new Error("Coupon Not Found" , {cause:404}))
    }
    if (req.user._id.toString() != coupon.createdBy.toString()) {
        return next (new Error("You Are Not Allowed To Delete Coupon" , {cause:403}))
    }
    await coupon.deleteOne()
    return res.status(200).json({message:"Done"})
})

//getAllCoupons
export const getAllCoupons = asyncHandler(async(req,res,next)=>{
    if (req.user.role == "admin"){
        const coupons = await couponModel.find()
        return res.status(200).json({message:"Done" , coupons})
        
    }
    if (req.user.role == "seller"){
        const coupons = await couponModel.find({createdBy:req.user._id}).populate([
            {
                path : "createdBy" ,
                select : "userName email role"
            }
        ])
        return res.status(200).json({message:"Done" , coupons})
    }
})