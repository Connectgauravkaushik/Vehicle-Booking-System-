const getRequest = require("./setup");
const Vehicle = require("../models/vehicle");

let request;

beforeAll(async () => {
  request = getRequest();
});

describe("POST /api/bookings", () => {
  let vehicleId;

  beforeEach(async () => {
    const res = await request.post("/api/vehicles").send({
      name: "Bookable Truck",
      capacityKg: 500,
      tyres: 6,
    });
    vehicleId = res.body._id;
  });

  it("should create booking if no conflict", async () => {
    const res = await request.post("/api/bookings").send({
      vehicleId,
      fromPincode: "400001",
      toPincode: "400010",
      startTime: new Date().toISOString(),
      customerId: "cust123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.vehicleId).toBe(vehicleId);
  });

  it("should reject overlapping booking", async () => {
    const now = new Date();

    // Create initial booking
    await request.post("/api/bookings").send({
      vehicleId,
      fromPincode: "400001",
      toPincode: "400011",
      startTime: now.toISOString(),
      customerId: "custABC",
    });

    // Try overlapping booking
    const overlapTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 min later
    const res = await request.post("/api/bookings").send({
      vehicleId,
      fromPincode: "400001",
      toPincode: "400011",
      startTime: overlapTime.toISOString(),
      customerId: "custXYZ",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toMatch(/already booked/i);
  });
});
