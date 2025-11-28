const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/generate-quiz", async (req, res) => {
  try {
    const { content } = req.body;

    const prompt = `
Generate 5 multiple-choice questions based on the following content.

Return ONLY valid JSON array in this exact format:

[
  {
    "question_text": "...",
    "option_a": "...",
    "option_b": "...",
    "option_c": "...",
    "option_d": "...",
    "correct_option": "A"
  }
]

CONTENT:
${content}
`;

    const HF_API_URL =
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

    const response = await axios.post(
      HF_API_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        timeout: 60000
      }
    );

    const rawOutput =
      response.data.generated_text ||
      response.data[0]?.generated_text ||
      JSON.stringify(response.data);

    let cleaned = rawOutput
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    cleaned = cleaned.substring(cleaned.indexOf("["));
    cleaned = cleaned.substring(0, cleaned.lastIndexOf("]") + 1);

    const questions = JSON.parse(cleaned);

    res.json({ questions });
  } catch (err) {
    console.error("AI GENERATION ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: "AI generation failed" });
  }
});

module.exports = router;
