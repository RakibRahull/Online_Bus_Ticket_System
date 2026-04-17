import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { message, Table, Modal } from "antd";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import PageTitle from "../components/PageTitle";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import logo from "../assets/img/logo.jpg";
import { Helmet } from "react-helmet";
import QRCode from "react-qr-code";

function Bookings() {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  const getBookings = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get(
        `/api/bookings/${localStorage.getItem("user_id")}`,
        {}
      );
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.bus,
            key: booking._id,
            user: booking.user.name,
          };
        });
        setBookings(mappedData);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);

  const CancelBooking = async () => {
    try {
      dispatch(ShowLoading());
      const res = await axiosInstance.get(
        `/api/bookings/${localStorage.getItem("user_id")}`
      );
      const bus_id = res.data.data[0].bus._id;
      const user_id = res.data.data[0].user._id;
      const booking_id = res.data.data[0]._id;
      const response = await axiosInstance.delete(
        `/api/bookings/${booking_id}/${user_id}/${bus_id}`,
        {}
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getBookings();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Bus Name",
      dataIndex: "name",
      key: "bus",
    },
    {
      title: "Full Name",
      dataIndex: "user",
      key: "user",
    },

    {
      title: "Bus Number",
      dataIndex: "busNumber",
      key: "bus",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
      render: (journeyDate) => moment(journeyDate).format("DD/MM/YYYY"),
    },
    {
      title: "Journey Time",
      dataIndex: "departure",
      render: (departure) => moment(departure, "HH:mm").format("hh:mm A"),
    },
    {
      title: "Seats",
      dataIndex: "seats",
      render: (seats) => seats.join(", "),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <button
            className="underline text-base text-green-500 cursor-pointer hover:text-green-700"
            onClick={() => {
              setSelectedBooking(record);
              setShowPrintModal(true);
            }}
          >
            View
          </button>
          <button
            className="underline text-base text-red-500 cursor-pointer hover:text-red-700"
            onClick={() => {
              CancelBooking();
            }}
          >
            Cancel
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Helmet>
        <title>Bookings</title>
      </Helmet>

      <div className="p-5">
        <PageTitle title="Bookings" />
        <Table columns={columns} dataSource={bookings} />

        {showPrintModal && (
          <Modal
            width={1000}
            height={500}
            title="Print Ticket"
            onCancel={() => {
              setShowPrintModal(false);
              selectedBooking(null);
            }}
            open={showPrintModal}
            okText="Print"
            onOk={handlePrint}
          >
            <div
              className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-2xl mx-auto"
              ref={componentRef}
            >
              {/* Ticket header */}
              <div className="bg-primary p-4 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      src={logo}
                      alt="Logo"
                      className="h-12 w-12 rounded-full bg-white p-1"
                    />
                    <div className="ml-3">
                      <h3 className="text-lg font-bold">
                        {selectedBooking?.name}
                      </h3>
                      <p className="text-sm opacity-80">
                        #{selectedBooking?.busNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Passenger</p>
                    <p className="font-bold">{selectedBooking?.user}</p>
                  </div>
                </div>
              </div>

              {/* Ticket body */}
              <div className="p-6 relative">
                {/* From-To section */}
                <div className="flex items-center justify-between mb-8 relative">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-dark">
                      {selectedBooking?.from}
                    </div>
                    <p className="text-gray-500">Departure</p>
                    <div className="text-lg font-semibold mt-1">
                      {moment(selectedBooking?.departure, "HH:mm").format(
                        "hh:mm A"
                      )}
                    </div>
                  </div>

                  <div className="flex-1 px-4 relative">
                    <div className="h-0.5 bg-gray-300 absolute w-full top-4"></div>
                    <div className="absolute w-full flex justify-center -top-4">
                      <div className="bg-white px-2">
                        <i className="ri-bus-line text-primary text-2xl"></i>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-dark">
                      {selectedBooking?.to}
                    </div>
                    <p className="text-gray-500">Arrival</p>
                    <div className="text-lg font-semibold mt-1">
                      {moment(selectedBooking?.arrival, "HH:mm").format(
                        "hh:mm A"
                      )}
                    </div>
                  </div>
                </div>

                {/* Dotted separator */}
                <div className="border-dashed border-b-2 my-6 relative">
                  <div className="absolute -left-8 -top-4 w-8 h-8 bg-gray-100 rounded-full"></div>
                  <div className="absolute -right-8 -top-4 w-8 h-8 bg-gray-100 rounded-full"></div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-gray-500 text-sm">Date</p>
                    <p className="font-semibold">
                      {moment(selectedBooking?.journeyDate).format(
                        "DD MMM, YYYY"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Seats</p>
                    <p className="font-semibold">
                      {selectedBooking?.seats.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Price</p>
                    <p className="font-semibold">
                      ৳{selectedBooking?.price * selectedBooking?.seats.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Status</p>
                    <p className="font-semibold text-green-600">Confirmed</p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-2">
                  <QRCode
                    value={JSON.stringify({
                      Name: selectedBooking?.user.toString(),
                      From: selectedBooking?.from.toString(),
                      To: selectedBooking?.to.toString(),
                      Departure: moment(
                        selectedBooking?.departure,
                        "HH:mm"
                      ).format("hh:mm A"),
                      Arrival: moment(selectedBooking?.arrival, "HH:mm").format(
                        "hh:mm A"
                      ),
                      Price:
                        selectedBooking?.price * selectedBooking?.seats.length,
                      Seats: selectedBooking?.seats.toString(),
                      Date: selectedBooking?.journeyDate,
                    })}
                    size={150}
                  />
                </div>
                <p className="text-center text-sm text-gray-500">
                  Scan QR code to verify ticket
                </p>
              </div>

              {/* Ticket footer */}
              <div className="bg-gray-50 p-4 text-center text-sm text-gray-500">
                <p>Thank you for traveling with Grameen Travels</p>
                <p>For any assistance call: +880 1234 567890</p>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}

export default Bookings;
