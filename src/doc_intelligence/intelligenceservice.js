const dotenv = require("dotenv");
dotenv.config();
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");
const fs = require("fs");
const endpoint = process.env.AZURE_DOCINTELLIGENCE_KEY;
const apiKey = process.env.AZURE_DOCINTELLIGENCE_ENDPOINT;
//models: "prebuilt-invoice" "prebuilt-layout" "prebuilt-read" "prebuilt-document" "prebuilt-tax.us.w2" "prebuilt-invoice"

module.exports = async (file) => {
  try {
    console.log("Processing...");
    const imagePath = file;
    const imageBuffer = fs.readFileSync(imagePath);
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

    const model = "prebuilt-invoice";
    const poller = await client.beginAnalyzeDocument(model, imageBuffer);

    const {
      documents: [result],
    } = await poller.pollUntilDone();

    const data = result.fields;
    return data;
  } catch (error) {
    console.error("Error:", error.message);
  }
};
