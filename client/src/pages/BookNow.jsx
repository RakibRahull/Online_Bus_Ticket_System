import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { Row, Col, message, Tabs } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import BusStandMap from "../components/BusStandMap";
import StripeCheckout from "react-stripe-checkout";
import { Helmet } from "react-helmet";
import moment from "moment";

const { TabPane } = Tabs;

function BookNow() {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);
  const [busStands, setBusStands] = useState([]);
  const [fromStand, setFromStand] = useState(null);
  const [toStand, setToStand] = useState(null);

  const getBus = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get(`/api/buses/${params.id}`);
      dispatch(HideLoading());
      if (response.data.success) {
        setBus(response.data.data);
        await getBusStands(response.data.data.from, response.data.data.to);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch, params.id]);

  const getBusStands = async (fromCity, toCity) => {
    try {
      dispatch(ShowLoading());
      const fromResponse = await axiosInstance.get(`/api/bus-stands/city/${fromCity}`);
      if (fromResponse.data.success && fromResponse.data.data.length > 0) {
        setFromStand(fromResponse.data.data[0]);
      }
      const toResponse = await axiosInstance.get(`/api/bus-stands/city/${toCity}`);
      if (toResponse.data.success && toResponse.data.data.length > 0) {
        setToStand(toResponse.data.data[0]);
      }
      const allStands = [
        ...(fromResponse.data.success ? fromResponse.data.data : []),
        ...(toResponse.data.success ? toResponse.data.data : [])
      ];
      setBusStands(allStands);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      console.error("Error fetching bus stands:", error);
    }
  };

  const bookNow = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        `/api/bookings/book-seat/${localStorage.getItem("user_id")}`,
        {
          bus: bus._id,
          seats: selectedSeats,
          transactionId,
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/bookings");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const onToken = async (token) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/bookings/make-payment", {
        token,
        amount: selectedSeats.length * bus.price,
      });

      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        bookNow(response.data.data.transactionId);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBus();
  }, [getBus]);

  return (
    <>
      <Helmet>
        <title>Book Now</title>
      </Helmet>
      <div>
        {bus && (
          <Row className="m-3 p-5" gutter={[30, 30]}>
            <Col lg={12} xs={24} sm={24}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Select Seats" key="1">
                  <SeatSelection
                    selectedSeats={selectedSeats}
                    setSelectedSeats={setSelectedSeats}
                    bus={bus}
                  />
                </TabPane>
                <TabPane tab="View Bus Stands" key="2">
                  <div className="p-2 bg-white rounded-xl shadow-md">
                    <h3 className="text-lg font-bold mb-4">Bus Terminal Locations</h3>
                    <BusStandMap 
                      busStands={busStands} 
                      selectedLocation={fromStand?.location}
                    />
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fromStand && (
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-bold text-primary">{bus.from} Terminal</h4>
                          <p className="text-gray-700">{fromStand.name}</p>
                          <p className="text-sm text-gray-500">{fromStand.address}</p>
                          {fromStand.contactNumber && (
                            <p className="text-sm mt-1">
                              <span className="font-medium">Contact:</span> {fromStand.contactNumber}
                            </p>
                          )}
                        </div>
                      )}
                      {toStand && (
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-bold text-secondary">{bus.to} Terminal</h4>
                          <p className="text-gray-700">{toStand.name}</p>
                          <p className="text-sm text-gray-500">{toStand.address}</p>
                          {toStand.contactNumber && (
                            <p className="text-sm mt-1">
                              <span className="font-medium">Contact:</span> {toStand.contactNumber}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </Col>
            <Col lg={12} xs={24} sm={24}>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-primary rounded-full p-2">
                    <i className="ri-bus-line text-white text-xl"></i>
                  </div>
                  <div className="ml-3">
                    <h2 className="text-2xl font-bold text-primary-dark">{bus.name}</h2>
                    <p className="text-gray-600">Bus #{bus.busNumber}</p>
                  </div>
                </div>
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-left">
                      <span className="text-sm text-gray-500">From</span>
                      <p className="text-lg font-semibold">{bus.from}</p>
                    </div>
                    <div className="flex-1 mx-4 relative">
                      <div className="h-0.5 bg-gray-300 absolute w-full top-1/2"></div>
                      <div className="flex justify-between relative">
                        <div className="w-2 h-2 rounded-full bg-primary -mt-0.5"></div>
                        <div className="w-2 h-2 rounded-full bg-primary -mt-0.5"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">To</span>
                      <p className="text-lg font-semibold">{bus.to}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className="text-sm text-gray-500">Departure</span>
                      <p className="font-semibold">{moment(bus.departure, "HH:mm").format("hh:mm A")}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Journey Date</span>
                      <p className="font-semibold">{bus.journeyDate}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Arrival</span>
                      <p className="font-semibold">{moment(bus.arrival, "HH:mm").format("hh:mm A")}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Seat Capacity</span>
                    <span className="font-medium">{bus.capacity}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Available Seats</span>
                    <span className="font-medium">{bus.capacity - bus.seatsBooked.length}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Price per seat</span>
                    <span className="font-medium">৳{bus.price}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Selected Seats:</span>
                    <span className="font-bold">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-primary">৳{bus.price * selectedSeats.length}</span>
                  </div>
                </div>
                <StripeCheckout
                  billingAddress
                  disabled={selectedSeats.length === 0}
                  token={onToken}
                  amount={bus.price * selectedSeats.length * 100}
                  currency="BDT"
                  stripeKey="pk_test_ZT7RmqCIjI0PqcpDF9jzOqAS"
                >
                  
                  <button
                    className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
                      selectedSeats.length === 0
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "bg-primary hover:bg-primary-dark text-white"
                    }`}
                    disabled={selectedSeats.length === 0}
                  >
                    <i className="ri-secure-payment-line"></i>
                    {selectedSeats.length === 0 ? 'Select seats to continue' : 'Pay Now'}
                  </button>
                </StripeCheckout>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
}

export default BookNow;
