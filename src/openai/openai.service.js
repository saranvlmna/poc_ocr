require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

module.exports = async (filePath, fileType) => {
  try {
    console.log("Processing file:", filePath, fileType);

    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    const extractedText = pdfData.text;

    if (!extractedText.trim()) {
      throw new Error("No text found in PDF.");
    }

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Extract structured JSON from the given document.",
          },
          {
            role: "user",
            content: extractedText,
          },
        ],
        max_tokens: 1500,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const jsonString = response.data.choices[0].message.content.trim();
    const cleanedJsonString = jsonString.replace(/^```json\n|```$/g, "");
    const jsonData = JSON.parse(cleanedJsonString);

    console.log("Extracted JSON Data:", jsonData);
    return jsonData;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};
