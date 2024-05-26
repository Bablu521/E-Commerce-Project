import mongoose , {Schema , model ,Types} from "mongoose";

const subcategorySchema = new Schema ({
    name :{
        type : String , 
        required : true ,
        unique : true ,
        lowercase : true , 
        min : 3 ,
        max : 20
    },
    slug :{
        type : String , 
        required : true ,
        unique : true ,
    },
    image:{ url:{type:String , required :true}, id:{type:String , required :true} },
    createdBy :{
        type:Types.ObjectId ,
        ref:"User" ,
        required : true
    },
    categoryId :{
        type:Types.ObjectId ,
        ref : "Category" ,
        required : true
    }

},{timestamps:true})

const subcategoryModel = mongoose.models.Subcategory || model("Subcategory" , subcategorySchema)

export default subcategoryModel
