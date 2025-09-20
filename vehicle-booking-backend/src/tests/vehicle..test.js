const getRequest = require("./setup");
const Vehicle = require("../models/vehicle");
const Booking = require("../models/Booking");

let request;

beforeAll(async () => {
  request = getRequest();
});

describe("POST /api/vehicles", () => {
  it("should create vehicle with valid data", async () => {
    const res = await request.post("/api/vehicles").send({
      name: "Truck A",
      capacityKg: 500,
      tyres: 6,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.capacityKg).toBe(500);
  });

  it("should reject if capacity < 100kg", async () => {
    const res = await request.post("/api/vehicles").send({
      name: "Tiny Truck",
      capacityKg: 50,
      tyres: 4,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/capacity/i);
  });
});

describe("GET /api/vehicles/available", () => {
  it("should return vehicle if no conflict", async () => {
    // Create vehicle
    const vehicleRes = await request.post("/api/vehicles").send({
      name: "Truck B",
      capacityKg: 300,
      tyres: 4,
    });

    const vehicle = vehicleRes.body;

    const res = await request.get("/api/vehicles/available").query({
      capacityRequired: 200,
      fromPincode: "400001",
      toPincode: "400011",
      startTime: new Date().toISOString(),
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should exclude vehicles with conflicting bookings", async () => {
    const now = new Date();
    const later = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hrs

    // Create vehicle
    const vehicleRes = await request.post("/api/vehicles").send({
      name: "Conflict Truck",
      capacityKg: 400,
      tyres: 4,
    });
    const vehicle = vehicleRes.body;

    // Create overlapping booking
    await Booking.create({
      vehicleId: vehicle._id,
      fromPincode: "400001",
      toPincode: "400021",
      startTime: now,
      endTime: later,
      customerId: "cust123",
      estimatedRideDurationHours: 2,
    });

    // Now test availability
    const res = await request.get("/api/vehicles/available").query({
      capacityRequired: 100,
      fromPincode: "400002",
      toPincode: "400010",
      startTime: new Date(now.getTime() + 30 * 60 * 1000).toISOString(), // within booked slot
    });

    expect(res.statusCode).toBe(200);
    const found = res.body.find(v => v._id === vehicle._id);
    expect(found).toBeUndefined(); // should not include the vehicle
  });
});
