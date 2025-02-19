require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

async function extractTextWithOpenAI(filePath, fileType) {
  try {
    const fileData = fs.readFileSync(filePath);
    const base64File = fileData.toString("base64");

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Extract structured JSON from the given document.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Extract text from this document and structure it as JSON.",
              },
              {
                type: "image_url",
                image_url: `data:${fileType};base64,${base64File}`,
              },
            ],
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
    return JSON.parse(jsonString.replace(/^```json\n|```$/g, ""));
  } catch (error) {
    throw new Error(
      "Failed to process file with OpenAI: " +
        (error.response?.data || error.message)
    );
  }
}

async function processFile(filePath, fileType) {
  try {
    console.log("Processing file:", filePath, fileType);

    if (!["application/pdf", "image/jpeg", "image/png"].includes(fileType)) {
      throw new Error(
        "Unsupported file type. Only PDFs and images are allowed."
      );
    }

    const jsonData = await extractTextWithOpenAI(filePath, fileType);
    console.log("Extracted JSON Data:", jsonData);
    return jsonData;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

module.exports = processFile;
