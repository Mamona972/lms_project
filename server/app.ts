import express, { NextFunction,Request,Response  } from 'express';
require("dotenv").config();
export const app=express();
import connectDB from './utils/db';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import {ErrorMiddleware}  from "./middleware/error"
import userRouter from './routes/user.route';
import courseRouter from './routes/course.route';
import orderRouter from './routes/order.route';
import notificationRoute from './routes/notification.route';
import analyticRouter from './routes/analytics.route';
import layoutRouter from './routes/layout.route';
import { rateLimit } from 'express-rate-limit'

//body parser
app.use(express.json({limit: '50mb'}))   //this is important for cloudinary

//cookie parser
app.use(cookieParser());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database unavailable:", error);

    res.status(503).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

//cors
app.use(cors({
    origin: ['http://localhost:3000',
        "https://lms-project-f9afe9yaa-mamona-s-projects.vercel.app"
    ],
    credentials:true,
}))

//api requests limit
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
})

//routes
app.use("/api/v1", userRouter,courseRouter,orderRouter,notificationRoute, analyticRouter,layoutRouter);


//testing api
app.get('/', (req:Request, res:Response, next:NextFunction)=>{
res.status(200).json({
    success:true,
    message:"API is working",
})
})

//unkown route 

app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});
// Apply the rate limiting middleware to all requests.
app.use(limiter)

app.use(ErrorMiddleware);

export default app;