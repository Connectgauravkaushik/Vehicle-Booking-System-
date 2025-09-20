const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    capacityKg: {
      type: Number,
      required: true
    },
    tyres: {
      type: Number,
      required: true,
      min: 4, // vehicle tyres can't be less than 4 because we are booking a truck it has minimu 4 or 6 tyres depending upon the truck
    },
  },
  { timestamps: true }
);

vehicleSchema.methods.validateVehicleCapacity = function() {
  return this.capacityKg >= 100;
};


const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
