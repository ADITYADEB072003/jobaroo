import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogTitle } from '../ui/dialog';
import { Edit2, Eye, MoreHorizontal, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const [selectedJob, setSelectedJob] = useState(null);
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    position: 0,
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) {
        return true;
      }
      return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  const openEditDialog = (job) => {
    setSelectedJob(job);
    setInput({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      salary: job.salary,
      location: job.location,
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      position: job.position,
      companyId: job.company._id
    });
  };

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitEditHandler = async (e) => {
    e.preventDefault();
  
    // Validate all required fields
    if (!input.title || !input.description || !input.requirements || !input.salary || !input.location || !input.jobType || !input.experienceLevel || input.position <= 0 || !input.companyId) {
      toast.error("Please fill in all fields before submitting.");
      return;
    }
  
    try {
      setLoading(true);
      
      // Confirm correct job ID usage
      const jobId = selectedJob._id;
      if (!jobId) {
        throw new Error("No job selected for update.");
      }
  
      const res = await axios.put(`${JOB_API_END_POINT}/update/${jobId}`, input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
  
      toast.success("Job updated successfully!");
      setSelectedJob(null);  // Close the dialog after saving
    } catch (error) {
      console.error(error);
      
      // Enhanced error handling to provide better feedback
      const errorMessage = error.response?.data?.message || "An error occurred while updating the job.";
      toast.error(errorMessage);
  
      // Log additional information for debugging
      console.log("Error response data:", error.response?.data);
      console.log("Error status code:", error.response?.status);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent posted jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs?.map((job) => (
            <TableRow key={job._id}>
              <TableCell>{job?.company?.name}</TableCell>
              <TableCell>{job?.title}</TableCell>
              <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                  <PopoverContent className="w-32">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div onClick={() => openEditDialog(job)} className="flex items-center gap-2 w-fit cursor-pointer">
                          <Edit2 className="w-4" />
                          <span>Edit</span>
                        </div>
                      </DialogTrigger>
                      {selectedJob && selectedJob._id === job._id && (
                        <DialogContent>
                          <DialogTitle>Edit Job</DialogTitle>
                          <form onSubmit={submitEditHandler} className="p-4 max-w-lg">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Title</Label>
                                <Input type="text" name="title" value={input.title} onChange={changeEventHandler} />
                              </div>
                              <div>
                                <Label>Description</Label>
                                <Input type="text" name="description" value={input.description} onChange={changeEventHandler} />
                              </div>
                              <div>
                                <Label>Requirements</Label>
                                <Input type="text" name="requirements" value={input.requirements} onChange={changeEventHandler} />
                              </div>
                              <div>
                                <Label>Salary</Label>
                                <Input type="text" name="salary" value={input.salary} onChange={changeEventHandler} />
                              </div>
                              <div>
                                <Label>Location</Label>
                                <Input type="text" name="location" value={input.location} onChange={changeEventHandler} />
                              </div>
                              <div>
                                <Label>Job Type</Label>
                                <Input type="text" name="jobType" value={input.jobType} onChange={changeEventHandler} />
                              </div>
                              <div>
                                <Label>Experience Level</Label>
                                <Input type="text" name="experienceLevel" value={input.experienceLevel} onChange={changeEventHandler} />
                              </div>
                              <div>
                                <Label>No of Position</Label>
                                <Input type="number" name="position" value={input.position} onChange={changeEventHandler} />
                              </div>
                            </div>
                            <div className="flex justify-between pt-5">
                              {loading ? (
                                <Button className="w-full" disabled>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                </Button>
                              ) : (
                                <Button type="submit" className="w-full bg-[#F83002] ">Save Changes</Button>
                              )}
                            </div>
                          </form>
                        </DialogContent>
                      )}
                    </Dialog>
                    <div onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} className="flex items-center w-fit gap-2 cursor-pointer mt-2">
                      <Eye className="w-4" />
                      <span>Applicants</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
