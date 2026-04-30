// controllers/paymentController.js
const User = require("../models/User");
const { generateTicketsForUser } = require("../services/ticketService");

const handleWebhook = async (req, res) => {
  try {
    const { type, obj: data } = req.body;

    // Only process transaction webhooks
    if (type !== "TRANSACTION") {
      return res.sendStatus(200);
    }

    const success = data.success === true || data.success === "true";
    const orderId = data.order?.id || data.order; // Handle both object and primitive

    console.log(`Webhook received: Type=${type}, Success=${success}, OrderID=${orderId}`);

    const user = await User.findOne({ paymobOrderId: orderId });

    if (!user) {
      console.log("User not found for orderId:", orderId);
      return res.sendStatus(200);
    }

    // If already paid, don't do anything
    if (user.paymentStatus === "paid") {
      return res.sendStatus(200);
    }

    if (success) {
      // Generate tickets and update status
      const tickets = await generateTicketsForUser(user);
      user.tickets = tickets;
      user.paymentStatus = "paid";
      await user.save();

      console.log("✅ PAYMENT SUCCESS: User paid and tickets generated:", user.email);
    } else {
      // Don't mark as 'failed' immediately to allow for subsequent successful attempts
      // Just log the failure for now
      console.log("❌ PAYMENT ATTEMPT FAILED: OrderID:", orderId, "User:", user.email);
      
      // Optional: you could update to 'failed' if you want to track it, 
      // but ensure 'paid' can still overwrite 'failed'.
      // user.paymentStatus = "failed";
      // await user.save();
    }

    return res.sendStatus(200);

  } catch (err) {
    console.error("❌ WEBHOOK ERROR:", err);
    return res.sendStatus(500);
  }
};

const successRedirect = async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.send("Missing email");
  }

  res.redirect(`${process.env.BASE_URL}/api/users/tickets/${email}`);
};

module.exports = {
  handleWebhook,
  successRedirect
};