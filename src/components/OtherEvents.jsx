import React from 'react';
import event1 from '../assets/Event1.jpg'
import Event2 from '../assets/Event2.jpg'

const events = [
  {
    id: 1,
    price: "$10.00",
    image: event1 ,
    date: "SEP 18",
    title: "Indonesia - Korea Conference",
    location: "Soehanna, Daerah Khusus Ibukota Yogyakarta, Indonesia",
    isFree: false,
  },
  {
    id: 2,
    price: "FREE",
    image: Event2 ,
    date: "SEP 17",
    title: "Dream World Wide in Jakarta",
    location: "Soehanna, Daerah Khusus Ibukota Yogyakarta, Indonesia",
    isFree: true,
  },
  {
    id: 3,
    price: "$12.00",
    image: event1 ,
    date: "SEP 16",
    title: "Pesta Kembang Api Terbesar",
    location: "Soehanna, Daerah Khusus Ibukota Yogyakarta, Indonesia",
    isFree: false,
  },
  {
    id: 4,
    price: "$10.00",
    image: Event2 ,
    date: "SEP 12",
    title: "UI UX Design & Prototyping",
    location: "Soehanna, Daerah Khusus Ibukota Yogyakarta, Indonesia",
    isFree: false,
  },
  {
    id: 5,
    price: "FREE",
    image: event1 ,
    date: "SEP 11",
    title: "Presiden Amerika Ke Indonesia",
    location: "Soehanna, Daerah Khusus Ibukota Yogyakarta, Indonesia",
    isFree: true,
  },
  {
    id: 6,
    price: "$12.00",
    image: Event2 ,
    date: "SEP 10",
    title: "Tahap Awal Belajar UI UX",
    location: "Soehanna, Daerah Khusus Ibukota Yogyakarta, Indonesia",
    isFree: false,
  },
];

const OtherEvents = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Other Events You May Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-white shadow rounded-lg overflow-hidden">
            <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${event.isFree ? 'bg-green-500' : 'bg-purple-500'} text-white px-2 py-1 rounded`}>{event.price}</span>
                <button className="text-gray-500 hover:text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">{event.date}</p>
                <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherEvents;
