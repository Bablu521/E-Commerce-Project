import mongoose , {Schema , model ,Types} from "mongoose";

const productSchema = new Schema ({
    name : { type : String , required : true , unique : true , min :3 , max : 20} ,
    description : { type : String , min : 10 , max : 200} ,
    subImages : [{url : {type : String , required : true} , id : {type : String , required : true}}] ,
    defaultImage : {url : {type : String , required : true } , id : {type : String , required : true }} ,
    availableItems : { type : Number , required : true , min : 1 } ,
    price : { type : Number , required : true , min : 1 } ,
    discount : {type : Number , min : 1 , max :100 } ,
    soldItems : { type : Number , default : 0 } ,
    createdBy : { type : Types.ObjectId , ref : "User" , required : true } ,
    categoryId : { type : Types.ObjectId , ref : "Category" , required : true } ,
    subcategoryId : { type : Types.ObjectId , ref : "Subcategory" , required : true } ,
    brandId : { type : Types.ObjectId , ref : "Brand" , required : true } , 
    cloudFolder : { type : String , required : true , unique : true } , 
    averageRating : { type : Number , min : 1 , max :5 }
},{timestamps : true , strictQuery: true , toJSON : {virtuals : true} , toObject : {virtuals : true}})

productSchema.virtual("finalPrice").get (function(){
    return Number.parseFloat(
        this.price - (this.price * this.discount || 0) / 100
      ).toFixed(2)
})

productSchema.virtual("review",{
    ref : "Review" ,
    localField : "_id" ,
    foreignField : "productId"
})

// query helper
productSchema.query.paginate = function (page){
    page = page < 1 || isNaN (page) || !page ? 1 : page
    const limit = 2
    const skip = limit * (page - 1)
    return this.skip(skip).limit(limit)
}

// query helper
productSchema.query.search = function (keyword){
    if (keyword) {
        return this .find ({
            $or : [
                { name : {$regex : keyword , $options : "i" }} ,
                {description : {$regex : keyword , $options : "i"}}
            ]
        })
    }
    return this
}

//inStock
productSchema.methods.inStock = function (requiredQuantity){
    return this.availableItems >= requiredQuantity ? true : false
}

const productModel = mongoose.models.Product || model("Product" , productSchema)

export default productModel
