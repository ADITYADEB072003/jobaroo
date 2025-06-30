import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { addSavedJob, removeSavedJob } from '@/redux/jobSlice';

const Job = ({ job }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const savedJobs = useSelector(store => store.job.savedJobs) || []; // Get saved jobs from Redux
    const isSaved = savedJobs.some(savedJob => savedJob._id === job._id); // Determine if job is saved

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    };

    const handleDetailsClick = () =>{
        if(user)
        navigate(`/description/${job._id}`)
        else
        toast.error("Log In to View Details")
    }

    const toggleBookmark = () => {
        if (user) {
            if (isSaved) {
                dispatch(removeSavedJob(job._id)); // Dispatch remove action
                toast.success("Removed from Saved Jobs");
            } else {
                dispatch(addSavedJob(job)); // Dispatch add action
                toast.success("Added to Saved Jobs");
            }
        } else {
            toast.error("Please log in to save jobs");
        }
    };

    // Force sync state with Redux after savedJobs state changes
    useEffect(() => {
        // Ensure we are responding to changes in savedJobs
        console.log("Saved jobs updated:", savedJobs);
    }, [savedJobs]); // This ensures that when savedJobs change, the component re-renders

    return (
        <div className='p-6 rounded-lg shadow-md bg-white border border-gray-200 flex flex-col justify-between h-full'>
            <div>
                <div className='flex items-center justify-between mb-4'>
                    <p className='text-sm text-gray-500'>
                        {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                    </p>
                    <Button
                        variant="outline"
                        className="rounded-full"
                        size="icon"
                        onClick={toggleBookmark}
                        
                    >
                        <Bookmark className={user ? (isSaved ? 'text-[#F83002]' : 'text-gray-500') : 'text-gray-400'} />
                    </Button>
                </div>

                <div className='flex items-center gap-3 mb-3'>
                    <Button className="p-4" variant="outline" size="icon">
                        <Avatar>
                            <AvatarImage src={job?.company?.logo} alt="Company Logo" />
                        </Avatar>
                    </Button>
                    <div>
                        <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                        <p className='text-sm text-gray-500'>{job?.location || "India"}</p>
                    </div>
                </div>

                <div className='mb-3'>
                    <h1 className='font-semibold text-xl mb-1'>{job?.title}</h1>
                    <p className='text-sm text-gray-600 line-clamp-2'>{job?.description}</p>
                </div>
            </div>

            <div>
                <div className='flex items-center gap-2 flex-wrap'>
                    <Badge className='text-blue-700 font-semibold' variant="ghost">{job?.position} Positions</Badge>
                    <Badge className='text-[#F83002] font-semibold' variant="ghost">{job?.jobType}</Badge>
                    <Badge className='text-[#7209b7] font-semibold' variant="ghost">{job?.salary} LPA</Badge>
                </div>

                <div className='flex items-center gap-4 mt-5'>
                    <Button onClick={handleDetailsClick} variant="outline">Details</Button>
                    <Button 
                        className={!user ? "bg-[#F83002] text-white" : "bg-[#F83002] text-white"} 
                        onClick={toggleBookmark}
                 
                    >
                        {user ? (isSaved ? "Unsave" : "Save For Later") : "Save For Later"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Job;
