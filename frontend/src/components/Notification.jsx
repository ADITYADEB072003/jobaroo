import React, { useState } from "react";
import { X, Bell } from "lucide-react"; // Icon for closing the panel
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true); // Start with unread notifications
  const { allJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false); // Mark notifications as read when panel is opened
    }
  };

  return (
    <>
      {/* Button to open notification panel */}
      {user && (
        <button
          onClick={togglePanel}
          className={`fixed bottom-24 right-8 bg-[#F83002] text-white p-3 rounded-full shadow-lg hover:bg-black transition duration-300 ${
            hasUnread ? "animate-bounce" : ""
          }`}
        >
          <Bell />
        </button>
      )}

      {/* Conditionally render the notification panel based on isOpen */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-20 w-80 bg-white shadow-lg rounded-lg"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {/* Close button and header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <button onClick={togglePanel} aria-label="Close panel">
              <X className="text-gray-500 hover:text-black" />
            </button>
          </div>

          {/* Notification content */}
          <div className="p-4 space-y-4">
            {allJobs.length > 0 ? (
              allJobs.map((job) => {
                if (job._id) {
                  return (
                    <div
                      key={job._id}
                      className="p-3 bg-gray-100 rounded-lg shadow cursor-pointer"
                      onClick={() => navigate(`/description/${job._id}`)} 
                    >
                      <span className="font-bold">New job posted:</span> {job.title}
                    </div>
                  );
                } else {
                  // If job._id is undefined or missing, skip rendering this notification
                  console.warn("Job ID is missing for job:", job);
                  return null;
                }
              })
            ) : (
              <p className="text-center text-gray-500">No new notifications</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
