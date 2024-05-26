import { asyncHandler } from "../utils/errorHandling.js";
import jwt from "jsonwebtoken"
import userModel from './../../DB/model/user.model.js';


export const isAuthenticated = asyncHandler(async(req,res,next)=>{
    const {token} = req.headers
    if (!token?.startsWith(process.env.BEARER_KEY)){
        return next (new Error("VALID TOKEN IS Required") , {cause:400})
    }
    const payload = token.split(process.env.BEARER_KEY)[1]
    const decoded = jwt.verify(payload , process.env.TOKEN_SINGATURE)
    const user = await userModel.findById(decoded.id)
    if (!user){
        return next (new Error("User Not Found",{status:404}))
    }
    if (user.status != "online"){
        return next (new Error("Please LOGIN" , {status:401}))
    }
    req.user = user
    return next()

})