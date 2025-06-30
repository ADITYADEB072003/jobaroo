import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      position: "Software Engineer",
      feedback:
        "This platform helped me land my dream job! The search filters and bookmarking features made the whole process easy and efficient.",
      image: "/face1.jpg",
    },
    {
      id: 2,
      name: "Sophia Lee",
      position: "Product Manager",
      feedback:
        "Thanks to this job board, I could connect with top companies and explore opportunities that fit my profile. Highly recommended!",
      image: "/face3.jpg",
    },
    {
      id: 3,
      name: "Daniel Green",
      position: "UX Designer",
      feedback:
        "The website’s advanced search and recommendation features saved me a lot of time. I found great job listings tailored to my skills.",
      image: "/face2.jpg",
    },
    {
      id: 4,
      name: "Emily White",
      position: "Data Scientist",
      feedback:
        "This platform stands out for its user-friendly interface and helpful features. I found the perfect role within weeks!",
      image: "/face4.jpg",
    },
  ];

  return (
    <div className="bg-gray-50 py-12 px-8">
      <h2 className="text-4xl font-bold text-center pb-4">Testi<span className="text-[#F83002]">monials</span></h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center text-center"
          >
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="rounded-full w-24 h-24 mb-4 object-cover"
            />
            <h3 className="text-lg font-semibold">{testimonial.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{testimonial.position}</p>
            <p className="text-gray-700">{testimonial.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
