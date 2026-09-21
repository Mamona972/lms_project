import express from "express";
import { activateUser, deleteUser, getAllUsers, getUserInfo, loginUser, logoutUser, registrationUser, socialAuth, updateAccessToken, updatePassword, updateProfilePicture, updateUserInfo, updateUserRole } from "../controllers/user.controller";
import { authorizeRoles, isAuthenticatd } from "../middleware/auth";
const userRouter=express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout",isAuthenticatd , logoutUser);
userRouter.get("/refresh",updateAccessToken )
userRouter.get("/me",updateAccessToken, isAuthenticatd , getUserInfo);
userRouter.post("/social-auth", socialAuth);
userRouter.put("/update-user-info",updateAccessToken, isAuthenticatd, updateUserInfo);
userRouter.put("/update-user-password",updateAccessToken, isAuthenticatd, updatePassword);
userRouter.put("/update-user-avatar",updateAccessToken, isAuthenticatd, updateProfilePicture);
userRouter.get("/get-users",updateAccessToken, isAuthenticatd,authorizeRoles("admin"), getAllUsers);
userRouter.put("/update-user",updateAccessToken, isAuthenticatd,authorizeRoles("admin"), updateUserRole);
userRouter.delete("/delete-user/:id",updateAccessToken, isAuthenticatd,authorizeRoles("admin"), deleteUser);


export default userRouter;