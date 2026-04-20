// services/ticketPageService.js
const User = require("../models/User");
const competitionLinks = require("../config/competitionLinks");
const QRCode = require("qrcode");

const getTicketPage = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.send("Missing ticket code ❌");
        }

        const user = await User.findOne({
            "tickets.code": code
        });

        if (!user) {
            return res.send("Invalid ticket ❌");
        }

        const ticket = user.tickets.find(t => t.code === code);

        const groupLink = competitionLinks[user.competitionId];

        const qr = await QRCode.toDataURL(code);

        res.send(`
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Futuristic Ticket</title>
    <style>
        :root {
            --primary-glow: #00d2ff;
            --secondary-glow: #3a7bd5;
            --glass-bg: rgba(255, 255, 255, 0.05);
            --text-color: #ffffff;
        }

        body {
            background: radial-gradient(circle at center, #1b2735 0%, #090a0f 100%);
            color: var(--text-color);
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            overflow: hidden;
        }

        /* تأثير الخلفية المضيئة */
        body::before {
            content: "";
            position: absolute;
            width: 300px;
            height: 300px;
            background: var(--secondary-glow);
            filter: blur(150px);
            z-index: -1;
            top: 20%;
            left: 20%;
            opacity: 0.4;
        }

        .ticket-container {
            background: var(--glass-bg);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            max-width: 350px;
            width: 90%;
            position: relative;
        }

        h2 {
            font-weight: 300;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-bottom: 30px;
            color: var(--primary-glow);
            text-shadow: 0 0 10px rgba(0, 210, 255, 0.5);
        }

        .info-group {
            margin-bottom: 20px;
            text-align: left;
            border-left: 2px solid var(--primary-glow);
            padding-left: 15px;
        }

        .label {
            display: block;
            font-size: 10px;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.5);
            letter-spacing: 1.5px;
        }

        .value {
            font-size: 18px;
            font-weight: 500;
        }

        .qr-wrapper {
            background: white;
            padding: 15px;
            border-radius: 16px;
            display: inline-block;
            margin: 20px 0;
            box-shadow: 0 0 20px rgba(0, 210, 255, 0.2);
        }

        .qr-wrapper img {
            display: block;
            filter: contrast(1.2);
        }

        .btn-join {
            display: block;
            background: linear-gradient(45deg, var(--primary-glow), var(--secondary-glow));
            color: white;
            text-decoration: none;
            padding: 15px;
            border-radius: 12px;
            font-weight: bold;
            transition: transform 0.3s, box-shadow 0.3s;
            margin-top: 20px;
        }

        .btn-join:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 210, 255, 0.3);
        }

        .note {
            display: block;
            margin-top: 15px;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.4);
            line-height: 1.4;
        }

        .note b {
            color: #ff4b2b;
        }
    </style>
</head>
<body>

    <div class="ticket-container">
        <h2>Competition Access</h2>
        
        <div class="info-group">
            <span class="label">Competitor Name</span>
            <span class="value">${ticket.name}</span>
        </div>

        <div class="info-group">
            <span class="label">Unique Access Code</span>
            <span class="value" style="font-family: monospace;">${ticket.code}</span>
        </div>

        <div class="qr-wrapper">
            <img src="${qr}" width="180" alt="QR Code"/>
        </div>

        <a href="${groupLink}" target="_blank" class="btn-join">
            JOIN PRIVATE GROUP
        </a>

        <span class="note">
            Exclusive for ticket holders.<br>
            <b>Note:</b> This link is valid for a single entry only.
        </span>
    </div>

</body>
</html>
    `);

    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
}

module.exports = {
    getTicketPage
};