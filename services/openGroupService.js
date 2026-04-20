const User = require("../models/User");
const competitionLinks = require("../config/competitionLinks");
const express = require("express");
const router = express.Router();

const openGroupService = async (req, res) => {
    const { code } = req.query;

    const user = await User.findOne({
        "tickets.code": code
    });

    if (!user) {
        return res.send("Invalid ticket!");
    }

    const ticket = user.tickets.find(t => t.code === code);

    if (ticket.used) {
        return res.send("Ticket already used!");
    }

    const competitionId = user.competitionId;

    const groupLink = competitionLinks[competitionId] || "no link found";

    ticket.used = true;
    await user.save();

    res.redirect(groupLink);
}

module.exports = openGroupService;