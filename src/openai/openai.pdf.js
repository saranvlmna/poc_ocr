require("dotenv").config();
const axios = require("axios");
const { promisify } = require("util");
const sleep = promisify(setTimeout);
const { ComputerVisionClient } = require("@azure/cognitiveservices-computervision");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");

const key = process.env.API_KEY;
const endpoint = process.env.END_POINT;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
  endpoint
);

const extractTextFromURL = async (fileUrl) => {
  try {
    const result = await computerVisionClient.read(fileUrl);
    const operationLocation = result.operationLocation;
    if (!operationLocation) throw new Error("No operation location found in response.");

    let operationId = operationLocation.split("/").pop();

    while (true) {
      await sleep(1000);
      let response = await computerVisionClient.getReadResult(operationId);
      if (response.status === "succeeded") return formatOcrResults(response.analyzeResult.readResults);
      if (response.status === "failed") throw new Error("Text recognition failed.");
    }
  } catch (error) {
    console.error("Error extracting text:", error.message);
  }
};

const formatOcrResults = (readResults) => {
  return readResults
    .flatMap((result) => result.lines.map((line) => line.words.map((w) => w.text).join(" ")))
    .join("\n");
};

const processTextWithOpenAI = async (text) => {
  try {
    if (!text) throw new Error("No text found.");

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Extract structured JSON from this text.",
          },
          { role: "user", content: text },
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

    return JSON.parse(response.data.choices[0].message.content.trim().replace(/^```json\n|```$/g, ""));
  } catch (error) {
    throw new Error("OpenAI processing error: " + (error.response?.data || error.message));
  }
};

module.exports = async (fileUrl) => {
  const extractedText = await extractTextFromURL(fileUrl);
  return await processTextWithOpenAI(extractedText);
};
