import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const { post } = axios;

const endpoint = process.env.OPEN_AI_ENDPOINT;
const apiKey = process.env.OPEN_AI_KEY;

// It's safer not to log the API Key. Commented out for security.
console.log("Endpoint:", endpoint); // API Key is sensitive and should not be logged.

const prompt = "What is the capital of France?";

async function getAIResponse() {
  try {
    const response = await post(
      `https://saran-m7abe38g-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-08-01-preview`, // Added missing slash
      {
        messages: [{ role: "user", content: prompt }], // Corrected to match chat-based API structure
        max_tokens: 50,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    console.log(response);
    console.log("AI Response:", response.data.choices[0].message.content); // Adjusted to handle response format
  } catch (error) {
    console.log(error)
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
}

getAIResponse();
