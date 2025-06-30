import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Briefcase, LogOut, User2 } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const navLinks = user && user.role === 'recruiter'
        ? [{ to: "/admin/companies", label: "Companies" }, { to: "/admin/jobs", label: "Jobs" }]
        : user?.role !== 'admin'
        ? [{ to: "/", label: "Home" }, { to: "/jobs", label: "Jobs" }, { to: "/browse", label: "Browse" }]
        : [];

    return (
        <div className='bg-white'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-20'>
                <div>
                    <img
                        src="/mainLogoText.png"
                        alt="company logo"
                        className="h-[170px] p-3"
                    />
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {navLinks.map((link) => (
                            <li key={link.to} className="relative">
                                <Link
                                    to={link.to}
                                    className={`relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-[#F83002] after:w-full after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 ${location.pathname === link.to ? 'after:scale-x-100' : ''
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {!user ? (
                        <div className='flex items-center gap-2'>
                            <Link to="/login"><Button variant="outline">Login</Button></Link>
                            <Link to="/signup"><Button className="bg-[#F83002] hover:bg-[black]">Signup</Button></Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    {user.role === 'admin' ? (
                                        <AvatarFallback>A</AvatarFallback>
                                    ) : (
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="user photo" />
                                    )}
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div>
                                    <div className='flex gap-2 space-y-2'>
                                        <Avatar className="cursor-pointer">
                                            {user.role === 'admin' ? (
                                                <AvatarFallback>A</AvatarFallback>
                                            ) : (
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="user photo" />
                                            )}
                                        </Avatar>
                                        <div>
                                            <h4 className='font-medium'>{user?.fullname}</h4>
                                            <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col my-2 text-gray-600'>
                                        {user.role === 'student' && (
                                            <>
                                                <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                    <User2 />
                                                    <Button variant="link">
                                                        <Link to="/profile">View Profile</Link>
                                                    </Button>
                                                </div>
                                                <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                    <Briefcase />
                                                    <Button variant="link">
                                                        <Link to="/savedjob">Saved Jobs</Link>
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                        <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                            <LogOut />
                                            <Button onClick={logoutHandler} variant="link">Logout</Button>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar;
