import express from "express"
import { authorizeRoles, isAuthenticatd } from "../middleware/auth";
import { getNotificatons, updateNotification } from "../controllers/notification.controller";
import { updateAccessToken } from "../controllers/user.controller";

const notificationRoute= express.Router();

notificationRoute.get("/get-all-notification",updateAccessToken, isAuthenticatd, authorizeRoles("admin"), getNotificatons);
notificationRoute.put("/update-notification/:id",updateAccessToken, isAuthenticatd, authorizeRoles("admin"), updateNotification);

export default notificationRoute;