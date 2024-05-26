import cartModel from "../../../DB/model/cart.model.js"
import productModel from "../../../DB/model/product.model.js"

export const updateStock = async (products , createOrder)=>{
    if (createOrder){
        for (const product of products){
            await productModel.findByIdAndUpdate(product.productId , {$inc :{
                soldItems : product.quantity , 
                availableItems : - product.quantity
            }})
        }
    }else {
        for (const product of products){
            await productModel.findByIdAndUpdate(product.productId , {$inc: {
                soldItems : - product.quantity , 
                availableItems :  product.quantity
            }})
        }
    }
}

export const clearCart = async (userId)=>{
    await cartModel.findOneAndUpdate({userId} , { products : []})
}