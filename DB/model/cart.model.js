import mongoose , {Schema , model , Types} from "mongoose";

const cartSchema = new Schema ({
   products : [
    { productId : { type : Types.ObjectId , ref : "Product"} , 
      quantity : { type : Number , default : 1 } , }
   ] ,
   userId : { type :Types.ObjectId , ref : "User" , required : true , unique : true}
},{timestamps : true})

const cartModel = mongoose.models.Cart || model ("Cart" , cartSchema)

export default cartModel