import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from './shared/Navbar';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { removeSavedJob } from '@/redux/jobSlice';
import { Label } from './ui/label';

const SavedJob = () => {
    const savedJobs = useSelector(store => store.job.savedJobs) || [];
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jobToRemove, setJobToRemove] = useState(null); // Store the job to remove

    const openModal = (job) => {
        setJobToRemove(job);
        setIsModalOpen(true);
    };

    const confirmRemove = () => {
        if (jobToRemove) {
            dispatch(removeSavedJob(jobToRemove._id));
        }
        setIsModalOpen(false);
        setJobToRemove(null); // Clear the job to remove
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto my-5'>
                <Label className="text-4xl font-bold m-5">Saved <span className="text-[#F83002]">Jobs</span></Label>
                <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-md">

                    <Table>
                        <TableCaption>A list of your Saved jobs</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Logo</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Job Role</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {savedJobs.length > 0 ? (
                                savedJobs.map(job => (
                                    <TableRow key={job._id} onClick={() => navigate(`/description/${job._id}`)}> {/* Add onClick for row navigation */}
                                        <TableCell>
                                            <img src={job.company.logo} alt={`${job.company.name} Logo`} className="h-10 w-10 rounded" />
                                        </TableCell>
                                        <TableCell>{job.createdAt.split("T")[0]}</TableCell>
                                        <TableCell>{job.title}</TableCell>
                                        <TableCell>{job.company.name}</TableCell>
                                        <TableCell>
                                            <button onClick={(e) => { e.stopPropagation(); openModal(job); }} className="text-red-600">Remove</button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="5" className="text-center">
                                        No saved jobs yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>


            {/* Custom Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Confirm Removal</h2>
                        <p>Are you sure you want to remove this job from your saved jobs?</p>
                        <div className="flex justify-end mt-6">
                            <button className="mr-2 p-2 bg-gray-200 rounded" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="p-2 bg-red-600 text-white rounded" onClick={confirmRemove}>Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedJob;
