const express = require("express");
const { google } = require("googleapis");

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  // "http://localhost:3000/oauth2callback"
  "http://localhost:3000/api/calendar/oauth2callback"
);

// Googleへリクエスト
router.get("/auth", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
  });
  res.redirect(url);
});

// Googleからリターン
router.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  global.calendarAuth = oauth2Client;

  res.send("認証OK");
});

// カレンダーへ登録
router.post("/", async (req, res) => {
  if (!global.calendarAuth) {
    return res.status(401).json({ needAuth: true });
  }

  const { title, description, date } = req.body;

  const calendar = google.calendar({
    version: "v3",
    auth: global.calendarAuth,
  });

  await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: title,
      description,
      start: {
        date,
      },
      end: {
        date,
      },
    },
  });

  res.json({ success: true });
});

module.exports = router;
