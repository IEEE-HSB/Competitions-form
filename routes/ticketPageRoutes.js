const express = require("express");
const router = express.Router();
const getTicketPage = require("../services/ticketPageService").getTicketPage

router.get("/ticket", getTicketPage);
 
module.exports = router;