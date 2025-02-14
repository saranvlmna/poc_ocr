import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagePath = path.join(__dirname, "./assets/tollviolation.pdf");
const imageBuffer = fs.readFileSync(imagePath);

const intelligence = async () => {
  try {
    const endpoint = process.env.DI_ENDPOINT;
    const apiKey = process.env.DI_KEY;

    if (!endpoint || !apiKey) {
      throw new Error("Missing Azure endpoint or API key.");
    }

    const client = new DocumentAnalysisClient(
      endpoint,
      new AzureKeyCredential(apiKey)
    );

    // Start the document analysis
    const poller = await client.beginAnalyzeDocument(
      "prebuilt-invoice",
      imageBuffer
    );

    // Wait for completion and get the final result
    const result = await poller.pollUntilDone();

    console.log("Analysis Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
};

intelligence();
