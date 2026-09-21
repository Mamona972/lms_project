import express from 'express';
import { authorizeRoles, isAuthenticatd } from '../middleware/auth';
import { createOrder, getAllOrdersforAdmin, getOrderAnalytics, newPayment, sendStripePublishableKey } from '../controllers/order.controller';
import { updateAccessToken } from '../controllers/user.controller';
const orderRouter= express.Router();

orderRouter.post("/create-order", isAuthenticatd,createOrder);
orderRouter.get("/get-order",updateAccessToken, isAuthenticatd, authorizeRoles("admin"),getAllOrdersforAdmin);
orderRouter.get("/get-order-analytics", isAuthenticatd, authorizeRoles("admin"),getOrderAnalytics);
orderRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);
orderRouter.post("/payment", isAuthenticatd, newPayment)
export default orderRouter;
