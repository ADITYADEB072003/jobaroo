import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Label } from "../ui/label";
import { getAllUsers, getAllCompanies, getAllJobs, removeCompany, removeUser, removeJob, acceptOrRejectCompany } from "../admin/api"; // Added removeUser
import AddUserForm from "./AddUserForm";
import { Plus, PlusCircle } from "lucide-react";


const AdminHomePage = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [companyToRemove, setCompanyToRemove] = useState(null);
    const [userToRemove, setUserToRemove] = useState(null);
    const [jobToRemove, setJobToRemove] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

    const handleSelect = (value) => {
        setSelectedOption(value);
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            if (selectedOption === "student") {
                const response = await getAllUsers();
                if (response && Array.isArray(response.users)) {
                    setUsers(response.users);
                } else {
                    throw new Error("Invalid response structure for users");
                }
            } else if (selectedOption === "recruiter") {
                const response = await getAllJobs();
                if (response && Array.isArray(response.jobs)) {
                    setJobs(response.jobs);
                } else {
                    throw new Error("Invalid response structure for jobs");
                }
            } else if (selectedOption === "companies") {
                const response = await getAllCompanies();
                if (response && Array.isArray(response.companies)) {
                    setCompanies(response.companies);
                } else {
                    throw new Error("Invalid response structure for companies");
                }
            }
        } catch (error) {
            setError("Failed to load data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCompany = async (companyId) => {
        setCompanyToRemove(companyId);
        setModalType('company');
        setIsModalOpen(true);
    };

    const handleRemoveUser = async (userId) => {
        setUserToRemove(userId);
        setModalType('user');
        setIsModalOpen(true);
    };

    const handleRemovejob = async (jobId) => {
        setJobToRemove(jobId);
        setModalType('job');
        setIsModalOpen(true);
    };

    const confirmRemove = async () => {
        try {
            if (modalType === 'company') {
                await removeCompany(companyToRemove);
                setCompanies((prev) => prev.filter((company) => company._id !== companyToRemove));
            } else if (modalType === 'user') {
                await removeUser(userToRemove);
                setUsers((prev) => prev.filter((user) => user._id !== userToRemove));
            } else if (modalType === 'job') {
                await removeJob(jobToRemove);
                setJobs((prev) => prev.filter((job) => job._id !== jobToRemove));
            }
        } catch (error) {
            // setError(`Failed to remove ${modalType}. Please try again later.`);
            setError();
        } finally {
            setIsModalOpen(false);
            setCompanyToRemove(null);
            setUserToRemove(null);
            setJobToRemove(null);
            setModalType(null);
        }
    };

    const handleAcceptOrRejectCompany = async (companyId, action) => {
        try {
            await acceptOrRejectCompany(companyId, action);
            setCompanies((prev) => prev.map((company) =>
                company._id === companyId ? { ...company, status: action } : company
            ));
        } catch (error) {
            setError(`Failed to ${action} company. Please try again later.`);
        }
    };

    useEffect(() => {
        if (selectedOption) {
            fetchData();
        }
    }, [selectedOption]);

    return (
        <div>
            <Navbar />
            <div className="max-w-6xl mx-auto my-10">
                <Label className="text-4xl font-bold">Admin <span className="text-[#F83002]">Dashboard</span></Label>
                <div className="flex items-center justify-between my-5">
                    <Select onValueChange={handleSelect}>
                        <SelectTrigger className="w-[180px] my-7">
                            <SelectValue placeholder="Get Details" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="student">User</SelectItem>
                                <SelectItem value="recruiter">Jobs</SelectItem>
                                <SelectItem value="companies">Companies</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button className="bg-[#F83002]" onClick={() => setIsAddUserModalOpen(true)}>
                        <PlusCircle className="mr-2" />
                        Add
                    </Button>
                </div>

                {/* Display any error message */}
                {error && <div className="text-red-500 mb-4">{error}</div>}

                {/* Render Data Tables */}
                {selectedOption === "companies" && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Update Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {companies.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan="4" className="text-center">No companies available</TableCell>
                                </TableRow>
                            ) : (
                                companies.map((company) => (
                                    <TableRow key={company._id}>
                                        <TableCell>{company.name}</TableCell>
                                        <TableCell>{company.status}</TableCell>
                                        <TableCell className="text-right">
                                            {company.status === "pending" ? (
                                                <div className="space-x-2">
                                                    <Button onClick={() => handleAcceptOrRejectCompany(company._id, "accept")} className="bg-green-500">Accept</Button>
                                                    <Button onClick={() => handleAcceptOrRejectCompany(company._id, "reject")} className="bg-red-500">Reject</Button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">Already Updated</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right text-red-500 cursor-pointer" onClick={() => handleRemoveCompany(company._id)}>Remove</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}

                {/* Add additional tables for "student" and "recruiter" options */}
                {selectedOption === "student" && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {/* <TableHead>Profile Photo</TableHead> */}
                                <TableHead>User Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone No.</TableHead>
                                <TableHead>Education Qualification</TableHead>
                                <TableHead>Year of Passing</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan="2" className="text-center">No students available</TableCell>
                                </TableRow>
                            ) : (
                                users.filter((user) => user.role !== "admin").map((user) => (
                                    <TableRow key={user._id}>

                                        {/* <TableCell>{user.profile.profilePhoto ? user.profile.profilePhoto : "NA"}</TableCell> */}
                                        <TableCell>{user.fullname ? user.fullname : "NA"}</TableCell>
                                        <TableCell>{user.role ? user.role : "NA"}</TableCell>
                                        <TableCell>{user.email ? user.email : "NA"}</TableCell>
                                        <TableCell>{user.phoneNumber ? user.phoneNumber : "NA"}</TableCell>
                                        <TableCell>{user.profile.educationalQualification ? user.profile.educationalQualification : "NA"}</TableCell>
                                        <TableCell>{user.profile.yearOfPassing ? user.profile.yearOfPassing : "NA"}</TableCell>
                                        <TableCell className="text-red-500 cursor-pointer" onClick={() => handleRemoveUser(user._id)}>Remove</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}

                {selectedOption === "recruiter" && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company Name</TableHead>
                                <TableHead>Job Title</TableHead>
                                <TableHead>Salary (in LPA)</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Job Type</TableHead>
                                <TableHead>Experience Level</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>createdAt</TableHead>
                                <TableHead>updatedAt</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {jobs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan="3" className="text-center">No job listings available</TableCell>
                                </TableRow>
                            ) : (
                                jobs.map((job) => (
                                    <TableRow key={job._id}>
                                        <TableCell>{job.company?.name ?? "NA"}</TableCell>
                                        <TableCell>{job.title}</TableCell>
                                        <TableCell>{job.salary}</TableCell>
                                        <TableCell>{job.location}</TableCell>
                                        <TableCell>{job.jobType}</TableCell>
                                        <TableCell>{job.experienceLevel}</TableCell>
                                        <TableCell>{job.position}</TableCell>
                                        <TableCell>{job.createdAt ? job.createdAt.toLocaleString() : "NA"}</TableCell>
                                        <TableCell>{job.updatedAt ? job.updatedAt.toLocaleString() : "NA"}</TableCell>
                                        <TableCell className="text-red-500 cursor-pointer" onClick={() => handleRemovejob(job._id)}>Remove</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}

                {isAddUserModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Add User and Company</h2>
                                <button
                                    onClick={() => setIsAddUserModalOpen(false)}
                                    className="text-gray-600 hover:text-gray-800 focus:outline-none"
                                >
                                    ✕
                                </button>
                            </div>
                            <AddUserForm onUserAdded={fetchData} />
                        </div>
                    </div>
                )}
                {/* Confirmation modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <h2 className="text-lg font-bold mb-4">Confirm Removal</h2>
                            <p>Are you sure you want to remove this {modalType}?</p>
                            <div className="flex justify-end mt-6">
                                <button className="mr-2 p-2 bg-gray-200 rounded" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button className="p-2 bg-red-600 text-white rounded" onClick={confirmRemove}>Remove</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminHomePage;