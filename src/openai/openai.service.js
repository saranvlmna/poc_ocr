require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_MODEL_NAME = process.env.AZURE_OPENAI_MODEL_NAME;
const AZURE_OPENAI_MODEL_VERSION = process.env.AZURE_OPENAI_MODEL_VERSION;

module.exports = async (filePath) => {
  try {
    console.log("Processing file:", filePath);
    const base64Data = fs.readFileSync(filePath).toString("base64");

    const response = await axios.post(
      `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_MODEL_NAME}/chat/completions?api-version=${AZURE_OPENAI_MODEL_VERSION}`,
      {
        messages: [
          {
            role: "system",
            content: "Extract structured JSON from the given document.",
          },
          {
            role: "user",
            content: "Extract structured JSON from this PDF file.",
          },
        ],
        file: base64Data,
        max_tokens: 1500,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": AZURE_OPENAI_API_KEY,
        },
      }
    );

    console.log("Response Data:", response.data);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};
