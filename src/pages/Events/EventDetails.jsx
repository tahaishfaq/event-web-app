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
  const [guests, setGuests] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch event details
    axiosInstance
      .get(`/events/view/${id}`)
      .then((res) => {
        setEventDetails(res?.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Fetch guests attending the event
    axiosInstance
      .get(`/events/guests/${id}`)
      .then((res) => {
        const uniqueGuests = res?.data?.guests.filter(
          (guest, index, self) =>
            index === self.findIndex((g) => g._id === guest._id)
        );
        setGuests(uniqueGuests);
      })
      .catch((error) => {
        console.log("Error fetching guests: ", error);
      });
  }, [id]);

  const handleBookTicket = async (eventId) => {
    if (user?._id === eventDetails?.created_by?._id) {
      toast.error("You cannot buy/book your own ticket");
    } else {
      try {
        const res = await axiosInstance.post(`/events/book/${eventId}`);
        if (res?.data?.authorization_url) {
          window.location.href = res.data.authorization_url;
        }else{
          toast.success(res?.data?.message)
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
      }
    }
  };

  if (!eventDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Toaster richColors />
      <NavBar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 lg:pt-24 pt-24 ">
        <div className="w-full lg:bg-white bg-gray-100  p-0">
          <div className="bg-white">
            <div className="flex flex-col lg:flex-col md:flex-row justify-center items-center">
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
                  {eventDetails.event_address.address}
                </p>
              </div>
              <div className="w-full py-4">
                <video
                  src={eventDetails.event_video}
                  className="w-full h-auto"
                  controls
                  autoPlay
                  muted
                  loop
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
                {eventDetails.event_address.address}
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
                R{eventDetails.ticket_price}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-start gap-y-3">
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
            <button
              onClick={() => handleBookTicket(eventDetails._id)}
              className="bg-purple-500 text-white px-4 py-2 rounded lg:block hidden w-full hover:bg-purple-600"
            >
              Book Ticket
            </button>
          </div>
        </div>

        {/* Google Map */}
        <div className="flex flex-col items-start w-full py-6">
          <iframe
            className="w-full rounded-lg h-60 sm:h-96"
            marginHeight="0"
            marginWidth="0"
            src={`https://maps.google.com/maps?q=${eventDetails?.event_address?.latitude},${eventDetails?.event_address?.longitude}&hl=en&z=14&output=embed`}
            allowFullScreen=""
            loading="lazy"
            title="Event Location"
          ></iframe>
        </div>

        {/* Guest List Table */}
        <div className="flex flex-col mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Guests Attending
          </h2>
          {guests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      Profile Picture
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      Full Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      Gender
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      Phone #
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-4 py-2">
                        <img
                          src={guest.profile_picture}
                          alt={guest.fullname}
                          className="h-10 w-10 rounded-full"
                        />
                      </td>
                      <td className="px-4 py-2">{guest.fullname}</td>
                      <td className="px-4 py-2">{guest.email}</td>
                      <td className="px-4 py-2 capitalize">{guest.gender}</td>
                      <td className="px-4 py-2">{guest.phone_number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-700">No guests have joined yet.</p>
          )}
        </div>

        <button
          onClick={() => handleBookTicket(eventDetails._id)}
          className="bg-purple-500 text-white px-4 py-2 rounded  w-full hover:bg-purple-600 lg:hidden block"
        >
          Book Ticket
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetails;
