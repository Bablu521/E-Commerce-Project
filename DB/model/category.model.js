import mongoose , {Schema , model ,Types} from "mongoose";
import subcategoryModel from "./subcategory.model.js";

const categorySchema = new Schema ({
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
    } ,
    brands : [{ type:Types.ObjectId , ref : "Brand" }]

},{timestamps:true , toJSON : {virtuals:true} , toObject : {virtuals:true} } )


categorySchema.post(
    "deleteOne" ,
    {document:true , query:false},
    async function(){
        await subcategoryModel.findByIdAndDelete({categoryId:this._id})
    }
)

//virtualPopulate
categorySchema.virtual ("subcategory" , 
    {
        ref : "Subcategory" ,
        localField : "_id" ,
        foreignField : "categoryId"
    }
)

const categoryModel = mongoose.models.Category || model("Category" , categorySchema)

export default categoryModel
