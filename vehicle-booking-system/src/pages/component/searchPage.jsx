import { useState } from "react";
import axios from "axios";

function SearchAndBookComponent() {
  const [formData, setFormData] = useState({
    capacity: "",
    fromPincode: "",
    toPincode: "",
    startDateTime: "",
  });

  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [loading, setLoading] = useState(false);

  const customerId = "customer123";
  // Handle form input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  }

  // Fetch vehicles from API
  const handleSearch = async(e) => {
    e.preventDefault();
    setMessage(null);
    setVehicles([]);
    setLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:5000/api/vehicles/available",
        {
          params: {
            capacityRequired: formData.capacity,
            fromPincode: formData.fromPincode,
            toPincode: formData.toPincode,
            startTime: new Date(formData.startDateTime).toISOString(),
          },
        }
      );

      setVehicles(response.data);
      if (response.data.length === 0) {
        setMessage({ type: "error", text: "No vehicles available for these criteria." });
      }
    } catch (error) {
      console.error(error);
      let errorMsg = "Failed to fetch vehicles.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMsg = error.response.data.error;
      }
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  }

  // Booking API call
  const handleBook =  async(vehicleId)=> {
    setIsBooking(true);
    setMessage(null);

    try {
      const response = await axios.post("http://localhost:5000/api/bookings", {
        vehicleId,
        fromPincode: formData.fromPincode,
        toPincode: formData.toPincode,
        startTime: new Date(formData.startDateTime).toISOString(),
        customerId,
      });

      setMessage({
        type: "success",
        text: `Booking confirmed for vehicle ${vehicleId}! Booking ID: ${response.data._id}`,
      });

      setVehicles((v) => v.filter((vehicle) => vehicle._id !== vehicleId));
    } catch (error) {
      console.error(error);
      let errorMsg = "Booking failed. Please try again.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMsg = error.response.data.error;
      }
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsBooking(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-purple-200 p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-xl p-8 space-y-8">
        <h1 className="text-4xl font-extrabold text-indigo-900 text-center flex items-center justify-center gap-3">
          <span className="text-5xl animate-bounce">🚚</span> Search & Book Vehicle
        </h1>

     
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          noValidate
        >
        
          <div>
            <label
              htmlFor="capacity"
              className="block text-sm font-semibold text-indigo-700 mb-1"
            >
              Capacity Required (KG)
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              min={1}
              value={formData.capacity}
              onChange={handleChange}
              required
              placeholder="e.g. 1000"
              className="w-full rounded-lg border border-indigo-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

        
          <div>
            <label
              htmlFor="fromPincode"
              className="block text-sm font-semibold text-indigo-700 mb-1"
            >
              From Pincode
            </label>
            <input
              type="text"
              id="fromPincode"
              name="fromPincode"
              value={formData.fromPincode}
              onChange={handleChange}
              required
              placeholder="e.g. 110001"
              className="w-full rounded-lg border border-indigo-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

 
          <div>
            <label
              htmlFor="toPincode"
              className="block text-sm font-semibold text-indigo-700 mb-1"
            >
              To Pincode
            </label>
            <input
              type="text"
              id="toPincode"
              name="toPincode"
              value={formData.toPincode}
              onChange={handleChange}
              required
              placeholder="e.g. 560001"
              className="w-full rounded-lg border border-indigo-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

     
          <div>
            <label
              htmlFor="startDateTime"
              className="block text-sm font-semibold text-indigo-700 mb-1"
            >
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              id="startDateTime"
              name="startDateTime"
              value={formData.startDateTime}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-indigo-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

    
          <div className="sm:col-span-2 flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={
                !formData.capacity ||
                !formData.fromPincode ||
                !formData.toPincode ||
                !formData.startDateTime ||
                loading
              }
            >
              {loading ? "Searching..." : "Search Availability"}
            </button>
          </div>
        </form>


        <section>
          <h2 className="text-2xl font-semibold text-indigo-900 mb-4">
            Available Vehicles
          </h2>

          {vehicles.length === 0 && !loading ? (
            <p className="text-indigo-700 italic text-center">
              No results yet. Please search above.
            </p>
          ) : (
            <ul className="space-y-6">
              {vehicles.map((v) => (
                <li
                  key={v._id}
                  className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row justify-between items-center gap-4 transition hover:shadow-xl"
                >
                  <div className="flex flex-col space-y-1 text-indigo-900 font-semibold">
                    <span className="text-xl">{v.name}</span>
                    <span className="text-indigo-600 text-sm">
                      Capacity: {v.capacityKg} KG
                    </span>
                    <span className="text-indigo-600 text-sm">Tyres: {v.tyres}</span>
                    <span className="text-indigo-600 text-sm">
                      Estimated Duration: {v.estimatedRideDurationHours} hours
                    </span>
                  </div>

                  <button
                    onClick={() => handleBook(v._id)}
                    disabled={isBooking}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBooking ? "Booking..." : "Book Now"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {message && (
          <div
            className={`mt-6 text-center rounded-lg py-3 px-6 font-semibold ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchAndBookComponent;
