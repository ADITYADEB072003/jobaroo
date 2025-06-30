import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import HeroSection from './HeroSection';
import CategoryCarousel from './CategoryCarousel';
import LatestJobs from './LatestJobs';
import Footer from './shared/Footer';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RecruiterLogin from './recruiterLogin';
import Testimonials from './Testimonials';
import { ArrowUp } from 'lucide-react';
import CompanyCarousel from './CompanyCarousel';
import Notification from './Notification';

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(!sessionStorage.getItem('hasLoaded'));

  // Notification state
  

  useEffect(() => {
    document.title = "Jobaroo";
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('hasLoaded', 'true');
      }, 2000); // Adjust time as needed
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 overflow-hidden">
        <div className="flex items-center justify-center flex-col animate-zoom-out">
          <div className='bg-transparent'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-20'>
              <div>
                <img
                  src="/mainLogo.png"
                  alt="company logo"
                  className="h-[200px] p-0"
                />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold">
            Job<span className='text-[#F83002]'>aroo</span><span className="ml-2 animate-dots text-[#F83002]">...</span>
          </h1>
        </div>
        <style jsx>{`
          @keyframes zoomOut {
            to {
              transform: scale(5);
              opacity: 0;
            }
          }
          .animate-zoom-out {
            animation: zoomOut 0.5s forwards;
            animation-delay: 1.8s;
          }
          @keyframes dots {
            0%, 20% {
              color: rgba(0, 0, 0, 0);
              text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
            }
            40% {
              color: black;
              text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
            }
            60% {
              text-shadow: 0.25em 0 0 black, 0.5em 0 0 rgba(0, 0, 0, 0);
            }
            80%, 100% {
              text-shadow: 0.25em 0 0 black, 0.5em 0 0 black;
            }
          }
          .animate-dots {
            animation: dots 1s steps(5, start) infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <CompanyCarousel />
      <RecruiterLogin />
      <Testimonials />
      <Footer />
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#F83002] text-white p-3 rounded-full shadow-lg hover:bg-black transition duration-300"
          aria-label="Scroll to Top"
        >
          <ArrowUp size={20} />
        </button>
      )}
      <Notification/> 
    </div>
  );
};

export default Home;
