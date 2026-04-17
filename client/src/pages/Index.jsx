import logo from "../assets/img/logo.jpg";
import { Helmet } from "react-helmet";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import Bus from "../components/Bus";
// import BusStandMap from "../components/BusStandMap";
import { Row, message } from "antd";
import { Link } from "react-router-dom";

function Index() {
  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);
  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState({});
  // const [busStands, setBusStands] = useState([]);
  // const [majorCities, setMajorCities] = useState([]);
  // const [selectedCity, setSelectedCity] = useState(null);

  const getBusesByFilter = useCallback(async () => {
    dispatch(ShowLoading());
    const from = filters.from;
    const to = filters.to;
    const journeyDate = filters.journeyDate;
    try {
      const { data } = await axiosInstance.post(
        `/api/buses/get?from=${from}&to=${to}&journeyDate=${journeyDate}`
      );

      setBuses(data.data);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.response.data.message);
    }
  }, [filters, dispatch]);

  useEffect(() => {
    axiosInstance.get("/api/cities/get-all-cities").then((response) => {
      setCities(response.data.data);
    });
  }, []);

  useEffect(() => {
    if (filters.from && filters.to && filters.journeyDate) {
      getBusesByFilter();
    }
  }, [filters.from, filters.to, filters.journeyDate, getBusesByFilter]);

  return (
    <>
      <Helmet>
        <title>Bus-Ticket-Booking</title>
      </Helmet>
      <div className="h-screen flex bg-gray-900 relative">
        <div
          className="hero min-h-screen lg:flex w-full lg:w-3/4"
          style={{
            backgroundImage: `url("https://cdn.dribbble.com/users/1976094/screenshots/4687414/buss_trvl.gif")`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          <div className="flex items-center h-full w-full">
            <div className="h-screen overflow-auto overflow-x-hidden">
              <div className="bg-opacity-80">
                <Row gutter={[15, 15]}>
                  {buses.map((bus, index) => {
                    return (
                      <div key={index} className="w-screen p-10 ">
                        <Bus bus={bus} />
                      </div>
                    );
                  })}
                </Row>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md ">
            <div className="flex justify-center">
              <img
                className=" text-center w-20 h-20 rounded-full"
                src={logo}
                alt="logo"
              />
            </div>

            <h1 className="mb-5 text-4xl text-white font-bold ">
              Bus-Ticket-Booking
            </h1>
            <p className="mb-5 text-base text-white">
              is a platform that allows you to book your bus tickets online and
              in a very easy way.
            </p>
            <Link
              to="/login"
              className="relative inline-flex items-center justify-start
                px-10 py-3 overflow-hidden font-bold rounded-full
                group"
            >
              <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
              <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:translate-x-1"></span>
              <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                Check your tickets
              </span>
              <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
            </Link>
            <div className="w-full my-5 mx-2 p-2 px-2 py-3 ">
              <div className="search-container p-6 bg-white/90 rounded-xl shadow-lg backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-primary-dark mb-4">Find Your Perfect Journey</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label className="block text-gray-700 mb-2">From</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-primary/30 focus:border-primary transition-all"
                      onChange={(e) => setFilters({ ...filters, from: e.target.value })}>
                      <option value="">Select departure city</option>
                      {cities.map((data, index) => (
                        <option key={index} value={data.ville}>{data.ville}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="block text-gray-700 mb-2">To</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-primary/30 focus:border-primary transition-all"
                      onChange={(e) => setFilters({ ...filters, to: e.target.value })}>
                      <option value="">Select arrival city</option>
                      {cities.map((data, index) => (
                        <option key={index} value={data.ville}>{data.ville}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group mb-6">
                  <label className="block text-gray-700 mb-2">Journey Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-primary/30 focus:border-primary transition-all"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setFilters({ ...filters, journeyDate: e.target.value })}
                  />
                </div>

                <button
                  onClick={getBusesByFilter}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                  <i className="ri-search-line text-xl"></i>
                  Search Buses
                </button>
              </div>
              <div className="flex justify-center gap-4 mt-5 w-full">
                {buses.length === 0 && (
                  <div className="text-center text-white text-2xl">
                    Make your search now
                  </div>
                )}
              </div>
            </div>
            {/* <div className="absolute top-5 left-5 container mx-auto px-4 py-6 max-w-4xl ">
              <h2 className="text-2xl font-bold mb-4 text-white">Popular Bus Stations</h2>
              <div className="h-96 md:h-[500px]">
                <BusStandMap
                  busStands={busStands}
                  selectedLocation={null}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {majorCities.map((city) => (
                  <button
                    key={city}
                    className="py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
                    onClick={() => setSelectedCity(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
