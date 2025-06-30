// user controller


import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Register a new user
// Register a new user
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role, educationalQualification, yearOfPassing } = req.body;

        // Check for missing required fields
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Validate role
        if (!['student', 'recruiter', 'admin'].includes(role)) {
            return res.status(400).json({
                message: "Invalid role specified",
                success: false
            });
        }

        const file = req.file;
        // Check if file is provided (except for admin)
        if (!file && role !== 'admin') {
            return res.status(400).json({
                message: "Profile photo is required",
                success: false
            });
        }

        let cloudResponse;
        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        await User.create({
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

        return res.status(201).json({
            message: "Account created successfully.",
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




// Login user
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check for missing fields
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Validate role
        if (!['student', 'recruiter', 'admin'].includes(role)) {
            return res.status(400).json({
                message: "Invalid role specified",
                success: false
            });
        }

        // Find the user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // Compare the password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // Check if the role matches
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            });
        }

        // Generate JWT token with role included
        const tokenData = {
            userId: user._id,
            role: user.role  // Include role in token for authorization
        };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        // Send response with user data
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
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

// Logout user
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
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
export const uploadFile = (req, res) => {
    if (req.file) {
        console.log("Uploaded file:", req.file); // Access the file as a buffer
        res.status(200).json({ message: "File uploaded successfully!" });
    } else {
        res.status(400).json({ message: "No file uploaded" });
    }
};

export const createUser = (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role, educationalQualification, yearOfPassing } = req.body;
        const profilePhoto = req.file ? req.file.buffer : null; // Access the profile photo buffer if uploaded

        // Implement your user creation logic here
        // Save `profilePhoto` as a buffer or store its path/URL in your database

        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Update profile - with admin role handling
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills, educationalQualification, yearOfPassing } = req.body;

        // Get user role from token (assuming it's set by auth middleware)
        const userRole = req.role;

        const file = req.file;

        // const profilePhoto = req.file
        let cloudResponse = null;

        // if (profilePhoto){
        //     const fileUri = getDataUri(profilePhoto);
        //     cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        // }

        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Special handling for admin updates
        if (userRole === 'admin') {
            // Admins can update their profile without restrictions
            if (fullname) user.fullname = fullname;
            if (email) user.email = email;
            if (phoneNumber) user.phoneNumber = phoneNumber;
            if (bio) user.profile.bio = bio;
        } else {
            // Non-admin users can't update email
            if (fullname) user.fullname = fullname;
            if (phoneNumber) user.phoneNumber = phoneNumber;
            if (bio) user.profile.bio = bio;
            if (skills) user.profile.skills = skillsArray;
            if (educationalQualification) user.profile.educationalQualification = educationalQualification;
            if (yearOfPassing) user.profile.yearOfPassing = yearOfPassing;
        }

        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
            // user.profile.profilePhoto = cloudResponse.secure_url;
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
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