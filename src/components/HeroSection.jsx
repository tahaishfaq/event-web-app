import React from 'react';
import Event from '../assets/event.jpg';

const HeroSection = () => {
  return (
    <div className="w-full bg-gray-100 lg:p-6 p-0">
      <div className="bg-white">
        <div
          className="lg:h-96 h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${Event})` }}
        >
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="w-full md:w-2/4 p-8">
              <button className="text-sm text-white hover:text-gray-500 flex items-center">
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
              </button>
              <h2 className="text-3xl font-bold text-white mt-4">
                Dream World Wide in Jakarta
              </h2>
              <p className="text-sm text-white mt-2">By Saepul Rohman</p>
              <p className="text-sm text-white mt-2">
                Balai Kartini, Nusa Indah Theatre, Jl. Gatot Subroto No. 37,
                Kuningan, Jakarta Selatan, Jakarta, Indonesia
              </p>
              <button className="text-sm text-white hover:text-gray-500 mt-4 flex items-center">
                <svg
                  className="w-4 h-4 inline-block mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 20l-5.447-2.724A2 2 0 012 15.382V8.618a2 2 0 011.553-1.894L9 4m10 0l5.447 2.724A2 2 0 0122 8.618v6.764a2 2 0 01-1.553 1.894L15 20m0-16l-5 10m5-10L9 20"
                  ></path>
                </svg>
                View Map
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
