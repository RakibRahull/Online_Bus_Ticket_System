import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.jpg";
import moment from "moment";

function Bus({ bus }) {
  const navigate = useNavigate();
  
  const bookTrip = () => {
    if (localStorage.getItem("user_id")) {
      navigate(`/book-now/${bus._id}`);
    } else {
      navigate(`/login`);
      localStorage.setItem("idTrip", bus._id);
    }
  };
  
  return (
    <div className="bg-white rounded-xl border mx-5 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="bg-primary-light/10 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-full p-2">
            <i className="ri-bus-line text-white text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary-dark">{bus.name}</h3>
            <p className="text-sm text-gray-600">Bus #{bus.busNumber}</p>
          </div>
        </div>
        <div className="bg-primary/10 rounded-lg px-3 py-1">
          <p className="font-medium text-primary-dark">{bus.journeyDate}</p>
        </div>
      </div>
      
      {/* Journey Details */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <p className="text-xl font-bold">{moment(bus.departure, "HH:mm").format("hh:mm A")}</p>
            <p className="text-sm text-gray-500">{bus.from}</p>
          </div>
          
          <div className="flex-1 mx-4 relative">
            <div className="h-0.5 bg-gray-300 absolute w-full top-1/2"></div>
            <div className="flex justify-between relative">
              <div className="w-3 h-3 rounded-full bg-primary -mt-1"></div>
              <div className="w-3 h-3 rounded-full bg-secondary -mt-1"></div>
            </div>
            <p className="text-center text-xs text-gray-500 mt-1">
              {calculateDuration(bus.departure, bus.arrival)}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-xl font-bold">{moment(bus.arrival, "HH:mm").format("hh:mm A")}</p>
            <p className="text-sm text-gray-500">{bus.to}</p>
          </div>
        </div>
        
        {/* Footer with details and CTA */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Price</p>
              <p className="font-bold text-lg">৳{bus.price}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Available</p>
              <p className="font-bold text-lg">{bus.capacity - bus.seatsBooked.length}/{bus.capacity}</p>
            </div>
          </div>
          
          <button 
            onClick={bookTrip}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-all duration-300">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate journey duration
function calculateDuration(departure, arrival) {
  const dept = moment(departure, "HH:mm");
  const arrv = moment(arrival, "HH:mm");
  
  // Handle overnight journeys
  if (arrv.isBefore(dept)) {
    arrv.add(1, 'day');
  }
  
  const duration = moment.duration(arrv.diff(dept));
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  
  return `${hours}h ${minutes}m`;
}

export default Bus;
