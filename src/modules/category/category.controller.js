import { asyncHandler } from './../../utils/errorHandling.js';
import cloudinary from './../../utils/cloudinary.js';
import categoryModel from '../../../DB/model/category.model.js';
import slugify from 'slugify';


//createCategory
export const createCategory = asyncHandler(async(req,res,next)=>{
    if (!req.file){
        return next (new Error("Category Image is Required" , {cause:404}))
    }
const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path , {folder:`${process.env.CLOUD_FOLDER_NAME}/category`})
const checkCategoryName = await categoryModel.findOne({name:req.body.name})
if (checkCategoryName){
    return next (new Error("Category already Exist" , {cause:400}))
}
const category = await categoryModel.create({
    name : req.body.name , 
    slug : slugify(req.body.name) , 
    image : {url:secure_url , id:public_id} ,
    createdBy : req.user._id
})
return res.status(201).json({message:"Done" , category})
})


//updateCategory
export const updateCategory = asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const category = await categoryModel.findById(id)
    if (!category){
        return next (new Error("Category Not Found" , {cause:404}))
    }
    if(req.user._id.toString() != category.createdBy.toString()){
        return next (new Error("You Are Not Allowed To Update Category" , {cause:403})) 
    }
    if (req.file){
        const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path , {public_id:category.image.id})
        category.image = {url:secure_url , id:public_id}
    }
    category.name = req.body.name? req.body.name : category.name
    category.slug = req.body.name? slugify(req.body.name) : category.slug
    await category.save()
    return res.status(200).json({message:"Done" , category})
})

//deleteCategory
export const deleteCategory =asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const category = await categoryModel.findById(id)
    if (!category){
        return next (new Error("Category Not Found" , {cause:404}))
    }
    if (category.createdBy.toString() != req.user._id.toString()){
        return next (new Error("You Are Not Allowed To Delete Category" , {cause:403})) 
    }
    await category.deleteOne();
    await cloudinary.uploader.destroy(category.image.id)
    return res.status(200).json({message:"Done" })
})


//getAllCategories
export const getAllCategories = asyncHandler(async(req,res,next)=>{
    const categories = await categoryModel.find({}).populate("subcategory")
    return res.status(200).json({message:"Done" , categories})
})
