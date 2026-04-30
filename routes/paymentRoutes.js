// paymentRoutes.js

const express = require("express");

const router = express.Router();

const { handleWebhook, successRedirect,
    //  getPaymentStatus 
    } = require("../controllers/paymentController");

router.post("/webhook", handleWebhook);

router.get("/success", successRedirect);

// router.get("/status", getPaymentStatus);


module.exports = router;