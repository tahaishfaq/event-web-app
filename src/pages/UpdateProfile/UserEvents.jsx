import React from "react";

import moment from "moment";
import { IoShareSocialOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const UserEvents = ({ events }) => {
  const handleShare = (event) => {
    const shareData = {
      title: event.event_title,
      text: event.event_description,
      url: window.location.origin + `/single-event/${event?._id}`,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("Event shared successfully"))
        .catch((error) => console.error("Error sharing event", error));
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Events History</h2>
      <div className="lg:py-10 py-2">
        {events?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {events?.map((event) => (
              <div key={event._id} className="relative">
              <div
                className="absolute -top-5 -right-2 z-[1000] cursor-pointer"
                onClick={() =>
                  navigate(`/user-profile/${event?.created_by?._id}`)
                }
              >
                {event?.created_by?.profile_picture ? (
                  <img
                    src={event?.created_by?.profile_picture}
                    alt="profile"
                    className="w-12 h-12 rounded-full bg-gray-100 object-cover object-center"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                    {event?.created_by?.fullname
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>
                )}
              </div>

              <div className="bg-white shadow rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                <video
                  src={event.event_video}
                  className="w-full h-48 object-cover object-center"
                  controls
                  autoPlay
                  muted
                  loop
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
                        : `R${event.ticket_price}`}
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
                      {event?.event_address?.address}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {event.event_description}
                    </p>
                  </div>
                </div>

                {/* Show Booked Users or No Attendees Message */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-x-3">
                      {event.booked_tickets &&
                      event.booked_tickets.length > 0 ? (
                        <div className="flex -space-x-1 overflow-hidden">
                          {event.booked_tickets
                            ?.filter(
                              (user, index, self) =>
                                index ===
                                self.findIndex((u) => u._id === user._id)
                            )
                            ?.slice(0, 3)
                            ?.map((user, index) => (
                              <Link
                                to={`/user-profile/${user?._id}`}
                                key={index}
                              >
                                <img
                                  alt={user.fullname}
                                  src={user.profile_picture}
                                  className="inline-block h-6 w-6 object-center object-cover rounded-full ring-2 ring-white"
                                />
                              </Link>
                            ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No one has joined yet
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {event.booked_tickets &&
                        event.booked_tickets.length > 0
                          ? "Members Joined"
                          : ""}
                      </p>
                    </div>
                    {/* Share Button */}
                    <button
                      onClick={() => handleShare(event)}
                      className="bg-purple-500 text-white px-4 flex items-center gap-x-2 py-1.5 rounded-md font-medium hover:bg-purple-600"
                    >
                      <IoShareSocialOutline />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-semibold text-gray-900">
              No Events Found
            </h3>
            <p className="text-sm text-gray-500">
              You have not created any events yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEvents;
