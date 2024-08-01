import React from 'react';

const EventDetails = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 mb-4">
            It is the grandiose vision of the Dream World Wide program to allow learning of the original Arabic language of the Quran easy to learn and accessible regardless of a person's language of origin. We want to empower as many students and teachers around the world as possible with our unprecedented Qur'anic language curriculum and hope to create a worldwide network of students that learn from each other and their instructions and remain connected indefinitely. Join us today to begin your journey!
          </p>
          <p className="text-gray-700 mb-8">
            We want to empower as many students and teachers around the world as possible with our unprecedented Qur'anic language curriculum and hope to create a worldwide network of students that learn from each other and their instructions and remain connected indefinitely. Join us today to begin your journey!
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hours</h2>
          <p className="text-gray-700 mb-1">
            Weekday Hours: <span className="font-semibold">7 PM - 10 PM</span>
          </p>
          <p className="text-gray-700 mb-8">
            Sunday Hours: <span className="font-semibold">10 AM - 3 PM</span>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">How can I contact the organizer with any question?</h2>
          <p className="text-gray-700">
            Please visit <a href="http://www.dreamworldwide.net" className="text-purple-600 hover:underline">www.dreamworldwide.net</a> and refer to the FAQ section for all questions and contact information.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Location</h2>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.108037150107!2d-122.4194154846815!3d37.77492977975866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085814d2f2b6e69%3A0xe7bfbd763b144f70!2sBalai%20Kartini!5e0!3m2!1sen!2sus!4v1619159261515!5m2!1sen!2sus" 
            className="w-full h-48 object-cover mb-4" 
            allowFullScreen="" 
            loading="lazy"
            title="Event Location"
          ></iframe>
          <p className="text-gray-700 mb-8">
            Dream World Wide in Jakarta<br />
            Balai Kartini, Nusa Indah Theatre, Jl. Gatot Subroto No. 37, Kuningan, Jakarta Selatan, Jakarta, Indonesia
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">Indonesia Events</span>
            <span className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">Jakarta Events</span>
            <span className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">UI</span>
            <span className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">Thing To Do In Jakarta</span>
            <span className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">Jakarta Seminar</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Share With Friends</h2>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook</a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Twitter</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
