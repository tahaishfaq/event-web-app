import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { toast, Toaster } from "sonner";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    try {
      axiosInstance.get(`/events/view/${id}`).then((res) => {
        console.log("single-event", res?.data);
        setEventDetails(res?.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  if (!eventDetails) {
    return <div>Loading...</div>;
  }

  const handleBookTicket = async (eventId) => {
    if (user?._id === eventDetails?.created_by?._id) {
      toast.error("You cannot buy/book your own ticket");
    } else {
      try {
        const res = await axiosInstance.post(`/events/book/${eventId}`);
        console.log("bookTicket", res?.data);

        // Redirect to the authorization URL in the same tab
        if (res?.data?.authorization_url) {
          window.location.href = res.data.authorization_url;
        }
      } catch (error) {
        console.log(error);
        toast.error("Error booking ticket");
      }
    }
  };
  return (
    <div>
      <Toaster richColors />
      <NavBar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pt-24 lg:hidden md:hidden">
        <div className="w-full bg-gray-100 lg:p-6 p-0">
          <div className="bg-white">
            <div className="flex flex-col md:flex-row justify-center items-center">
              <div className="w-full">
                <Link
                  to="/events"
                  className="text-sm text-gray-700 hover:text-gray-500 flex items-center"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                  Back
                </Link>
                <h2 className="text-3xl font-bold text-gray-900 mt-4">
                  {eventDetails.event_title}
                </h2>
                <p className="text-sm text-gray-700 mt-2">
                  By {eventDetails.created_by.fullname}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  {eventDetails.event_address}
                </p>
              </div>
              <div className="w-full py-4">
                <video
                  src={eventDetails.event_video}
                  controls
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-700 mb-4">
              {eventDetails.event_description}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Event Details
            </h2>
            <p className="text-gray-700 mb-1">
              Date and Time:{" "}
              <span className="font-semibold">
                {moment(eventDetails.event_date_and_time).format("lll")}
              </span>
            </p>
            <p className="text-gray-700 mb-1">
              Location:{" "}
              <span className="font-semibold">
                {eventDetails.event_address}
              </span>
            </p>
            <p className="text-gray-700 mb-1">
              Category:{" "}
              <span className="font-semibold">{eventDetails.category}</span>
            </p>
            <p className="text-gray-700 mb-1">
              Maximum Capacity:{" "}
              <span className="font-semibold">
                {eventDetails.event_max_capacity}
              </span>
            </p>
            <p className="text-gray-700 mb-1">
              Additional Info:{" "}
              <span className="font-semibold">
                {eventDetails.additional_info}
              </span>
            </p>
            <p className="text-gray-700 mb-1">
              Ticket Price:{" "}
              <span className="font-semibold">
                ${eventDetails.ticket_price}
              </span>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Organizer Contact
            </h2>
            <p className="text-gray-700 mb-1">
              Name:{" "}
              <span className="font-semibold">
                {eventDetails.created_by.fullname}
              </span>
            </p>
            <p className="text-gray-700 mb-1">
              Email:{" "}
              <span className="font-semibold">
                {eventDetails.created_by.email}
              </span>
            </p>
            <p className="text-gray-700 mb-1">
              Phone:{" "}
              <span className="font-semibold">
                {eventDetails.created_by.phone_number}
              </span>
            </p>
            <p className="text-gray-700 mb-1">
              Date of Birth:{" "}
              <span className="font-semibold">
                {moment(eventDetails.created_by.dateOfBirth).format("ll")}
              </span>
            </p>
          </div>
          <div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.108037150107!2d-122.4194154846815!3d37.77492977975866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085814d2f2b6e69%3A0xe7bfbd763b144f70!2sBalai%20Kartini!5e0!3m2!1sen!2sus!4v1619159261515!5m2!1sen!2sus"
              className="w-full h-48 object-cover mb-4"
              allowFullScreen=""
              loading="lazy"
              title="Event Location"
            ></iframe>
          </div>
          <div>
            <button
              onClick={() => handleBookTicket(eventDetails._id)}
              className="bg-purple-500 text-white px-4 py-2 rounded  w-full hover:bg-purple-600"
            >
              Book Ticket
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetails;
