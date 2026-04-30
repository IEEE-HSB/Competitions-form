const User = require("../models/User");
const { generateTicketsForUser } = require("../services/ticketService");

const handleWebhook = async (req, res) => {
  try {
    const { type, obj } = req.body;

    // Only transaction webhooks
    if (type !== "TRANSACTION") {
      return res.sendStatus(200);
    }

    // ✅ correct success check
    const success = obj?.success === true;

    // ✅ correct orderId extraction
    const orderId =
      obj?.order?.id ||
      obj?.order ||
      obj?.id;

    console.log(
      `Webhook received: Type=${type}, Success=${success}, OrderID=${orderId}`
    );

    const user = await User.findOne({ paymobOrderId: orderId });

    if (!user) {
      console.log("User not found for orderId:", orderId);
      return res.sendStatus(200);
    }

    // prevent duplicate processing
    if (user.paymentStatus === "paid") {
      return res.sendStatus(200);
    }

    // ================= SUCCESS =================
    if (success) {
      if (!user.tickets || user.tickets.length === 0) {
        const tickets = await generateTicketsForUser(user);
        user.tickets = tickets;
      }

      user.paymentStatus = "paid";
      await user.save();

      console.log("✅ PAYMENT SUCCESS:", user.email);

      return res.sendStatus(200);
    }

    // ================= FAILED =================
    if (user.paymentStatus !== "paid") {
      user.paymentStatus = "failed";
      await user.save();

      console.log("❌ PAYMENT FAILED:", user.email);
    }

    return res.sendStatus(200);

  } catch (err) {
    console.error("❌ WEBHOOK ERROR:", err);
    return res.sendStatus(500);
  }
};


// ================= SUCCESS REDIRECT =================

const successRedirect = async (req, res) => {
  try {
    const email = req.query.email;
    const success = req.query.success;

    if (!email) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-failed`
      );
    }

    if (success === "false") {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-failed`
      );
    }

    // redirect to backend tickets route (as requested)
    return res.redirect(
      `${process.env.BASE_URL}/api/users/tickets/${email}`
    );

  } catch (err) {
    console.error(err);

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-failed`
    );
  }
};

module.exports = {
  handleWebhook,
  successRedirect,
};