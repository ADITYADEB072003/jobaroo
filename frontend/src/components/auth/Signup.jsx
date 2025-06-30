import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: "",
        educationalQualification: "",
        otherQualification: "",
        yearOfPassing: ""
    });

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loading } = useSelector(store => store.auth);

    const qualifications = [
        "High School Diploma",
        "Associate's Degree",
        "Bachelor's in Computer Science",
        "Bachelor's in Engineering",
        "Bachelor's in Business",
        "Master's in Computer Science",
        "Master's in Engineering",
        "Master's in Business Administration",
        "PhD",
        "Other"
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear + i);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }

    const handleQualificationChange = (value) => {
        setInput({ 
            ...input, 
            educationalQualification: value,
            // Reset otherQualification when switching away from "Other"
            otherQualification: value !== "Other" ? "" : input.otherQualification 
        });
    }

    const handleYearChange = (value) => {
        setInput({ ...input, yearOfPassing: value });
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        const formdata = new FormData();
        formdata.append("fullname", input.fullname);
        formdata.append("email", input.email);
        formdata.append("phoneNumber", input.phoneNumber);
        formdata.append("password", input.password);
        formdata.append("role", input.role);
        if(input.file) {
            formdata.append("file", input.file);
        }
        if(input.role === "student") {
            // Use otherQualification if "Other" is selected, otherwise use educationalQualification
            const finalQualification = input.educationalQualification === "Other" 
                ? input.otherQualification 
                : input.educationalQualification;
            formdata.append("educationalQualification", finalQualification);
            formdata.append("yearOfPassing", input.yearOfPassing);
        }
        
        try {
            dispatch(setLoading(true))
            const res = await axios.post(`${USER_API_END_POINT}/register`, formdata, {
                headers:{
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true,
            })

            if(res.data.success){
                navigate("/login")
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center max-w-7xl mx-auto">
                <form onSubmit={submitHandler} className="w-1/2 border border-gray-200 rounded-md p-4 my-10">
                    <h1 className="font-bold text-xl mb-5">Sign Up</h1>
                    <div className="my-2">
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="Biswadeep Paul"
                        />
                    </div>
                    <div className="my-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="user@gmail.com"
                        />
                    </div>
                    <div className="my-2">
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="872XXXXXXX"
                        />
                    </div>
                    <div className="my-2">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <RadioGroup className="flex items-center gap-4 m-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r1">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        <div className="flex items-center gap-2">
                            <Label>Profile</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>

                    {input.role === 'student' && (
                        <>
                            <div className="my-2">
                                <Label>Educational Qualification</Label>
                                <Select
                                    value={input.educationalQualification}
                                    onValueChange={handleQualificationChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select qualification" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {qualifications.map((qual) => (
                                            <SelectItem key={qual} value={qual}>
                                                {qual}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            {input.educationalQualification === "Other" && (
                                <div className="my-2">
                                    <Label>Other Qualification</Label>
                                    <Input
                                        type="text"
                                        name="otherQualification"
                                        value={input.otherQualification}
                                        onChange={changeEventHandler}
                                        placeholder="Enter your qualification"
                                        className="mt-1"
                                    />
                                </div>
                            )}

                            <div className="my-2">
                                <Label>Year of Passing</Label>
                                <Select
                                    value={input.yearOfPassing}
                                    onValueChange={handleYearChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {loading ? 
                        <Button className="w-full my-4">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please Wait
                        </Button> 
                        : 
                        <Button type="submit" className="w-full my-4 bg-[#F83002]">
                            SignIn
                        </Button>
                    }
                    <span className="text-sm">
                        Already have an account? <Link to="/login" className="text-blue-600">LogIn</Link>
                    </span>
                </form>
            </div>
        </div>
    )
}

export default Signup