// paymentService.js

const axios = require("axios");
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const INTEGRATION_CARD_ID = process.env.PAYMOB_CARD_INTEGRATION_ID;
const INTEGRATION_WALLET_ID = process.env.PAYMOB_WALLET_INTEGRATION_ID;
const IFRAME_ID = process.env.PAYMOB_IFRAME_ID;

console.log({
  PAYMOB_API_KEY,
  INTEGRATION_CARD_ID,
  INTEGRATION_WALLET_ID,
  IFRAME_ID
});



const createPayment = async (user, paymentMethod, amount) => {
  try {
    let integrationId = paymentMethod === "wallet" ? INTEGRATION_WALLET_ID : INTEGRATION_CARD_ID;

    // 1. Authentication
    const authRes = await axios.post("https://accept.paymob.com/api/auth/tokens", {
      api_key: PAYMOB_API_KEY
    });
    const token = authRes.data.token;

    // 2. Order Registration
    const orderRes = await axios.post("https://accept.paymob.com/api/ecommerce/orders", {
      auth_token: token,
      delivery_needed: false,
      amount_cents: amount * 100,
      currency: "EGP",
      items: []
    });
    const orderId = orderRes.data.id;

    // 3. Payment Key Generation
    const paymentKeyRes = await axios.post("https://accept.paymob.com/api/acceptance/payment_keys", {
      auth_token: token,
      amount_cents: amount * 100,
      expiration: 3600,
      order_id: orderId,
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
        apartment: "NA"
      },
      currency: "EGP",
      integration_id: integrationId,
      redirection_url: `${process.env.BASE_URL}/success?email=${user.email}`

    });

    const paymentToken = paymentKeyRes.data.token;

    // 4. Handle Wallet vs Card
    if (paymentMethod === "wallet") {
      const walletRes = await axios.post("https://accept.paymob.com/api/acceptance/payments/pay", {
        source: {
          identifier: user.phone.toString(), 
          subtype: "WALLET"
        },
        payment_token: paymentToken
      });

      const finalUrl = walletRes.data.iframe_redirection_url || walletRes.data.redirect_url;

      return { paymentUrl: finalUrl, orderId }
    
  } else {

    const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentToken}`;
    return { paymentUrl, orderId };
  }

} catch (error) {
  console.error("❌ PAYMOB ERROR:", error.response?.data || error.message);
  throw new Error("Payment initialization failed");
}
};

module.exports = { createPayment };