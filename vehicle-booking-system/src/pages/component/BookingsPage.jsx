import { useEffect, useState } from "react";
import axios from "axios";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/bookings");
      setBookings(res.data);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load bookings.", error });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
      setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
      setMessage({ type: "success", text: "Booking deleted successfully." });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete booking.", error });
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-indigo-900 mb-8">Bookings List</h1>

      {message && (
        <div
          className={`mb-6 px-6 py-3 rounded-lg font-semibold text-center w-full max-w-4xl ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <p className="text-indigo-700">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-indigo-700 italic">No bookings found.</p>
      ) : (
        <div className="w-full max-w-4xl space-y-6">
          {bookings.map((booking) => {
            const vehicle = booking.vehicle;
            return (
              <div
                key={booking.bookingId}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <h2 className="text-2xl font-bold text-indigo-800 mb-4 sm:mb-0">
                    {vehicle?.name || "Unknown Vehicle"}
                  </h2>

                  <button
                    onClick={() => handleDelete(booking.bookingId)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-transform transform hover:scale-105 flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m1-2h8a1 1 0 011 1v1H6V6a1 1 0 011-1z"
                      />
                    </svg>
                    Delete Booking
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-indigo-700 text-sm font-medium">
                  <div>
                    <span className="block text-gray-500">Capacity:</span>
                    {vehicle?.capacityKg ?? "-"} KG
                  </div>

                  <div>
                    <span className="block text-gray-500">Tyres:</span>
                    {vehicle?.tyres ?? "-"}
                  </div>

                  <div>
                    <span className="block text-gray-500">From:</span>
                    {booking.fromPincode}
                  </div>

                  <div>
                    <span className="block text-gray-500">To:</span>
                    {booking.toPincode}
                  </div>

                  <div>
                    <span className="block text-gray-500">Start:</span>
                    {new Date(booking.startTime).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>

                  <div>
                    <span className="block text-gray-500">End:</span>
                    {new Date(booking.endTime).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>

                  <div>
                    <span className="block text-gray-500">Customer ID:</span>
                    {booking.customerId}
                  </div>

                  <div>
                    <span className="block text-gray-500">
                      Estimated Duration:
                    </span>
                    {booking.estimatedRideDurationHours} hours
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingList;
