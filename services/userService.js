// userService.js
const { calculatePrice } = require("./pricingService");
const User = require("../models/User");
const { createPayment } = require("./paymentService");

const registerAndPay = async (data) => {
  const { name, email, phone, promoCode, bundle, groupData, paymentMethod, competitionId } = data;
  // check DB duplicates (main user)
  const existingUser = await User.findOne({
    $or: [
      { email },
      { phone }
    ]
  });
  if (existingUser) {
    throw new Error("Email or phone already registered");
  }

  const pricing = calculatePrice({ promoCode, bundle });

  let groupMembers = [];
  if (bundle) {
    groupMembers = Object.values(groupData || {});

    //  check duplicates INSIDE bundle
    const seenEmails = new Set();
    const seenPhones = new Set();

    for (let member of groupMembers) {
      if (seenEmails.has(member.email)) {
        throw new Error("Duplicate email inside bundle");
      }
      if (seenPhones.has(member.phone)) {
        throw new Error("Duplicate phone inside bundle");
      }

      seenEmails.add(member.email);
      seenPhones.add(member.phone);
    }

    // check DB duplicates for group members
    for (let member of groupMembers) {
      const exists = await User.findOne({
        competitionId,
        $or: [
          { email: member.email },
          { phone: member.phone }
        ]
      });

      if (exists) {
        throw new Error(
          `Member ${member.name} already registered (email/phone used)`
        );
      }
    }
  }

  // pending user
  const user = await User.create({
    name,
    email,
    phone,
    competitionId,
    isBundle: !!bundle,
    groupMembers,
    pricePaid: pricing.amount,
    priceType: pricing.finalType
  });


  // await user.save();

  const payment = await createPayment(user, paymentMethod, pricing.amount);

  user.paymobOrderId = payment.orderId;
  await user.save();

  return {
    user,
    paymentUrl: payment.paymentUrl
  };
};

module.exports = {
  registerAndPay
};