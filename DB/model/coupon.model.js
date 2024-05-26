import mongoose , {Schema , model , Types} from "mongoose";

const couponSchema = new Schema ({
    name : {
        type : String ,
        unique : true ,
        required :true ,
    } , 
    discount : {
        type : Number ,
        required : true ,
        min : 1 ,
        max : 100
    } ,
    expiredAt : {
        type : Date ,
        required : true 
    } , 
    createdBy : {
        type : Types.ObjectId ,
        ref : "User" ,
        required : true
    }
},{timestamps:true})

const couponModel = mongoose.models.Coupon || model("Coupon" , couponSchema)

export default couponModel