import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const companyLogos = [
    { id: 1, src: '/logo1.png', alt: 'Company 1' },
    { id: 2, src: '/logo2.png', alt: 'Company 2' },
    { id: 3, src: '/logo3.jpg', alt: 'Company 3' },
    { id: 4, src: '/logo4.jpg', alt: 'Company 4' },
    { id: 5, src: '/logo5.png', alt: 'Company 5' },
    // Add more logos as needed
];

const CompanyCarousel = () => {
    const settings = {
        dots: false, // Show navigation dots
        infinite: true, // Infinite loop
        speed: 500, // Transition speed
        slidesToShow: 5, // Number of logos to show at once
        slidesToScroll: 1, // Number of logos to scroll at once
        autoplay: true, // Enable autoplay
        autoplaySpeed: 2000, // Time between transitions
        pauseOnHover: false, // Pause on hover
        arrows:false,
        responsive: [
            {
                breakpoint: 1024, // Adjust settings for smaller screens
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className='bg-gray-100 p-2'>
        <div className="max-w-7xl mx-auto my-5">
            <h2 className="text-4xl font-bold text-center pb-10">
                Trusted by <span className='text-[#F83002]'>Top Companies</span>
            </h2>
            <Slider {...settings}>
                {companyLogos.map((logo) => (
                    <div key={logo.id} className="flex items-center justify-center p-4">
                        <img
                            src={logo.src}
                            alt={logo.alt}
                            className="h-20 w-auto transition-transform duration-300 hover:scale-110 mx-auto rounded-100" // mx-auto centers the image
                        />
                    </div>
                ))}
            </Slider>
        </div>
        </div>
    );
};

export default CompanyCarousel;
