import mongoose ,{Schema , model , Types} from "mongoose" ;

const reviewSchema = new Schema({
    rating : { type:Number , min : 1 , max : 5 , required :true} ,
    comment : { type : String , required :true } ,
    createdBy : { type : Types.ObjectId , ref : "User" , required :true } ,
    productId : { type : Types.ObjectId , ref : "Product" , required :true } ,
    orderId : { type : Types.ObjectId , ref : "Order" , required : true } ,
},{timestamps : true})

const reviewModel = mongoose.models.Review || model("Review" , reviewSchema)

export default reviewModel

