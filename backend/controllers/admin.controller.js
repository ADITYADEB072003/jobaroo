import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import bcrypt from "bcryptjs";

// Controller to get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();  // Adjust query as needed
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", success: false });
    }
};

// Controller to get all companies
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find();  // Adjust query as needed
        res.status(200).json({ companies });
    } catch (error) {
        res.status(500).json({ message: "Error fetching companies", success: false });
    }
};

// Controller to get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        const jobs = await Job.find(query).populate({
            path: 'company',
            select: 'name'
        }).sort({ createdAt: -1 });

        res.status(200).json({ jobs });
    } catch (error) {
        res.status(500).json({ message: "Error fetching jobs", success: false });
    }
};

// Controller to accept or reject a company based on action (accept or reject)
export const acceptOrRejectCompany = async (req, res) => {
    const { companyId, action } = req.params;

    try {
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({ message: "Company not found", success: false });
        }

        if (action === "accept") {
            company.status = "accepted";
        } else if (action === "reject") {
            company.status = "rejected";
        } else {
            return res.status(400).json({ message: "Invalid action", success: false });
        }

        await company.save();
        res.status(200).json({ message: `Company ${action}ed successfully`, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error updating company status", success: false });
    }
};

// Controller to add a new user
export const addUser = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role, educationalQualification, yearOfPassing } = req.body;
        const file = req.file;

        let cloudResponse;
        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                educationalQualification,
                yearOfPassing,
                profilePhoto: cloudResponse?.secure_url || "",
            }
        });

        await user.save();
        res.status(201).json({ message: "User added successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding user", success: false });
    }
};

// Controller to add a new company
export const addCompany = async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).json({ message: "Company added successfully", company });
    } catch (error) {
        res.status(500).json({ message: "Error adding company", success: false });
    }
};

// Controller to remove a user by ID
export const removeUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        res.status(200).json({ message: "User removed successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Error removing user", success: false });
    }
};

// Controller to remove a company by ID
export const removeCompany = async (req, res) => {
    const { companyId } = req.params;
    try {
        const company = await Company.findByIdAndDelete(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found", success: false });
        }
        res.status(200).json({ message: "Company removed successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Error removing company", success: false });
    }
};

// Controller to remove a job by ID
export const removeJob = async (req, res) => {
    const { jobId } = req.params;

    try {
        const job = await Job.findByIdAndDelete(jobId);

        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }

        console.log(`Job with ID: ${jobId} was removed by Admin: ${req.user.id}`);
        res.status(200).json({ message: "Job removed successfully", success: true });
    } catch (error) {
        console.error(`Error removing job with ID: ${jobId}`, error);
        res.status(500).json({ message: "Error removing job", success: false });
    }
};

// New controller to upload a profile photo
export const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded", success: false });
        }

        const fileUri = getDataUri(req.file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        res.status(200).json({ message: "Profile photo uploaded successfully", url: cloudResponse.secure_url });
    } catch (error) {
        console.error("Error uploading profile photo", error);
        res.status(500).json({ message: "Error uploading profile photo", success: false });
    }
};