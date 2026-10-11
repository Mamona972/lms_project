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


export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      console.log("payment_info:", payment_info);

      // 1. Verify Stripe payment
      if (payment_info && "id" in payment_info) {
        const paymentIntentId = payment_info.id;

        console.log("Payment Intent ID:", paymentIntentId);

        const paymentIntent =
          await stripe.paymentIntents.retrieve(paymentIntentId);

        console.log("Payment status:", paymentIntent.status);

        if (paymentIntent.status !== "succeeded") {
          return next(
            new ErrorHandler("Payment not authorized!", 400)
          );
        }
      }

      // 2. Find user
      const user = await userModel.findById(req.user?._id);

      console.log("User found:", !!user);

      if (!user) {
        return next(
          new ErrorHandler("User not found", 404)
        );
      }

      
const courseExistInUser = user.courses.some(
  (course: any) =>
    String(course.courseId ?? course._id) === String(courseId)
);

if (courseExistInUser) {
  return next(
    new ErrorHandler(
      "You have already purchased this course",
      409
    )
  );
}

      // 4. Find course
      const course = await CourseModel.findById(courseId);

      console.log("Course found:", !!course);

      if (!course) {
        return next(
          new ErrorHandler("Course not found", 404)
        );
      }

      // 5. Order data
      const orderData: any = {
        courseId: course._id,
        userId: user._id,
        payment_info,
      };

      // 6. Email data
      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          data: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      // 7. Send email
      try {
        await sendMail({
          email: user.email,
          subject: "Order Confirmation",
          template: "order-confirmation.ejs",
          data: mailData,
        });

        console.log("Email sent successfully");
      } catch (error: any) {
        console.log("EMAIL ERROR:", error.message);
      }

      // 8. Add course to user
      user.courses.push({courseId:course._id.toString()});

      // 9. Redis
      await redis.set(
        user._id.toString(),
        JSON.stringify(user)
      );

      // 10. Save user
      await user.save();

      // 11. Notification
      await NotificationModel.create({
        userId: user._id.toString(),
        title: "New Order",
        message: `You have a new order from ${course.name}`,
      });

      // 12. Increase purchased count
      course.purchased = (course.purchased || 0) + 1;

      await course.save();

      // 13. Create order
      newOrder(orderData, res, next);

    } catch (error: any) {
      console.log("CREATE ORDER ERROR:", error);

      return next(
        new ErrorHandler(error.message, 500)
      );
    }
  }
);
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
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
    }catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
})

//NEW PAYMENT

export const newPayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount, courseId } = req.body;

      if (!courseId) {
        return next(new ErrorHandler("Course ID is required", 400));
      }

      const user = await userModel.findById(req.user?._id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const alreadyPurchased = user.courses.some(
        (item: any) =>
          String(item.courseId ?? item._id) === String(courseId)
      );

      if (alreadyPurchased) {
        return next(
          new ErrorHandler("You have already purchased this course", 409)
        );
      }

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const expectedAmount = Math.round(Number(course.price) * 100);

      if (!Number.isFinite(Number(amount)) || Number(amount) !== expectedAmount) {
        return next(new ErrorHandler("Invalid payment amount", 400));
      }

      const myPayment = await stripe.paymentIntents.create({
        amount: expectedAmount,
        currency: "USD",
        metadata: {
          company: "E-Learning",
          courseId: String(course._id),
          userId: String(user._id),
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);