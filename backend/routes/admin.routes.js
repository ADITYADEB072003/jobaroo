import express from "express";
import { singleUpload, singleUpload1 } from "../middlewares/mutler.js";
import {
    getAllUsers,
    getAllCompanies,
    getAllJobs,
    acceptOrRejectCompany,
    addUser,
    addCompany,
    removeUser,
    removeJob,
    removeCompany,
    uploadProfilePhoto
} from "../controllers/admin.controller.js";
import isAuthenticatedAndAdmin from "../middlewares/isAuthenticatedAndAdmin.js"; // Combined middleware

const router = express.Router();

// Routes for admin functionalities, ensuring only authenticated admins can access
router.route("/users")
    .get(isAuthenticatedAndAdmin, getAllUsers)  // Get all users
    .post(isAuthenticatedAndAdmin, singleUpload, addUser); // Add a new user

router.route("/companies")
    .get(isAuthenticatedAndAdmin, getAllCompanies)  // Get all companies
    .post(isAuthenticatedAndAdmin, addCompany);     // Add a new company

router.route("/jobs")
    .get(isAuthenticatedAndAdmin, getAllJobs);  // Get all jobs

router.route("/companies/:companyId/:action")
    .put(isAuthenticatedAndAdmin, acceptOrRejectCompany); 
     // Accept or reject a company

router.route("/users/:userId")
    .delete(isAuthenticatedAndAdmin, removeUser);  // Remove a user

router.route("/companies/:companyId")
    .delete(isAuthenticatedAndAdmin, removeCompany);  // Remove a company

router.route("/jobs/:jobId")
    .delete(isAuthenticatedAndAdmin, removeJob);  // Delete a job

// Route for uploading a profile photo (admin-only)
router.route("/upload-profile-photo")
    .post(isAuthenticatedAndAdmin, singleUpload1, uploadProfilePhoto);

export default router;