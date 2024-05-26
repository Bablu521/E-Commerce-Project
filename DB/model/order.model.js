import mongoose , { Schema , model , Types } from "mongoose";

const orderSchema = new Schema ({
    userId : { type : Types.ObjectId , ref : "User" , required : true } ,
    products : [{
        productId : { type : Types.ObjectId , ref : "Product" } ,
        quantity : {type : Number , min : 1 } ,
        name : String  ,
        itemPrice : Number ,
        totalPrice : Number
    }] ,
    phone : { type : String , required : true} ,
    address : { type : String , required : true } ,
    payment : { type : String , enum : ["cash" , "visa"] , default : "cash"  } ,
    status : { type : String , enum : ["placed" , "shipped" , "cancelled" , "delivered" , "refunded" , "visa paid" , "failed to pay"] , default : "placed" } ,
    price : { type : Number , required :true } ,
    invoice : { url : String , id : String } ,
    coupon : { 
        id : { type : Types.ObjectId , ref : "Coupon" } ,
        name : { type : String } ,
        discount : { type : Number ,  min : 1 , max : 100} , 
    } 
    
},{timestamps: true , toJSON:{virtuals : true} , toObject:{virtuals : true}})

orderSchema.virtual("finalPrice").get(function(){
    return this.coupon ? Number.parseFloat (
        this.price - (this.price * this.coupon.discount)/100
    ).toFixed(2) : this.price
})

const orderModel = mongoose.models.Order || model("Order" , orderSchema)

export default orderModel