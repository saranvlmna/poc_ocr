const dotenv = require("dotenv");
dotenv.config();
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");
const fs = require("fs");
const path = require("path");
const imagePath = path.join(__dirname, "./assets/tollviolation.pdf");
const imageBuffer = fs.readFileSync(imagePath);
const endpoint = process.env.AZURE_DOCINTELLIGENCE_KEY;
const apiKey = process.env.AZURE_DOCINTELLIGENCE_ENDPOINT;
//models: "prebuilt-invoice" "prebuilt-layout" "prebuilt-read" "prebuilt-document" "prebuilt-tax.us.w2" "prebuilt-invoice"

const intelligence = async () => {
  try {
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

    const model = "prebuilt-invoice";
    const poller = await client.beginAnalyzeDocument(model, imageBuffer);

    const {
      documents: [result],
    } = await poller.pollUntilDone();

    const data = result.fields;
    console.log("Analysis Result:", JSON.stringify(data));
  } catch (error) {
    console.error("Error:", error.message);
  }
};
intelligence();
