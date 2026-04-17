import React from "react";

function SeatSelection({ selectedSeats, setSelectedSeats, bus }) {
  const capacity = bus.capacity;

  const selectOrUnselectSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };
  
  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-bold mb-2">Select Your Seats</h3>
        <div className="flex justify-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded-sm mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-primary rounded-sm mr-2"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>
      
      {/* Bus front */}
      <div className="relative w-full h-12 mb-6">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-full bg-gray-300 rounded-t-xl flex items-center justify-center">
          <span className="text-sm font-medium">Driver</span>
        </div>
      </div>
      
      {/* Seats grid */}
      <div className="grid grid-cols-5 gap-2 mx-auto max-w-sm">
        {Array.from(Array(capacity).keys()).map((seat) => {
          const seatNumber = seat + 1;
          let seatClass = "bg-white border border-gray-300 hover:border-primary";
          
          if (selectedSeats.includes(seatNumber)) {
            seatClass = "bg-primary text-white border border-primary";
          } else if (bus.seatsBooked.includes(seatNumber)) {
            seatClass = "bg-red-500 text-white cursor-not-allowed";
          }
          
          // Skip aisle for middle seats (column 3)
          if (seatNumber % 5 === 3) {
            return <div key={`aisle-${seat}`} className="flex items-center justify-center">
              <span className="text-xs text-gray-400">aisle</span>
            </div>;
          }
          
          return (
            <button 
              key={seat}
              className={`h-10 rounded flex items-center justify-center transition-all duration-200 transform hover:scale-105 ${seatClass} ${bus.seatsBooked.includes(seatNumber) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => !bus.seatsBooked.includes(seatNumber) && selectOrUnselectSeat(seatNumber)}
            >
              {seatNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SeatSelection;
