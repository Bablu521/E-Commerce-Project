import categoryModel from '../../../DB/model/category.model.js';
import { asyncHandler } from './../../utils/errorHandling.js';
import cloudinary from './../../utils/cloudinary.js';
import subcategoryModel from './../../../DB/model/subcategory.model.js';
import slugify from 'slugify';


//createSubcategory
export const createSubcategory = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.findById(req.params.categoryId)
    if (!category) {
        return next(new Error("Category Not Found", { cause: 404 }))
    }
    if (!req.file) {
        return next(new Error("Subcategory Image is Required", { cause: 400 }))
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.CLOUD_FOLDER_NAME}/subcategory` })
    const checkSubcategoryName = await subcategoryModel.findOne({ name: req.body.name })
    if (checkSubcategoryName) {
        return next(new Error("Subcategory Already Exist", { cause: 409 }))
    }
    const subcategory = await subcategoryModel.create({
        name: req.body.name,
        slug: slugify(req.body.name),
        image: { url: secure_url, id: public_id },
        createdBy: req.user._id,
        categoryId: req.params.categoryId
    })
    return res.status(201).json({ message: "Done", subcategory })
})


//updateSubcategory
export const updateSubcategory = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.findById(req.params.categoryId)
    if (!category) {
        return next(new Error("Category Not Found", { cause: 404 }))
    }
    const subcategory = await subcategoryModel.findOne({ _id: req.params.id, categoryId: req.params.categoryId })
    if (!subcategory) {
        return next(new Error("Subcategory Not Found", { cause: 404 }))
    }
    if (subcategory.createdBy.toString() != req.user._id.toString()) {
        return next(new Error("You Are Not Allowed To Update Subcategory", { cause: 403 }))
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { public_id: subcategory.image.id })
        subcategory.image = { url: secure_url, id: public_id }
    }
    subcategory.name = req.body.name ? req.body.name : subcategory.name
    subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug
    await subcategory.save()
    return res.status(200).json({ message: "Done", subcategory })
})


//deleteSubcategory
export const deleteSubcategory = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.findById(req.params.categoryId)
    if (!category) {
        return next(new Error("Category Not Found", { cause: 404 }))
    }
    const subcategory = await subcategoryModel.findOne({ _id: req.params.id, categoryId: req.params.categoryId })
    if (!subcategory) {
        return next(new Error("Subcategory Not Found", { cause: 404 }))
    }
    if (subcategory.createdBy.toString() != req.user._id.toString()) {
        return next(new Error("You Are Not Allowed To Delete Subcategory", { cause: 403 }))
    }
    await subcategory.deleteOne()
    await cloudinary.uploader.destroy(subcategory.image.id)
    return res.status(200).json({ message: "Done" })
})


//getAllSubcategories
export const getAllSubcategories = asyncHandler(async (req, res, next) => {
    if (req.params.categoryId != undefined) {
        const category = await categoryModel.findById(req.params.categoryId)
        if (!category) {
            return next(new Error("Category Not Found", { cause: 404 }))
        }
        const subcategories = await subcategoryModel.find({ categoryId: req.params.categoryId })
        return res.status(200).json({ message: "Done", subcategories })
    }
    const subcategories = await subcategoryModel.find().populate([
        //nestedPopolate 1
        //multiplePopluate 1&2
        {
            path: "categoryId",
            select: "name slug createdBy",
            populate: {
                path: "createdBy",
                select: "userName email"
            }
        },
        {
            path: "createdBy",
            select: "userName email"
        }
    ])
    return res.status(200).json({ message: "Done", subcategories })
})


