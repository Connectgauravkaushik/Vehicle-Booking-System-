const express = require('express');
const connectDb = require('./src/config/db');
const cors = require('cors');
const bookingRouter = require('./src/routes/BookingRoute');
const vehicleRouter = require('./src/routes/vehicleRoute');
const app = express();


app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173/",
  credentials: true,
}))

app.use('/', vehicleRouter);
app.use('/', bookingRouter);

connectDb().then(() => {
  console.log("Database connected successfully !!");
  app.listen('5000', () => {
    console.log('server is running on 5000');
  })
}).catch((err) => {
  console.error("Database not connected !!" + err.message);
});



