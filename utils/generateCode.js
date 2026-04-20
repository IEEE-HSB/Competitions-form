// utils/generateCode.js
const generateCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

module.exports = generateCode;