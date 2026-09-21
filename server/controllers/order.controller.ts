import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import OrderModel, {IOrder} from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import { getAllOrdersService, newOrder } from "../services/order.service";
import { generateLast12MonthDate } from "../utils/analytics.generator";
import { redis } from "../utils/redis";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


export const createOrder= CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {courseId, payment_info}= req.body as IOrder;

        if(payment_info){
          if("id" in payment_info){
            const paymentIntentId = payment_info.id;
            const paymentIntent = await stripe.paymentIntents.retrieve(
              paymentIntentId
            );
            if(paymentIntent.status !== "succeeded"){
            return next(new ErrorHandler("Payment not authorized!", 400));
            }
          }
        }
        const user= await userModel.findById(req.user?._id);
        const courseExistInUser= user?.courses.some((course:any)=>course._id.toString() ===courseId);
        if(courseExistInUser){
      return next(new ErrorHandler("you hav already purchased this course", 500));
        }
        const course= await CourseModel.findById(courseId);

        if(!course){
      return next(new ErrorHandler("course not found", 500));
        }
        const data:any={
            courseId:course._id,
            userId:user?._id,
            payment_info,
        };
        const mailData={
            order:{
                _id:course._id.toString().slice(0,6),
                name:course.name,
                price:course.price,
                data:new Date().toLocaleDateString('en-US',{year:'numeric', month:'long', day:'numeric'})
            }
        }
        const html= await ejs.renderFile(path.join(__dirname, "../mails/order-confirmation.ejs"), {order:mailData})
       try{
        if(user){
            await sendMail({
                email:user.email,
                subject:"Order Confirmation",
                template:"order-confirmation.ejs",
                data:mailData,
            })
        }
       }catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
    
    user?.courses.push(course?._id);

    await redis.set(req.user?._id , JSON.stringify(user))
    await user?.save();

     await NotificationModel.create({
        user:user?._id,
        title:"New Order",
        message:`You have a new order from ${course?.name}`
    })
   course.purchased = (course.purchased || 0) + 1;

   await course.save();

   newOrder(data,res,next);
    
    }catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

//get all the order -- only for admin
export const getAllOrdersforAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
       getAllOrdersService(res);
    }catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

//get oders analytics -- only for admin
export const getOrderAnalytics =CatchAsyncError(async(req:Request,res:Response, next:NextFunction )=>{
    try{

        const oders= await generateLast12MonthDate(OrderModel);
    res.status(200).json({
        success: true,
         oders,
      });  
    }catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
})


//send stripe publishble key
export const sendStripePublishableKey =CatchAsyncError(async(req:Request,res:Response, next:NextFunction )=>{
    try{
    res.status(200).json({
      publishablekey: process.env.STRIPE_PUBLISHABLE_KEY
    })
    }catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
})

//NEW PAYMENT
export const newPayment =CatchAsyncError(async(req:Request,res:Response, next:NextFunction )=>{
    try{
      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency:"USD",
        metadata:{
          company:"E-Learning",
        },
        automatic_payment_menthods:{
          enabled:true,
        }
      });

    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret
    })
    }catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
})
