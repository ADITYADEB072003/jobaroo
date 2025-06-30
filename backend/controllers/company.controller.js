import { Company } from "../models/company.model.js";
import mongoose from 'mongoose';
import getDataUri from "../utils/datauri.js"; // Commented out as Cloudinary integration is not used
import cloudinary from "../utils/cloudinary.js"; // Commented out as Cloudinary integration is not used

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        
        // Check if company already exists
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register the same company.",
                success: false
            });
        }

        // Create the new company with 'pending' status by default
        company = await Company.create({
            name: companyName,
            userId: req.id,
            status: 'pending',  // Default status when registering
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies || companies.length === 0) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            });
        }
        return res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

// Get company by ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location, status } = req.body;
        const companyId = req.params.id;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                message: "Invalid company ID format.",
                success: false
            });
        }

        // Commented out Cloudinary-related code
        const file = req.file; // The file upload from request is not processed
        let logo = null; // Initialize logo variable to null
        if (file) {
            const fileUri = getDataUri(file); // Convert file to data URI format
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content); // Upload file to Cloudinary
            logo = cloudResponse.secure_url; // Get the URL of the uploaded file
        }

        // Set `logo` to `null` as we are not handling file uploads
        //const logo = null;

        // Prepare data to update (including the new status field)
        const updateData = { name, description, website, location, logo, status };

        // Find the company by ID and update it
        const company = await Company.findByIdAndUpdate(companyId, updateData, { new: true });

        // Check if the company was found and updated
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        // Respond with success message
        return res.status(200).json({
            message: "Company information updated.",
            success: true
        });
    } catch (error) {
        console.log(error); // Log any errors to the console
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};