import productModel from "../../../DB/model/product.model.js";
import reviewModel from "../../../DB/model/review.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import orderModel from './../../../DB/model/order.model.js';


//addReview
export const addReview = asyncHandler(async(req , res , next )=>{
    const {productId} =  req.params
    const {rating , comment} = req.body
    const order = await orderModel.findOne({userId : req.user._id , "products.productId" : productId , status : "delivered"})
    if (!order){
        return next (new Error("can't Review This Product" , {cause:404}))
    }
    const checkPreviousReview = await reviewModel.findOne({createdBy : req.user._id ,productId , orderId : order._id})
    if (checkPreviousReview){
        return next (new Error("You have already Reviewed This Product" , {cause:400}))
    }
    const review = await reviewModel.create({
        rating ,
        comment ,
        createdBy : req.user._id,
        productId,
        orderId : order._id
    })
    const product = await productModel.findById(productId)
    const reviews = await reviewModel.find({productId})
    let calcRating = 0
    for (let i = 0 ; i < reviews.length ; i++){
        calcRating += reviews[i].rating
    }
    product.averageRating = calcRating/reviews.length
    await product.save()
    return res.status(201).json({message:"Done" , review})
})

//updateReview
export const updateReview = asyncHandler(async(req , res , next)=>{
    const {productId , id} = req.params
    const review = await reviewModel.findOneAndUpdate({_id:id , productId},{...req.body},{new:true})
    if (req.body.rating){
        const product = await productModel.findById(productId)
        const reviews = await reviewModel.find({productId})
        let calcRating = 0
        for (let i =0 ; i < reviews.length ; i++){
            calcRating += reviews[i].rating
        }
        product.averageRating = calcRating/reviews.length
        await product.save()
        return res.status(200).json({message:"Done", review})
    }
})