import { useState } from "react";
import { useNavigate } from "react-router";

import axios from "axios";

const BookingComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    tyres: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:5000/api/vehicles", {
        name: formData.name,
        capacityKg: Number(formData.capacity),
        tyres: Number(formData.tyres),
      });

      setSuccess("Vehicle added successfully!");
      setFormData({ name: "", capacity: "", tyres: "" });
    } catch (err) {
      const message =
        err.response?.data?.error ||
        "Something went wrong. Please try again later.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full space-y-6 transition-all duration-300 hover:shadow-2xl"
      >
        <h2 className="text-3xl font-extrabold text-indigo-800 text-center flex items-center justify-center gap-3 tracking-tight">
          <span className="inline-block transform scale-x-[-1] animate-bounce">
            🚚
          </span>
          <span>Vehicle Booking</span>
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm font-medium border border-red-300 shadow-sm">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm font-medium border border-green-300 shadow-sm">
            ✅ {success}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            placeholder="Enter vehicle name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacity (KG)
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            placeholder="e.g. 1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tyres
          </label>
          <input
            type="number"
            name="tyres"
            value={formData.tyres}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            placeholder="e.g. 4"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-transform transform hover:scale-105 focus:outline-none"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => navigate("/book")}
          className="w-full py-2 px-4 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-md transition-transform transform hover:scale-105 focus:outline-none flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search Available Vehicles
        </button>
        <button
  type="button"
  onClick={() => navigate("/all/bookings")}
  className="w-full py-2 px-4 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-md transition-transform transform hover:scale-105 focus:outline-none flex items-center justify-center gap-2"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-indigo-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16" 
    />
  </svg>
  See All Bookings
</button>

      </form>
    </div>
  );
};

export default BookingComponent;
