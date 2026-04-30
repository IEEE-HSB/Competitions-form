const axios = require("axios");
const User = require("../models/User");
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const INTEGRATION_CARD_ID = process.env.PAYMOB_CARD_INTEGRATION_ID;
const INTEGRATION_WALLET_ID = process.env.PAYMOB_WALLET_INTEGRATION_ID;
const IFRAME_ID = process.env.PAYMOB_IFRAME_ID;

console.log({
  PAYMOB_API_KEY,
  INTEGRATION_CARD_ID,
  INTEGRATION_WALLET_ID,
  IFRAME_ID,
});

const createPayment = async (user, paymentMethod, amount) => {
  try {
    const integrationId =
      paymentMethod === "wallet"
        ? INTEGRATION_WALLET_ID
        : INTEGRATION_CARD_ID;

    // 1. Auth
    const authRes = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      { api_key: PAYMOB_API_KEY }
    );

    const token = authRes.data.token;

    // 2. Order
    const orderRes = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        auth_token: token,
        delivery_needed: false,
        amount_cents: amount,
        currency: "EGP",
        items: [],
      }
    );

    const orderId = orderRes.data.id;
    await User.findByIdAndUpdate(user._id, {
      paymobOrderId: orderId,
    });
    // 3. Payment Key
    const paymentKeyRes = await axios.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        auth_token: token,
        amount_cents: amount,
        expiration: 3600,
        order_id: orderId,
        currency: "EGP",
        integration_id: integrationId,

        billing_data: {
          first_name: user.name,
          last_name: "NA",
          email: user.email,
          phone_number: user.phone,
          city: "Cairo",
          country: "EG",
          street: "NA",
          building: "NA",
          floor: "NA",
          apartment: "NA",
        },

        redirection_url: `${process.env.BASE_URL}/success?email=${user.email}`,
      }
    );

    const paymentToken = paymentKeyRes.data.token;

    // 4. CARD
    if (paymentMethod === "card") {
      const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentToken}`;

      return { paymentUrl, orderId };
    }

    // 5. WALLET
    const walletRes = await axios.post(
      "https://accept.paymob.com/api/acceptance/payments/pay",
      {
        source: {
          identifier: user.phone.toString(),
          subtype: "WALLET",
        },
        payment_token: paymentToken,
      }
    );

    return {
      paymentUrl:
        walletRes.data.redirect_url ||
        walletRes.data.iframe_redirection_url ||
        null,
      orderId,
      raw: walletRes.data,
    };
  } catch (error) {
    console.error(
      "❌ PAYMOB ERROR:",
      error.response?.data || error.message
    );
    throw new Error("Payment initialization failed");
  }
};

module.exports = { createPayment };