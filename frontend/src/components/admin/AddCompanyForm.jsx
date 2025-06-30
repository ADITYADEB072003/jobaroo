import React, { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label"; // Adjust imports as needed
import { addCompany } from "../admin/api"; // Import your API function

const AddCompanyForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        logo: "",
        userId: "", // Replace with current user ID logic
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addCompany(formData);
            setSuccess("Company added successfully!");
            setFormData({
                name: "",
                description: "",
                website: "",
                location: "",
                logo: "",
                userId: "", // Reset or set as necessary
            });
        } catch (error) {
            setError("Failed to add company. Please try again later.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto my-10">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                        type="text"
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                        type="url"
                        name="website"
                        id="website"
                        value={formData.website}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                        type="text"
                        name="location"
                        id="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                        type="url"
                        name="logo"
                        id="logo"
                        value={formData.logo}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label htmlFor="userId">User ID</Label>
                    <Input
                        type="text"
                        name="userId"
                        id="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" className="bg-green-500">Add Company</Button>
                </div>
            </form>
            {error && <div className="text-red-500 mt-4">{error}</div>}
            {success && <div className="text-green-500 mt-4">{success}</div>}
        </div>
    );
};

export default AddCompanyForm;