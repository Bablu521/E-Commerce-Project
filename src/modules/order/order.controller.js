import cartModel from "../../../DB/model/cart.model.js";
import couponModel from "../../../DB/model/coupon.model.js";
import orderModel from "../../../DB/model/order.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import productModel from './../../../DB/model/product.model.js';
import createInvoice from "../../utils/pdfInvoice.js"
import cloudinary from './../../utils/cloudinary.js';
import path from "path"
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import sendEmail from './../../utils/email.js';
import { clearCart, updateStock } from "./order.service.js";
import Stripe from "stripe";
import { unlink } from "node:fs/promises";



//createOrder
export const createOrder = asyncHandler(async(req , res , next) =>{
    //data
    const { phone , address , payment , coupon } = req.body

    //checkCoupon
    let checkCoupon
    if (coupon){
        checkCoupon = await couponModel.findOne({name : coupon , expiredAt : {$gt : Date.now()}})
    }
    if (!checkCoupon)
        return next (new Error("Invalid Coupon" , {cause:400}))

    //get products from cart
    const cart = await cartModel.findOne({userId : req.user._id})
    const products = cart.products
    if (products.length < 1){
        return next (new Error("Empty Cart" , {cause:400}))
    }

    //loop on products and push them in orderProducts array
    let orderProducts = []
    let orderPrice = 0
    for (let i = 0 ; i < products.length ; i++){
        const product = await productModel.findById ({_id : products[i].productId})
        if (!product){
            return next (new Error(`${product.name} Not Found` , {cause:400}))
        }
        if (!product.inStock(products[i].quantity)){
            return next (new Error(`Product Out of Stock only ${product.availableItems} are Available` , {cause:400}))
        }
        
    orderProducts.push ({
        productId : product._id ,
        quantity : products[i].quantity ,
        name : product.name ,
        itemPrice : product.finalPrice ,
        totalPrice : product.finalPrice * products[i].quantity
    })
    orderPrice += product.finalPrice * products[i].quantity

    }

    //create order
    const order = await orderModel .create({
        userId : req.user._id ,
        products : orderProducts ,
        phone ,
        address ,
        payment ,
        price : orderPrice ,
        coupon : {
            id : checkCoupon?._id ,
            name : checkCoupon?.name,
            discount : checkCoupon?.discount,
        } 
    })

    //create invoice
    const invoice = {
        shipping: {
          name: req.user.userName,
          address: order.address,
          country: "Egypt"
        },
        items: order.products ,
        subtotal: order.price ,
        discount: parseInt(order.price - order.finalPrice) ,
        finalPrice : order.finalPrice ,
        invoice_number: order._id
      };
    
      const pdfPath = process.env.MOOD === "DEV" ? path.join(__dirname , `./../../tempInvoices/${order._id}.pdf`) : `/tmp/${order._id}.pdf`;
      
      createInvoice(invoice, pdfPath);

      //upload invoice on cloudinary
      const {secure_url , public_id} = await cloudinary.uploader.upload(pdfPath , {folder:`${process.env.CLOUD_FOLDER_NAME}/order/invoices`})
      order.invoice = { url : secure_url , id : public_id }
      await order.save ()

      //delete file from system
      await unlink(pdfPath);

      //send invoice Email
      await sendEmail ({
        to : req.user.email ,
        subject : "Order Invoice" ,
        attachments : [{
            path : secure_url ,
            contentType : "application/pdf"
        }]
      })
      
      //update stock
      updateStock(order.products , true)

      //clear cart
      clearCart(req.user._id)

      //stripe gateway incase of payment by visa
      if(payment == "visa"){

        const stripe = new Stripe(process.env.STRIPE_KEY)

        let couponExisted ;
        if (order.coupon.name != undefined){
            couponExisted = await stripe.coupons.create({
                percent_off : order.coupon.discount ,
                duration : "once"
            })
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types : ["card"] ,
            mode : "payment" ,
            metadata : {order_id : order._id.toString()} ,
            success_url : process.env.SUCCESS_URL ,
            cancel_url : process.env.CANCEL_URL ,
            line_items : order.products.map((product)=>{
                return {
                    price_data : {
                        currency : "egp" ,
                        product_data : {
                            name : product.name ,
                        } ,
                        unit_amount : product.itemPrice * 100
                    } ,
                    quantity : product.quantity
                }
            }) ,
            discounts : couponExisted ? [{coupon : couponExisted.id}] : []

        })

        return res.status(201).json({message:"Done" , results: {url:session.url}})
      }

    //response
    return res.status(201).json({message:"Done", order})
})


//cancelOrder
export const cancelOrder = asyncHandler(async(req , res , next)=>{
    const order = await orderModel.findById(req.params.id)
    if (!order){
        return next (new Error("Order Not Found" , {cause:404}))
    }
    if (!order.status == "placed"){
        return next (new Error("you can't cancel this order" , {cause:400}))
    }
    order.status = "cancelled"
    await order.save()
    updateStock(order.products , false)
    return res.status(200).json({message:"Done", order})
})


//orderWebhook
export const orderWebhook = asyncHandler(async(request, response) => {

const stripe = new Stripe(process.env.STRIPE_KEY)
const sig = request.headers['stripe-signature'];
let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.ENDPOINT_SECRET);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  const orderId = event.data.object.metadata.order_id
  if (event.type === "checkout.session.completed"){
    await orderModel.findOneAndUpdate({_id : orderId} , {status : "visa paid"})
    return;
  }
  await orderModel.findOneAndUpdate({_id : orderId} , {status : "failed to pay"})
  return;
})







