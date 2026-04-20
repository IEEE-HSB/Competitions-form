// controllers/paymentController.js
const User = require("../models/User");
const { generateTicketsForUser } = require("../services/ticketService");

const handleWebhook = async (req, res) => {
  try {
    const data = req.body.obj;
    const success = data.success;
    const orderId = data.order.id;

    const user = await User.findOne({ paymobOrderId: orderId });

    if (!user || user.paymentStatus !== "pending") {
      return res.sendStatus(200);
    }

    if (!success) {
      user.paymentStatus = "failed";
      await user.save();
      return res.sendStatus(200);
    }

    const tickets = await generateTicketsForUser(user);

    user.tickets = tickets;
    user.paymentStatus = "paid";

    await user.save();

    console.log("USER PAID:", user.email);

    return res.sendStatus(200);

  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

const successRedirect = async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.send("Missing email");
  }

  res.redirect(`http://localhost:3000/api/users/tickets/${email}`);
};

module.exports = {
  handleWebhook,
  successRedirect
};