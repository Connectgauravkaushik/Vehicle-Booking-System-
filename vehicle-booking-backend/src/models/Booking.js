const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  fromPincode: { type: String, required: true },
  toPincode: { type: String, required: true },
  customerId: {
    type: String,
    required: true,
  },
  estimatedRideDurationHours: { type: Number, required: true },
});
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
