require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = process.env.OPEN_AI_ENDPOINT;

const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text.trim();
  } catch (error) {
    throw new Error("Failed to extract text from PDF: " + error.message);
  }
};

const extractTextFromImage = async (filePath) => {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(filePath, "eng");
    return text.trim();
  } catch (error) {
    throw new Error("Failed to extract text from image: " + error.message);
  }
};

const processTextWithOpenAI = async (text) => {
  try {
    if (!text) throw new Error("No text found in document.");

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
            content: text,
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
      "Failed to process text with OpenAI: " +
        (error.response?.data || error.message)
    );
  }
};

const processFile = async (filePath, fileType) => {
  try {
    console.log("Processing file:", filePath, fileType);

    let extractedText;
    if (fileType === "application/pdf") {
      extractedText = await extractTextFromPDF(filePath);
    } else if (fileType === "image/jpeg" || fileType === "image/png") {
      extractedText = await extractTextFromImage(filePath);
    } else {
      throw new Error(
        "Unsupported file type. Only 'pdf' and 'image' are supported."
      );
    }

    const jsonData = await processTextWithOpenAI(extractedText);
    console.log("Extracted JSON Data:", jsonData);
    return jsonData;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

module.exports = processFile;
