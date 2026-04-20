// routes/userRoutes.js
const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/userController");
const { getTickets } = require("../services/getTicketService");

router.post("/register", registerUser);

router.get("/tickets/:email", getTickets);
module.exports = router;