require("dotenv").config();
const express = require("express");

const translateRoute = require("./routes/translate");
const calendarRoute = require("./routes/calendar");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// 以下ルーティング
app.use("/api/translate", translateRoute);
app.use("/api/calendar", calendarRoute);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
