import ConnectDB from "../DB/connection.js"
import { globalErrorHandling } from "./utils/errorHandling.js"
import authRouter from "./modules/auth/auth.router.js"
import categoryRouter from "./modules/category/category.router.js"
import subcategoryRouter from "./modules/subcategory/subcategory.router.js"
import brandRouter from "./modules/brand/brand.router.js"
import couponRouter from "./modules/coupon/coupon.router.js"
import productRouter from "./modules/product/product.router.js"
import cartRouter from "./modules/cart/cart.router.js"
import orderRouter from "./modules/order/order.router.js"
import reviewRouter from "./modules/review/review.router.js"
import morgan from "morgan"
import cors from "cors"
const initApp = (app , express)=>{
    ConnectDB()
    //CORS
    // const whitelist = ["http://127.0.0.1:5500"]
    // app.use((req,res,next)=>{
    //     console.log(req.header("origin"))

    //     if (req.originalUrl.includes("/auth/activate_account")){
    //         res.setHeader("Access-Control-Allow-Origin" , "*")
    //         res.setHeader("Aceess-Control-Allow-Methods" , 'GET')
    //         return next()
    //     }

    //     if (!whitelist.includes(req.header("origin"))){
    //         return next (new Error("Blocked By CORS"))
    //     }
    //     res.setHeader("Access-Control-Allow-Origin" , "*") 
    //     res.setHeader("Access-Control-Allow-Headers" , "*")
    //     res.setHeader("Access-Control-Allow-Methods" , "*")
    //     res.setHeader("Access-Control-Private-Network" , true)
    //     return next()
    // })

    app.use(cors()) 

    app.use(morgan("combined"))

    app.use(express.json())

    app.get("/" , (req , res ,next)=>{
        return res.json({message:"Welcome E-Commerce Project"})
    })

    app.use ("/auth" , authRouter)
    app.use ("/category" , categoryRouter)
    app.use ("/subcategory" , subcategoryRouter)
    app.use ("/brand" , brandRouter)
    app.use ("/coupon" , couponRouter)
    app.use ("/product" , productRouter)
    app.use ("/cart" , cartRouter)
    app.use ("/order" , orderRouter)
    app.use ("/review" , reviewRouter)
    app.use ("*" , (req,res,next)=>{
        return res.status(404).json({message:"IN-VALID ROUTING"})
    })
    app.use (globalErrorHandling)
}

export default initApp