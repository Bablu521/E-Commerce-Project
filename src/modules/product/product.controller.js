import { asyncHandler } from "../../utils/errorHandling.js";
import subcategoryModel from './../../../DB/model/subcategory.model.js';
import brandModel from './../../../DB/model/brand.model.js';
import { nanoid } from 'nanoid';
import cloudinary from './../../utils/cloudinary.js';
import productModel from "../../../DB/model/product.model.js";



//createProduct
export const createProduct = asyncHandler(async(req,res,next)=>{
    const subcategory = await subcategoryModel.findOne({_id:req.body.subcategoryId , categoryId:req.body.categoryId})
    if (! subcategory){
        return next (new Error("Subcategory or Category Not Found" , {status:404}))
    }
    const brand = await brandModel.findById(req.body.brandId)
    if (! brand){
        return next (new Error("Brand Not Found" , {status:404}))
    }
    if (! req.files){
        return next (new Error("Product Images are Required" , {status:404}))
    }
    const cloudFolder = nanoid()
    let subImages = []
    for (const file of req.files.subImages){
        const {secure_url , public_id} = await cloudinary.uploader.upload(
            file.path , {folder:`${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}/subImages`})
    subImages.push({url:secure_url , id:public_id})        
    }
    const {secure_url , public_id} = await cloudinary.uploader.upload(req.files.defaultImage[0].path , {folder:`${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}/defaultImage`})
    const product = await productModel.create({
        ...req.body ,
        subImages,
        defaultImage : {url:secure_url, id:public_id},
        cloudFolder,
        createdBy : req.user._id
    })
    console.log(product.finalPrice)
    return res.status(201).json({message:"Done" , product})
})


//updateProduct
export const updateProduct = asyncHandler(async(req,res,next)=>{
    const product = await productModel.findById(req.params.id)
    if (! product){
        return next (new Error("Product Not Found" , {status:404}))
    }
    if (req.user._id.toString() != product.createdBy.toString()){
        return next (new Error("You Are Not Allowed To Update Product" , {status:403}))
    }
    if (req.files){


        if (!req.body.subImages) {
            req.body.subImages = [];
        }
        for (const file of req.files.subImages){
            const {secure_url , public_id} = await cloudinary.uploader.upload(
                file.path , {folder:`${process.env.CLOUD_FOLDER_NAME}/products/${product.cloudFolder}/subImages`})
                
                const oldIds = product.subImages.map((subImage)=>{
                    return subImage.id
                })
            await cloudinary.api.delete_resources(oldIds)
            req.body.subImages.push({ url: secure_url, id: public_id })
             
            }
        const {secure_url , public_id} = await cloudinary.uploader.upload(
            req.files.defaultImage[0].path , {public_id:product.defaultImage.id})
            
            product.defaultImage = {url:secure_url, id:public_id}
    }
    
    product.name = req.body.name? req.body.name : product.name
    product.description = req.body.description? req.body.description : product.description
    product.availableItems = req.body.availableItems? req.body.availableItems : product.availableItems
    product.price = req.body.price? req.body.price : product.price
    product.discount = req.body.discount? req.body.discount : product.discount
    product.soldItems = req.body.soldItems? req.body.soldItems : product.soldItems

    await product.save()
    return res.status(200).json({message:"Done" , product})
})


//deleteProduct
export const deleteProduct = asyncHandler(async(req,res,next)=>{
    const product = await productModel.findById(req.params.id)
    if (! product){
        return next (new Error("Product Not Found" , {status:404}))
    }
    if (req.user._id.toString() != product.createdBy.toString()){
        return next (new Error("You Are Not Allowed To Delete Product" , {status:403}))
    }
    await product.deleteOne()
    const ids = product.subImages.map((subImage)=>{
        return subImage.id
    })
    ids.push(product.defaultImage.id)
    await cloudinary.api.delete_resources(ids)
    await cloudinary.api.delete_folder(`${process.env.CLOUD_FOLDER_NAME}/products/${product.cloudFolder}`)
    return res.status(200).json({message:"Done"})
})


//getAllProducts
export const getAllProducts = asyncHandler(async(req,res,next)=>{
    const { sort , page , keyword , categoryId , subcategoryId , brandId } = req.query
    const subcategory = await subcategoryModel.findOne({_id:req.query.subcategoryId , categoryId:req.query.categoryId})
    if (! subcategory){
        return next (new Error("Subcategory or Category Not Found" , {status:404}))
    }
    const brand = await brandModel.findOne({_id:req.query.brandId})
    if (! brand){
        return next (new Error("Brand Not Found" , {status:404}))
    }
    const products = await productModel.find({...req.query}).sort(sort).paginate(page).search(keyword)
    return res.status(200).json({message:"Done" , products })
})