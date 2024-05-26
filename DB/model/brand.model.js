import mongoose , {Schema , model , Types} from "mongoose";

const brandSchema = new Schema ({
    name : {
        type : String ,
        unique : true ,
        required :true ,
        lowercase : true , 
        min : 2 ,
        max : 20
    } , 
    slug :{
        type : String ,
        unique : true ,
        required :true ,
        lowercase : true 
    } , 
    image:{ url:{type:String , required :true}, id:{type:String , required :true} } ,
    createdBy : {
        type : Types.ObjectId ,
        ref : "User" ,
        required : true
    }
},{timestamps:true})

const brandModel = mongoose.models.Brand || model("Brand" , brandSchema)

export default brandModel