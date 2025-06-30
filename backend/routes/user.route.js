import express from "express";
import { 
    login, 
    logout, 
    register, 
    updateProfile, 
    createUser,
    uploadFile

   // Import the addUser controller
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload, singleUpload1 } from "../middlewares/mutler.js";

const router = express.Router();

// Registration route with profile photo upload
router.route("/register").post(singleUpload, register);

// Login route
router.route("/login").post(login);

// Logout route
router.route("/logout").get(logout);

// Profile update route (with profile photo upload)
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
// Alternative route if you need to use imageUpload instead
// router.route("/profile/update").post(isAuthenticated, imageUpload, updateProfile);

// Admin-only route to add a new user (with profile photo upload)
//router.route("/addUser").post(isAuthenticated, singleUpload1, addUser);
router.post('/upload-file', singleUpload1, uploadFile);

// Route for uploading a profile photo
router.post('/add-user', singleUpload1, createUser);
export default router;