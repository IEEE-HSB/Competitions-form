// paymentRoutes.js

const express = require("express");

const router = express.Router();

const { handleWebhook, successRedirect } = require("../controllers/paymentController");

router.post("/webhook", handleWebhook);

router.get("/success", successRedirect);


module.exports = router;