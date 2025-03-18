const catchAsync = require("../utils/catchAsync");
const axios = require("axios");

const convertNumbersToBengali = (text) => {
  const numberMap = {
    0: "০",
    1: "১",
    2: "২",
    3: "৩",
    4: "৪",
    5: "৫",
    6: "৬",
    7: "৭",
    8: "৮",
    9: "৯",
  };

  return text.replace(/\d/g, (digit) => numberMap[digit]);
};

exports.createTranslateController = catchAsync(async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q=${encodeURIComponent(
      text
    )}`;

    const response = await axios.get(url);
    const translatedText = response.data[0].map((item) => item[0]).join("");
    const finalText = convertNumbersToBengali(translatedText); // Convert numbers

    res.json({ translatedText: finalText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
