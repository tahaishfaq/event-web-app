import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate();

  const categories = ["Concert", "Conference", "Workshop", "Meetup", "Party"];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axiosInstance.get("/events/viewAll");
        console.log(res);
        setEvents(res?.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = (e) => {
    console.log(e.target.value);
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
  };

  const filteredEvents = events.filter((event) => {
    if (searchTerm !== "" && categoryFilter === "") {
      return event?.event_address
        ?.toLowerCase()
        .includes(searchTerm?.toLowerCase());
    } else if (categoryFilter !== "" && searchTerm === "") {
      return categoryFilter === "" || event.category === categoryFilter;
    } else {
      return (
        event?.event_address
          ?.toLowerCase()
          .includes(searchTerm?.toLowerCase()) &&
        (categoryFilter === "" || event.category === categoryFilter)
      );
    }
  });

  return (
    <div>
      <NavBar />
      <div className="pt-14 bg-gray-100 min-h-screen lg:hidden md:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="flex items-center justify-between w-full pb-8">
            <h2 className="text-2xl font-bold text-gray-900">All Events</h2>
            <Link
              to="/add-event"
              className="bg-purple-500 text-white px-4 py-1.5 rounded-md font-medium hover:bg-purple-600"
            >
              Add Event
            </Link>
          </div>
          <div className="flex items-center justify-between w-full pb-8">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by location"
              className="border rounded px-3 py-2 w-full sm:w-1/2 lg:w-1/3 mr-4"
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-5">
            <button
              onClick={() => handleCategoryFilter("")}
              className={`px-4 py-2 rounded-full font-medium ${
                categoryFilter === ""
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              All
            </button>
            {categories?.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-4 py-2 rounded-full font-medium ${
                  categoryFilter === category
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event._id} className=" relative">
                  <div className="absolute -top-5 -right-2 z-[1000]">
                    <img
                      src={
                        event?.created_by?.profile_picture ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      }
                      alt="profile"
                      className="w-12 h-12 rounded-full bg-gray-100 object-cover object-center"
                    />
                  </div>
                  <div className="bg-white shadow rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                    <video
                      src={event.event_video}
                      className="w-full h-40 object-cover"
                      controls
                    />
                    <div
                      onClick={() => navigate(`/single-event/${event?._id}`)}
                      className="p-4 cursor-pointer"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span
                          className={`text-sm ${
                            event.ticket_price === 0
                              ? "bg-green-500"
                              : "bg-purple-500"
                          } text-white px-2 py-1 rounded font-semibold`}
                        >
                          {event.ticket_price === 0
                            ? "Free"
                            : `$${event.ticket_price}`}
                        </span>
                        <span className="text-purple-700 bg-purple-100 px-2 py-1 rounded-full text-sm font-semibold">
                          {event.category}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {moment(event.event_date_and_time).format("lll")}
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900 mt-1">
                          {event.event_title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {event.event_address}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {event.event_description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-semibold text-gray-900">
                No Data Found
              </h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Events;
