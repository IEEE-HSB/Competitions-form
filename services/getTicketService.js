const User = require("../models/User");
const competitionLinks = require("../config/competitionLinks");
const QRCode = require("qrcode");

const getTickets = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.send("User not found");
    }

    const groupLink = competitionLinks[user.competitionId];
    let ticketsHTML = "";
    let showTicketAloneButton = ""
    for (let t of user.tickets) {
      const qr = await QRCode.toDataURL(
        `https://your-domain.com/join?code=${t.code}`
      );

      if (user.tickets.length > 1) {
        showTicketAloneButton = `<a href="${process.env.BASE_URL}/ticket?code=${t.code}" class="btn-join">VIEW TICKET</a>`
      }

      ticketsHTML += `
            <div class="ticket-container">
                <div class="ticket-left">
                    <div class="ticket-header">
                        <svg width="120" height="20" viewBox="0 0 121 15" fill="#207DA9" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.58001 3.57628e-06V14.16H4.91738e-06V3.57628e-06H3.58001ZM9.44032 3.36V5.56H15.1803V8.66H9.44032V10.78H15.6803V14.16H5.82032V3.57628e-06H15.6803V3.36H9.44032ZM21.1981 3.36V5.56H26.9381V8.66H21.1981V10.78H27.4381V14.16H17.5781V3.57628e-06H27.4381V3.36H21.1981ZM32.9559 3.36V5.56H38.6959V8.66H32.9559V10.78H39.1959V14.16H29.3359V3.57628e-06H39.1959V3.36H32.9559ZM48.3266 8.82V14.16H44.7266V3.57628e-06H48.3266V5.36H52.4066V3.57628e-06H56.0066V14.16H52.4066V8.82H48.3266ZM61.8622 3.36V5.56H67.6022V8.66H61.8622V10.78H68.1022V14.16H58.2422V3.57628e-06H68.1022V3.36H61.8622ZM70 14.16V3.57628e-06H73.6V10.62H79.36V14.16H70ZM90.842 6.82L92.562 3.57628e-06H96.262L92.182 14.16H88.862L87.602 10.24L87.102 7H87.042L86.502 10.22L85.382 14.16H82.062L77.962 3.57628e-06H81.682L83.362 6.78L83.722 9.78H83.822L84.162 6.8L85.742 1.84H88.462L89.922 6.82L90.382 9.78H90.442L90.842 6.82ZM103.073 3.57628e-06L108.133 14.16H104.293L103.373 11.32H99.5933L98.7133 14.16H94.8733L99.8133 3.57628e-06H103.073ZM100.393 8.14H102.513L101.533 4H101.433L100.393 8.14ZM109.082 14.16V3.57628e-06H112.482L115.902 6.04L117.102 8.88L117.202 8.86C117.182 8.86 116.822 6.42 116.802 6.42V3.57628e-06H120.362V14.16H116.742L113.542 8.58L112.302 5.74L112.202 5.76L112.662 8.5V14.16H109.082Z" />
                        </svg>
                        <span class="competition-title">Competition Access</span>
                    </div>
                    
                    <div class="ticket-info">
                        <div class="info-group">
                            <span class="label">Competitor</span>
                            <span class="value">${t.name}</span>
                        </div>
                        <div class="info-group">
                            <span class="label">Pass Code</span>
                            <span class="value code-highlight">${t.code}</span>
                        </div>
                    </div>
                        <div class="flex">
                    <a href="${groupLink}" target="_blank" class="btn-join">JOIN Group</a>
                    ${showTicketAloneButton}
                    </div>
                </div>

                <div class="ticket-right">
                    <div class="qr-wrapper">
                        <img src="${qr}" alt="QR Code" />
                    </div>
                    <span class="scan-text">SCAN TO VERIFY</span>
                </div>
            </div>
            `;
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Competition Tickets</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@500;700&display=swap');

          body {
            background-color: #020617;
            color: #f1f5f9;
            font-family: 'Rajdhani', sans-serif;
            margin: 0;
            padding: 40px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          h1 {
            font-family: 'Orbitron', sans-serif;
            color: #207DA9;
            text-transform: uppercase;
            letter-spacing: 5px;
            margin-bottom: 40px;
            text-shadow: 0 0 15px rgba(32, 125, 169, 0.4);
          }

          .ticket-container {
            background: #0f172a;
            width: 100%;
            max-width: 650px;
            height: 220px;
            margin-bottom: 30px;
            display: flex;
            position: relative;
            border: 1px solid rgba(32, 125, 169, 0.3);
            border-left: 6px solid #207DA9;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
            clip-path: polygon(0% 0%, 95% 0%, 100% 15%, 100% 85%, 95% 100%, 0% 100%);
          }

          /* Left Section */
          .ticket-left {
            flex: 2;
            padding: 25px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-right: 2px dashed rgba(32, 125, 169, 0.3);
          }

          .ticket-header {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .competition-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 12px;
            letter-spacing: 2px;
            color: rgba(255,255,255,0.6);
          }

          .ticket-info {
            display: flex;
            gap: 40px;
            margin: 15px 0;
          }

          .info-group {
            display: flex;
            flex-direction: column;
          }

          .label {
            font-size: 11px;
            color: #207DA9;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 700;
          }

          .value {
            font-size: 22px;
            font-weight: 700;
            margin-top: 5px;
          }

          .code-highlight {
            color: #207DA9;
            text-shadow: 0 0 10px rgba(32, 125, 169, 0.3);
          }

          .btn-join {
            display: inline-block;
            width: fit-content;
            background: #207DA9;
            color: white;
            padding: 8px 25px;
            text-decoration: none;
            font-weight: bold;
            font-size: 13px;
            letter-spacing: 1px;
            clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
            transition: all 0.3s ease;
          }

          .btn-join:hover {
            background: #3498db;
            box-shadow: 0 0 15px rgba(32, 125, 169, 0.5);
            transform: translateX(5px);
          }

          /* Right Section */
          .ticket-right {
            flex: 1;
            background: rgba(32, 125, 169, 0.05);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .qr-wrapper {
            background: white;
            padding: 8px;
            border-radius: 4px;
            margin-bottom: 10px;
          }

          .qr-wrapper img {
            width: 100px;
            height: 100px;
            display: block;
          }

          .scan-text {
            font-size: 10px;
            letter-spacing: 2px;
            color: #207DA9;
            font-weight: bold;
          }
.flex{
display: flex;
flex-wrap: wrap;
gap: 5px;
}
.ticket-container{
          /* Ticket Notches */
          .ticket-container::before, .ticket-container::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            background-color: #020617;
            border-radius: 50%;
            right: 31.5%;
            z-index: 2;
          }
          .ticket-container::before { top: -10px; }
          .ticket-container::after { bottom: -10px; }

          @media (max-width: 600px) {
            .ticket-container {
              flex-direction: column;
              height: auto;
              max-width: 320px;
              clip-path: none;
            }
            .ticket-left {
                border-right: none;
                border-bottom: 2px dashed rgba(32, 125, 169, 0.3);
            }
            .ticket-container::before, .ticket-container::after { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>ACCESS GRANTED</h1>
          <p class="competition-description " style="font-size: 14px;">You Must Join the group through the button below to access this competition.</p>
        ${ticketsHTML}
      </body>
      </html>
    `);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = { getTickets };