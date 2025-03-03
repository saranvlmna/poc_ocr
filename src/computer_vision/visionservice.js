require("dotenv").config();
const fs = require("fs");
const { promisify } = require("util");
const sleep = promisify(setTimeout);
const { ComputerVisionClient } = require("@azure/cognitiveservices-computervision");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");
const key = process.env.AZURE_VISION_KEY;
const endpoint = process.env.AZURE_VISION_ENDPOINT;
const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
  endpoint
);

module.exports = async (file) => {
  console.log("Processing...");
  const imagePath = file;
  try {
    const printedResult = await readTextFromFile(computerVisionClient, imagePath);
    return printRecText(printedResult);
  } catch (error) {
    console.error("Error processing image:", error);
  }
};

const readTextFromFile = async (client, imagePath) => {
  if (!fs.existsSync(imagePath)) {
    throw new Error("File not found: " + imagePath);
  }
  let result = await client.readInStream(() => fs.createReadStream(imagePath), {
    raw: true,
  });

  let operationLocation = result.operationLocation;
  if (!operationLocation) {
    throw new Error("No operation location found in response.");
  }
  let operationId = operationLocation.split("/").pop();

  while (true) {
    await sleep(1000);
    let response = await client.getReadResult(operationId);
    let status = response.status;

    if (status === "succeeded") {
      return response.analyzeResult.readResults;
    } else if (status === "failed") {
      throw new Error("Text recognition failed.");
    }
  }
};

const printRecText = (readResults) => {
  const ocrResult = [];
  for (const result of readResults) {
    if (result.lines.length) {
      for (const line of result.lines) {
        ocrResult.push(line.words.map((w) => w.text).join(" "));
      }
      return ocrResult;
    } else {
      console.log("No recognized text.");
    }
  }
};
