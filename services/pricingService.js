const EARLY_BIRD_DAYS = 5;
const EARLY_PRICE = 307.5;
const NORMAL_PRICE = 358.5;
const PROMO_PRICE = 281.875;
const PROMO_PARTICIPANT = 205;
const BUNDLE_PRICE = 1435;

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