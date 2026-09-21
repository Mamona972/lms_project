import express from "express"
import { addAnswer, addQuestion, addReplyReview, addReview, deleteCourse, editCourse, generateVideoUrl, getAllCourses, getAllCoursesforAdmin, getCourseAnalytics, getCourseByUser, getSingleCourse, uploadCourse } from "../controllers/course.controller";
import { authorizeRoles, isAuthenticatd } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
const courseRouter= express.Router();

courseRouter.post("/create-course",updateAccessToken,isAuthenticatd,authorizeRoles("admin"),uploadCourse);
courseRouter.put("/edit-course/:id",updateAccessToken,isAuthenticatd,authorizeRoles("admin"),editCourse);
courseRouter.get("/get-course/:id",getSingleCourse);
courseRouter.get("/get-courses",getAllCourses);
courseRouter.get("/get-course-content/:id",updateAccessToken, isAuthenticatd,getCourseByUser);
courseRouter.put("/get-question",updateAccessToken, isAuthenticatd,addQuestion);
courseRouter.put("/add-answer",updateAccessToken, isAuthenticatd,addAnswer);
courseRouter.put("/add-review/:id",updateAccessToken, isAuthenticatd,addReview);
courseRouter.put("/add-reply",updateAccessToken, isAuthenticatd,authorizeRoles("admin"),addReplyReview)
courseRouter.get("/getCourses",updateAccessToken, isAuthenticatd,authorizeRoles("admin"),getAllCoursesforAdmin)
courseRouter.delete("/delete-Course/:id",updateAccessToken, isAuthenticatd,authorizeRoles("admin"),deleteCourse)
courseRouter.get("/get-course-analytics",updateAccessToken, isAuthenticatd, authorizeRoles("admin"),getCourseAnalytics);
courseRouter.post("/getVdoCipherOTP",generateVideoUrl);


export default courseRouter;