import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery, selectFilteredJobs } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Input } from "@/components/ui/input";

const Browse = () => {
    // Call hook to fetch all jobs
    useGetAllJobs();
    
    const dispatch = useDispatch();
    
    // Get current search query and filtered jobs from Redux
    const currentSearchQuery = useSelector((state) => state.job.searchedQuery);
    const allJobs = useSelector((state) => state.job.allJobs);
    const [search, setSearch] = useState(currentSearchQuery);

    // Filter jobs based on search query
    const filteredJobs = allJobs.filter(job => 
        job.title.toLowerCase().includes(currentSearchQuery.toLowerCase())
    );

    // Update local search state when Redux search query changes
    useEffect(() => {
        setSearch(currentSearchQuery);
    }, [currentSearchQuery]);

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearch(query);
        dispatch(setSearchedQuery(query));
    };

    // useEffect(() => {
    //     dispatch(setSearchedQuery('')); // Clear search query in Redux when location changes
    //     setSearch(''); // Clear local search state
    // }, [location, dispatch]);

    // For debugging
    useEffect(() => {
        document.title = "Jobaroo | Browse"
        console.log('Current search query:', currentSearchQuery);
        console.log('All jobs:', allJobs);
        console.log('Filtered jobs:', filteredJobs);
    }, [currentSearchQuery, allJobs, filteredJobs]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <Input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search jobs by title..."
                        className="w-full mb-6"
                    />
                    
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-xl font-bold text-gray-900">
                            Search Results 
                            <span className="ml-2 text-gray-600">
                                ({filteredJobs.length})
                            </span>
                        </h1>
                    </div>

                    {filteredJobs.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No jobs found matching your search criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredJobs.map((job) => (
                                <Job key={job._id} job={job} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Browse;