const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  const { text, target } = req.body;

  if (!text) {
    return res.status(400).json({ error: "text is required" });
  }

  try {
    const response = await axios.post(
      "https://translation.googleapis.com/language/translate/v2",
      {},
      {
        params: {
          q: text,
          target,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    res.json({
      translatedText: response.data.data.translations[0].translatedText,
    });

    await addEvent(translated);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "translation failed" });
  }
});

module.exports = router;
