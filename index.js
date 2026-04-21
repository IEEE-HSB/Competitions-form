// index.js
require("dotenv").config();
const express = require('express');
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: [
  "http://localhost:3001",
  process.env.FRONTEND_URL
],
  credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Define a simple route
app.get('/', (req, res) => {
    res.send('server is working!');
});

const connectDB = require("./config/db");

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();


const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);
app.use("/", paymentRoutes);

const openGroupRoutes = require("./routes/openGroupRoutes");
app.use("/", openGroupRoutes);

const ticketPageRoutes = require("./routes/ticketPageRoutes");
app.use("/", ticketPageRoutes);


// kUHexivpub04dU9O
// mennashehata2005_db_user

// T-J2gJB%xRDqSHQ

// paymentRoutes.js
// must be replaced by the domain name of the deployed backend, and it should be generated for each ticket code, not globally in the file.






















