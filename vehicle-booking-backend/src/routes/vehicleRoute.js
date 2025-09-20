const express = require("express");
const Vehicle = require("../models/vehicle");
const Booking = require("../models/Booking");
const vehicleRouter = express.Router();

// create a new vehicle 
vehicleRouter.post("/api/vehicles", async (req, res) => {
  try {
    const { name, capacityKg, tyres } = req.body;
    const vehicle = new Vehicle({ name, capacityKg, tyres });

    if (!vehicle.validateVehicleCapacity()) {
      return res.status(400).json({ error: "Capacity must be at least 100kg" });
    }

    const savedVehicle = await vehicle.save();

    res.status(201).json(savedVehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// get vehicles
vehicleRouter.get("/api/vehicles/available", async (req, res) => {

  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;


    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ error: "Missing required query parameters." });
    }


    const capacityNum = Number(capacityRequired);
    if (isNaN(capacityNum)) {
      return res.status(400).json({ error: "capacityRequired must be a number." });
    }

    if (typeof fromPincode !== "string" || typeof toPincode !== "string") {
      return res.status(400).json({ error: "fromPincode and toPincode should be strings." });
    }

    if (isNaN(Date.parse(startTime))) {
      return res.status(400).json({ error: "startTime must be a valid ISO date string." });
    }

    const startDate = new Date(startTime);


    const estimatedRideDurationHours =
      Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;

    const endDate = new Date(
      startDate.getTime() + estimatedRideDurationHours * 60 * 60 * 1000
    );


    const vehicles = await Vehicle.find({ capacityKg: { $gte: capacityNum } });


    const overlappingBookings = await Booking.find({
      vehicleId: { $in: vehicles.map((v) => v._id) },
      startTime: { $lt: endDate },
      endTime: { $gt: startDate },
    });


    const bookedVehicleIds = new Set(
      overlappingBookings.map((b) => b.vehicleId.toString())
    );


    const availableVehicles = vehicles.filter(
      (v) => !bookedVehicleIds.has(v._id.toString())
    );

  
    const results = availableVehicles.map((vehicle) => ({
      _id: vehicle._id,
      name: vehicle.name,
      capacityKg: vehicle.capacityKg,
      tyres: vehicle.tyres,
      estimatedRideDurationHours,
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = vehicleRouter;
