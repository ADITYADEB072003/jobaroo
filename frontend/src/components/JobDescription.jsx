import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { MapPin, DollarSign, Briefcase, User } from 'lucide-react';

const JobDescription = () => {
  const {allJobs} = useSelector((store) => store.job)
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const isInitiallyApplied = singleJob?.applications?.some(
    (application) => application.applicant === user?._id
  ) || false;
  
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const [activeTab, setActiveTab] = useState('description'); // Tab state

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [
            ...singleJob.applications,
            { applicant: user?._id },
          ],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  // Get the company associated with the clicked job

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <p className="text-gray-700 leading-relaxed">{singleJob?.description}</p>
        );
      case 'requirements':
        return (
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Strong problem-solving skills</li>
            <li>Experience of {singleJob?.experienceLevel}+ years</li>
            <li>Proficiency in relevant technologies</li>
            <li>{singleJob?.requirements}</li>
          </ul>
        );
      //   case 'company':
      //     return (
      //       <div className="text-gray-700">
      //         <p className="font-semibold">Company Name:</p>
      //         <p>{singleCompany?.name || 'Not Available'}</p>
      //       </div>
      //     );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10 bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FF7043] to-[#FFEB3B] p-8 text-white">

        <h1 className="text-3xl font-bold">{singleJob?.title}</h1>
        {/* Job Badge */}
      <div className="flex items-center gap-4 mt-4">
        <Badge className="text-blue-700 bg-white font-bold" variant="outline">
          {singleJob?.position} Positions
        </Badge>
        <Badge className="text-[#F83002] bg-white font-bold" variant="ghost">
          {singleJob?.jobType}
        </Badge>
        <Badge className="text-[#7209b7] bg-white font-bold" variant="ghost">
          {singleJob?.salary} LPA
        </Badge>
      </div>
      </div>
    
      

      {/* Job Details Section */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Job Details</h2>
            <div className="space-y-4">
              <p className="flex items-center gap-2">
                <Briefcase className="text-blue-500" />
                <span className="font-bold">Role:</span> {singleJob?.title}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="text-red-500" />
                <span className="font-bold">Location:</span> {singleJob?.location}
              </p>
              <p className="flex items-center gap-2">
                <DollarSign className="text-green-500" />
                <span className="font-bold">Salary:</span> {singleJob?.salary} LPA
              </p>
              <p className="flex items-center gap-2">
                <User className="text-purple-500" />
                <span className="font-bold">Applicants:</span> {singleJob?.applications?.length}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-bold">Posted Date:</span> {singleJob?.createdAt.split("T")[0]}
              </p>
            </div>
          </div>

          {/* Apply Button */}
          <div className="flex justify-end items-center">
            <Button
              onClick={isApplied ? null : applyJobHandler}
              disabled={isApplied}
              className={`rounded-lg ${
                isApplied
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-[#F83002] hover:bg-[black]'
              } text-white px-6 py-3 transition-all`}
            >
              {isApplied ? 'Already Applied' : 'Apply Now'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex border-b border-gray-300">
            <button
              className={`px-6 py-2 ${
                activeTab === 'description'
                  ? 'border-b-2 border-purple-500 text-purple-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`px-6 py-2 ${
                activeTab === 'requirements'
                  ? 'border-b-2 border-purple-500 text-purple-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('requirements')}
            >
              Requirements
            </button>
            {/* <button
              className={`px-6 py-2 ${
                activeTab === 'company'
                  ? 'border-b-2 border-purple-500 text-purple-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('company')}
            >
              Company
            </button> */}
          </div>
          <div className="mt-4">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
