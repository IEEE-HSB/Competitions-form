// index.js
require("dotenv").config();
const express = require('express');
const cors = require("cors");

const app = express();
const port = 3000;
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Define a simple route
app.get('/', (req, res) => {
    res.send('server is working!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const connectDB = require("./config/db");
connectDB();



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
// const qr = await generateQR(`https://cornball-chaste-blubber.ngrok-free.dev/join?code=${t.code}`);
// must be replaced by the domain name of the deployed backend, and it should be generated for each ticket code, not globally in the file.






















