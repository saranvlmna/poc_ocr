require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const sleep = promisify(setTimeout);
const {
  ComputerVisionClient,
} = require("@azure/cognitiveservices-computervision");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");
const key = process.env.API_KEY;
const endpoint = process.env.END_POINT;
const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
  endpoint
);
// const imagePath = path.resolve(__dirname, "../../assets/image.png");

module.exports = async (file) => {
  const imagePath =file
  console.log("Processing local image:", imagePath);
  try {
    const printedResult = await readTextFromFile(
      computerVisionClient,
      imagePath
    );
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
  console.log("Recognized text:");
  const ocrResult = [];
  for (const result of readResults) {
    if (result.lines.length) {
      for (const line of result.lines) {
        ocrResult.push(line.words.map((w) => w.text).join(" "));
      }
      console.log("Recognized text: Done");
      return ocrResult;
    } else {
      console.log("No recognized text.");
    }
  }
};
