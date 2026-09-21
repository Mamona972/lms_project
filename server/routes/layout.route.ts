import express from "express";
import { authorizeRoles, isAuthenticatd } from "../middleware/auth";
import { createLayout, editLayout, getLayoutByTpye } from "../controllers/Layout.controlle";
import { updateAccessToken } from "../controllers/user.controller";
const layoutRouter= express.Router();

layoutRouter.post("/create-layout",updateAccessToken, isAuthenticatd, authorizeRoles("admin"),createLayout);
layoutRouter.put("/edit-layout",updateAccessToken, isAuthenticatd, authorizeRoles("admin"),editLayout);
layoutRouter.get("/get-layout/:type", getLayoutByTpye);

export default layoutRouter;