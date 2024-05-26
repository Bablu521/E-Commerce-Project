import { asyncHandler } from './../../utils/errorHandling.js';
import categoryModel from './../../../DB/model/category.model.js';
import cloudinary from './../../utils/cloudinary.js';
import brandModel from './../../../DB/model/brand.model.js';
import slugify from 'slugify';

//createBrand
export const createBrand = asyncHandler(async(req,res,next)=>{
    const {categories , name} = req.body
    categories.forEach(async(categoryId)=>{
        const category = await categoryModel.findById(categoryId)
        if (!category){
            return next (new Error("Category Not Found" , {status:404}))
        }
    })
    if (!req.file){
        return next (new Error("Brand Image is Required" , {status:404}))
    }
    const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path , {folder:`${process.env.CLOUD_FOLDER_NAME}/brands`})
    const checkBrandName = await brandModel.findOne({name:req.body.name})
    if (checkBrandName){
        return next (new Error("Brand Already Exist" , {status:409}))
    }
    const brand = await brandModel.create({
        name ,
        slug : slugify(name) ,
        image : {url:secure_url , id:public_id} ,
        createdBy : req.user._id
    })
    categories.forEach(async(categoryId)=>{
        await categoryModel.findByIdAndUpdate({_id:categoryId}, {
            $push : { brands : brand._id}
        })
    })
    return res.status(201).json({message:"Done" , brand})
})

//updateBrand
export const updateBrand = asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const brand = await brandModel.findById(id)
    if (!brand){
        return next (new Error("Brand Not Found" , {cause:404}))
    }
    if (req.file){
        const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path , {public_id:brand.image.id})
        brand.image = {url:secure_url , id:public_id}
    }
    brand.name = req.body.name ? req.body.name : brand.name
    brand.slug =req.body.name ? slugify(req.body.name) : brand.slug
    await brand.save()
    return res.status(200).json({message:"Done" , brand})
})


//deleteBrand
export const deleteBrand = asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const brand = await brandModel.findByIdAndDelete(id)
    if (!brand){
        return next (new Error("Brand Not Found" , {cause:404}))
    }
    await cloudinary.uploader.destroy(brand.image.id)
    await categoryModel.updateMany({},{
        $pull : {brands : brand._id}
    })
    return res.status(200).json({message:"Done", brand})
})


//getAllBrands
export const getAllBrands = asyncHandler(async(req,res,next)=>{
    const brands = await brandModel.find().populate([
        {  
            path : "createdBy" ,
            select : "userName email"
        }
    ])
    return res.status(200).json({message:"Done" , brands})
})