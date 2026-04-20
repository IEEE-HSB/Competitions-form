// userController.js
const userService = require("../services/userService");

const registerUser = async (req, res) => {
  try {
    const result = await userService.registerAndPay(req.body);

    res.json({
      message: "Redirect to payment",
      paymentUrl: result.paymentUrl
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser };