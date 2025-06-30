import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const RecruiterLogin = () => {

    const {user} = useSelector(store=>store.auth);

    if (user){
        return null
    }

    return (
        <div className="max-w-7xl mx-auto my-20">
            <h1 className="text-4xl font-bold">Join Us As <span className="text-[#F83002]">Recruiter</span> </h1>
            <div className="bg-gray-100 px-3 pb-5 rounded">
                <p className="mx-auto text-left p-4 text-sm sm:text-base md:text-lg text-gray-500 mt-10">"Advertise your jobs to millions of active job seekers monthly and access a vast candidate database".Reach millions of job seekers and simplify hiring with advanced search, dynamic filtering, and convenient bookmarking features. Showcase your job listings to a vast network, ensuring you connect with qualified talent faster and more efficiently.</p>
                <div className='flex items-center gap-4 mt-3'>
                    <Link to="/login"><Button variant="outline">Login as Recruiter</Button></Link>
                    <Link to="/signup"><Button className="bg-[#F83002]">Create an account</Button></Link>
                </div>
            </div>


        </div>
    )
}
export default RecruiterLogin;