import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { addUser, addCompany } from "../admin/api"; // Ensure these APIs handle FormData for `addUser`

const AddUserForm = () => {
    const [activeTab, setActiveTab] = useState("user");
    const [userFormData, setUserFormData] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student",
        file: null,
        educationalQualification: "",
        yearOfPassing: "",
    });
    const [companyFormData, setCompanyFormData] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        logo: "",
        userId: "",
    });
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Handle user input changes
    const handleUserChange = (e) => {
        const { name, type, files, value } = e.target;
        setUserFormData({
            ...userFormData,
            [name]: type === "file" ? files[0] : value,
        });
    };

    // Handle company input changes
    const handleCompanyChange = (e) => {
        const { name, value } = e.target;
        setCompanyFormData({
            ...companyFormData,
            [name]: value,
        });
    };

    // Submit user form
    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true
        try {
            const formData = new FormData();
            Object.keys(userFormData).forEach((key) => {
                formData.append(key, userFormData[key]);
            });

            const newUser = await addUser(formData); // Ensure API supports FormData
            console.log("User added successfully:", newUser);

            setUserFormData({
                fullname: "",
                email: "",
                phoneNumber: "",
                password: "",
                role: "student",
                file: null, // Reset file
                educationalQualification: "",
                yearOfPassing: "",
            });
            setSuccess("User added successfully!");
            setError(null);
        } catch (error) {
            console.error("Error submitting user form:", error);
            setError("Failed to add user. Please try again.");
            setSuccess(null);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // Submit company form
    const handleCompanySubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true
        try {
            const response = await addCompany(companyFormData);
            console.log("Company added successfully:", response);

            setCompanyFormData({
                name: "",
                description: "",
                website: "",
                location: "",
                logo: "",
                userId: "",
            });
            setSuccess("Company added successfully!");
            setError(null);
        } catch (error) {
            console.error("Error submitting company form:", error);
            setError("Failed to add company. Please try again.");
            setSuccess(null);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // Handle profile picture file upload
    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setUserFormData({ ...userFormData, file });
        }
    };

    // Preview profile picture
    const previewImage = userFormData.file ? URL.createObjectURL(userFormData.file) : null;

    return (
        <div className="max-w-4xl mx-auto my-10">
            {/* Tabs for switching between User and Company forms */}
            <div className="flex justify-around mb-6">
                <Button onClick={() => setActiveTab("user")} className={activeTab === "user" ? "bg-[#F83002]" : "bg-gray-200"}>
                    Add User
                </Button>
                <Button onClick={() => setActiveTab("company")} className={activeTab === "company" ? "bg-[#F83002]" : "bg-gray-200"}>
                    Add Company
                </Button>
            </div>

            {/* Form container */}
            <div className="h-[500px] overflow-y-auto border p-4 rounded shadow">
                {/* User Form */}
                {activeTab === "user" && (
                    <form onSubmit={handleUserSubmit} className="space-y-4">
                         <div>
                            <Label htmlFor="role">Role</Label>
                            <select name="role" id="role" value={userFormData.role} onChange={handleUserChange}>
                                <option value="student">Student</option>
                                <option value="recruiter">Recruiter</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="fullname">Full Name</Label>
                            <Input
                                type="text"
                                name="fullname"
                                id="fullname"
                                value={userFormData.fullname}
                                onChange={handleUserChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                value={userFormData.email}
                                onChange={handleUserChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                type="number"
                                name="phoneNumber"
                                id="phoneNumber"
                                value={userFormData.phoneNumber}
                                onChange={handleUserChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                value={userFormData.password}
                                onChange={handleUserChange}
                                required
                            />
                        </div>
                       
                        {userFormData.role === "student" && (
                            <>
                                <div>
                                    <Label htmlFor="educationalQualification">Educational Qualification</Label>
                                    <Input
                                        type="text"
                                        name="educationalQualification"
                                        id="educationalQualification"
                                        value={userFormData.educationalQualification}
                                        onChange={handleUserChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="yearOfPassing">Year of Passing</Label>
                                    <Input
                                        type="number"
                                        name="yearOfPassing"
                                        id="yearOfPassing"
                                        value={userFormData.yearOfPassing}
                                        onChange={handleUserChange}
                                    />
                                </div>
                            </>
                        )}
                        <div className="flex items-center gap-2">
                            <Label>Profile Picture</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                name="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer"
                            />
                        </div>
                        {previewImage && (
                            <div className="mt-2">
                                <img src={previewImage} alt="Profile Preview" className="w-32 h-32 object-cover rounded" />
                            </div>
                        )}
                        <div className="flex justify-end">
                            <Button type="submit" className="bg-green-500" disabled={loading}>
                                {loading ? "Loading..." : "Add User"}
                            </Button>
                        </div>
                    </form>
                )}

                {/* Company Form */}
                {activeTab === "company" && (
                    <form onSubmit={handleCompanySubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Company Name</Label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                value={companyFormData.name}
                                onChange={handleCompanyChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                type="text"
                                name="description"
                                id="description"
                                value={companyFormData.description}
                                onChange={handleCompanyChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="website">Website</Label>
                            <Input
                                type="url"
                                name="website"
                                id="website"
                                value={companyFormData.website}
                                onChange={handleCompanyChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                id="location"
                                value={companyFormData.location}
                                onChange={handleCompanyChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="logo">Logo URL</Label>
                            <Input
                                type="url"
                                name="logo"
                                id="logo"
                                value={companyFormData.logo}
                                onChange={handleCompanyChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="userId">User ID</Label>
                            <Input
                                type="text"
                                name="userId"
                                id="userId"
                                value={companyFormData.userId}
                                onChange={handleCompanyChange}
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" className="bg-green-500" disabled={loading}>
                                {loading ? "Loading..." : "Add Company"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>

            {/* Error and success messages */}
            {error && <div className="text-red-500 mt-4">{error}</div>}
            {success && <div className="text-green-500 mt-4">{success}</div>}
        </div>
    );
};

export default AddUserForm;
