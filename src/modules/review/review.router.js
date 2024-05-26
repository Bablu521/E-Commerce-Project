import { Router } from "express";
const router = Router({mergeParams : true})
import * as reviewController from "./review.controller.js"
import * as reviewSchema from "./review.schema.js"
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { validation } from "../../middleware/validation.js";

//addReview
router.post("/" ,
    isAuthenticated,
    isAuthorized("user"),
    validation(reviewSchema.addReview),
    reviewController.addReview  
)

//updateReview
router.patch("/:id" ,
    isAuthenticated,
    isAuthorized("user"),
    validation(reviewSchema.updateReview),
    reviewController.updateReview  
)

export default router