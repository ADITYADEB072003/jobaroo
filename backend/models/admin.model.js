import mongoose from "mongoose";

// Define a schema for additional admin-specific fields
const adminSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    permissions: [{
        type: String,
        enum: ['manageUsers', 'viewReports', 'editJobs', 'approveApplications', 'manageCompanies'],
        default: [] // Specify any default permissions for a new admin
    }]
}, { timestamps: true });

export const Admin = mongoose.model('Admin', adminSchema);