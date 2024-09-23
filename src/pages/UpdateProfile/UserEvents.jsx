import React from "react";

import moment from "moment";

const UserEvents = ({ events }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Your Events</h2>
      <div className="lg:py-10 py-2">
        {events?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {events?.map((event) => (
              <div key={event._id} className="relative">
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
