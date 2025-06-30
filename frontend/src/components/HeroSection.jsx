import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [search, setSearch] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearch = () => {
        if (search.trim()) {
            dispatch(setSearchedQuery(search.trim()));
            navigate("/browse");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="text-center">
            <div className="flex flex-col gap-5 my-10">
                <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium">
                    No Jobs | JOBAROO Hai Na
                </span>
                <h1 className="text-5xl font-bold">
                    Search, Apply & <br /> Get Your <span className="text-[#F83002]">Dream Jobs</span>
                </h1>
                <p className="mx-auto text-center p-4 text-sm sm:text-base md:text-lg text-gray-500">
                    Welcome to Jobaroo—your job search partner. Easily find and apply for your dream job with tailored recommendations. Start your journey today!
                </p>

                <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Search jobs by title..."
                        className="w-full p-2 rounded-l-full focus:outline-none"
                    />
                    <Button 
                        onClick={handleSearch} 
                        className="rounded-r-full bg-[#F83002] hover:bg-[#d62802]"
                    >
                        <Search className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;