import express from "express";
import { authorizeRoles, isAuthenticatd } from "../middleware/auth";
import { getUserAnalytics } from "../controllers/analytics.controller";
const analyticRouter= express.Router();

analyticRouter.get("/get-users-analytics", isAuthenticatd, authorizeRoles("admin"),getUserAnalytics);

export default analyticRouter;