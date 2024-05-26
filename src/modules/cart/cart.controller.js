import { asyncHandler } from './../../utils/errorHandling.js';
import productModel from './../../../DB/model/product.model.js';
import cartModel from './../../../DB/model/cart.model.js';

//addToCart
export const addToCart = asyncHandler(async(req,res,next)=>{
    const {productId , quantity} = req.body
    const product = await productModel.findById(productId)
    if (! product){
        return next (new Error("Product Not Found" , {status:404}))
    }
    if (! product.inStock(quantity)){
        return next (new Error(`sorry only ${product.availableItems} Items are Available`))
    }

    const productInCart = await cartModel.findOne({userId:req.user._id , "products.productId":productId})
    if (productInCart){
        const isProduct = productInCart.products.find((prod)=>prod.productId.toString() == productId.toString())
        if (product.inStock(isProduct.quantity + quantity)){
            isProduct.quantity = isProduct.quantity + quantity
            await productInCart.save()
            return res.status(201).json({message:"Done", productInCart})
        } else {
        return next(new Error(`sorry only ${product.availableItems} Items are Available`))
    }
    }
    const cart = await cartModel.findOneAndUpdate({userId:req.user._id} ,
         {$push : {products :{ productId , quantity}}
    })
    return res.status(201).json({message:"Done" , cart})
})


//getUserCart
export const getUserCart = asyncHandler(async(req,res,next)=>{
    if(req.user.role == "user"){
        const cart = await cartModel.findOne({userId:req.user._id})
        return res.status(200).json({message:"Done", cart})
    }
    if(req.user.role == "admin" && ! req.body.cartId){
        return next(new Error("cartId is required" , {cause:404}))
    }
    const cart =  await cartModel.findById(req.body.cartId)
    return res.status(200).json({message:"Done", cart})
})


//updateCart
export const updateCart = asyncHandler(async(req,res,next)=>{
    const {productId , quantity} = req.body
    const product = await productModel.findById(productId)
    if (! product){
        return next (new Error("Product Not Found" , {status:404}))
    }
    if (! product.inStock(quantity)){
        return next (new Error(`sorry only ${product.availableItems} Items are Available`))
    }
    const cart = await cartModel.findOneAndUpdate({userId:req.user._id , "products.productId":productId} , 
    {"products.$.quantity" : quantity} , {new:true})
    return res.status(200).json({message:"Done", cart})
})


//removeFromCart
export const removeFromCart = asyncHandler(async(req,res,next)=>{
    const {productId} = req.body
    const product = await productModel.findById(productId)
    if (! product){
        return next (new Error("Product Not Found" , {status:404}))
    }
    const cart = await cartModel.findOneAndUpdate({userId : req.user._id} , 
        {$pull : { products : {productId}} } , {new:true}) 
    return res.status(200).json({message:"Done", cart})
})


//clearCart
export const clearCart = asyncHandler(async(req,res,next)=>{
    const cart = await cartModel.findOneAndUpdate({ userId : req.user._id} , 
        { products : []} , {new:true})
    return res.status(200).json({message:"Done", cart})
})