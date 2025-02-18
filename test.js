import axios from "axios";
import { readFileSync } from "fs";
import pdfParse from "pdf-parse";

const azureApiKey = "YOUR_AZURE_OPENAI_API_KEY";
const azureEndpoint = "YOUR_AZURE_OPENAI_ENDPOINT";

async function extractPdfToText(pdfPath) {
  const pdfBuffer = readFileSync(pdfPath);
  const data = await pdfParse(pdfBuffer);
  return data.text;
}

async function analyzeTextWithOpenAI(text) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${azureApiKey}`,
  };

  const data = {
    prompt: `Extract structured information from the following text and return it as a JSON object:\n\n${text}`,
    max_tokens: 1000,
    temperature: 0.5,
    top_p: 1,
    n: 1,
    stop: ["\n"],
  };

  try {
    const response = await axios.post(
      `${azureEndpoint}/openai/deployments/YOUR_DEPLOYMENT_ID/completions?api-version=2023-02-15-preview`,
      data,
      { headers }
    );
    return response.data.choices[0].text;
  } catch (error) {
    console.error(
      "Error analyzing with OpenAI:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

async function main() {
  const pdfPath = "path/to/your/file.pdf"; 

  try {
    const pdfText = await extractPdfToText(pdfPath);
    console.log("Extracted Text:", pdfText);

    const jsonResponse = await analyzeTextWithOpenAI(pdfText);
    if (jsonResponse) {
      console.log("Structured JSON Output:", JSON.parse(jsonResponse));
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
