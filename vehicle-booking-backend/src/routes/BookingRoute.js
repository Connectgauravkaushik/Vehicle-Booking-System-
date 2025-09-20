const express = require('express');
const Vehicle = require("../models/vehicle");
const Booking = require("../models/Booking");
const bookingRouter = express.Router();

bookingRouter.post('/api/bookings', async (req, res) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime, customerId } = req.body;

    if (!vehicleId || !fromPincode || !toPincode || !startTime || !customerId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const startDate = new Date(startTime);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: 'Invalid startTime format' });
    }

    const estimatedRideDurationHours = Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
    const bookingEndTime = new Date(startDate.getTime() + estimatedRideDurationHours * 60 * 60 * 1000);

    // Check for conflicting bookings for this vehicle in the time window
    const conflictingBooking = await Booking.findOne({
      vehicleId: vehicle._id,
      startTime: { $lt: bookingEndTime },
      endTime: { $gt: startDate },
    });

    if (conflictingBooking) {
      return res.status(409).json({ error: 'Vehicle is already booked for the selected time slot' });
    }

    const newBooking = new Booking({
      vehicleId: vehicle._id,
      fromPincode,
      toPincode,
      startTime: startDate,
      endTime: bookingEndTime,
      customerId,
      estimatedRideDurationHours,
    });

    await newBooking.save();

    res.status(201).json(newBooking);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


bookingRouter.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: "vehicleId",
        select: "name capacityKg tyres",
      })
      .exec();

    const results = bookings.map((booking) => ({
      bookingId: booking._id,
      vehicle: booking.vehicleId,
      startTime: booking.startTime,
      endTime: booking.endTime,
      fromPincode: booking.fromPincode,
      toPincode: booking.toPincode,
      customerId: booking.customerId,
      estimatedRideDurationHours: booking.estimatedRideDurationHours,
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Server error" });
  }
});


bookingRouter.delete('/api/bookings/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;

    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking canceled successfully', booking: deletedBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = bookingRouter;
