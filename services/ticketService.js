// services/ticketService.js
const generateCode = require("../utils/generateCode");
const { generateQR } = require("./qrService");
const competitionLinks = require("../config/competitionLinks");

const generateTicketsForUser = async (user) => {
  let participants = [
    { name: user.name, phone: user.phone }
  ];

  if (user.isBundle) {
    participants = [...participants, ...user.groupMembers];
  }     

  const tickets = [];

  for (let p of participants) {
    const code = generateCode();

    tickets.push({
      name: p.name,
      phone: p.phone,
      code,
      used: false
    });
  }

  return tickets;
};

module.exports = { generateTicketsForUser };