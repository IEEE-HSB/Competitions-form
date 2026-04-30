const EARLY_BIRD_DAYS = 5;
const EARLY_PRICE = 30750; // 307.5 EGP
const NORMAL_PRICE = 35850; // 358.5 EGP
const PROMO_PRICE = 281875; // 281.875 EGP
const PROMO_PARTICIPANT = 20500; // 205 EGP
const BUNDLE_PRICE = 143500; // 1435 EGP

const EVENT_START_DATE = new Date("2026-04-21"); 

const isEarlyBird = () => {
  const now = new Date();
  const diff = (now - EVENT_START_DATE) / (1000 * 60 * 60 * 24);
  return diff <= EARLY_BIRD_DAYS;
};

const calculatePrice = ({ promoCode, bundle }) => {
  if (bundle) {
    return {
      amount: BUNDLE_PRICE,
      finalType: "bundle"
    };
  }

  //  Promo
  if (promoCode === "DISCOUNT75") {
    return {
      amount: PROMO_PRICE,
      finalType: "promo"
    };
  }
  if (promoCode === "IEEEHSBPART") {
    return {
      amount: PROMO_PARTICIPANT,
      finalType: "promo"
    };
  }

  //  Early Bird
  if (isEarlyBird()) {
    return {
      amount: EARLY_PRICE,
      finalType: "early"
    };
  }

  //  Normal
  return {
    amount: NORMAL_PRICE,
    finalType: "normal"
  };
};

module.exports = { calculatePrice };