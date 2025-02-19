# OCR Proof of Concept (POC)

This project is a Proof of Concept (POC) for Optical Character Recognition (OCR) using Azure Cognitive Services. It extracts text from images and PDFs, processes the extracted data, and generates structured JSON output.

## Azure AI Services Implemented

The project integrates three different Azure AI services and OpenAI for OCR processing:

1. **OCR Computer Vision Service**
   - Extracts text from images and PDFs.
   - The output format is raw text, requiring additional parsing to convert it into structured JSON.

2. **OCR Computer Vision Service with Template**
   - Uses the same OCR service but applies a predefined template to structure the extracted text into JSON format.

3. **Document Intelligence Service**
   - Leverages Azure's Document Intelligence service with predefined models to accurately parse images and PDFs into structured JSON.
   - If higher accuracy is required, it supports custom model training and usage.

4. **OpenAI Service**
   - Utilizes OpenAI models for improved accuracy.
   - Supports both PDF and image processing.

## Project Structure

The project is structured to efficiently handle text extraction, processing, and formatting into structured JSON outputs using different AI services.

## Prerequisites

Before setting up the project, ensure you have the following:
- **Node.js** installed on your system.
- An **Azure Cognitive Services** account.

## Setup Instructions

1. Clone the repository:
   ```sh
   git clone https://github.com/saranvlmna/poc_ocr.git
   cd poc_ocr
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add your Azure Cognitive Services credentials:
   ```ini
   END_POINT="your_computer_vision_endpoint"
   API_KEY="your_computer_vision_api_key"
   DI_KEY="your_document_intelligence_api_key"
   DI_ENDPOINT="your_document_intelligence_endpoint"

   OPEN_AI_ENDPOINT="your_openai_endpoint"
   OPENAI_API_KEY="your_openai_api_key"

   AZURE_OPENAI_API_KEY="your_azure_openai_api_key"
   AZURE_OPENAI_ENDPOINT="your_azure_openai_endpoint"
   AZURE_OPENAI_MODEL_NAME="your_azure_openai_model_name"
   AZURE_OPENAI_MODEL_VERSION="your_azure_openai_model_version"
   ```

## Running the Project

1. Start the server:
   ```sh
   npm run dev
   ```

2. The server will be running at `http://localhost:4578`.

## API Endpoints

### 1. **Computer Vision OCR**
- **Endpoint:** `/azure/vision`
- **Method:** `POST`
- **Description:** Uploads an image file and extracts text using Azure Computer Vision.
- **Request Format:** `multipart/form-data` with a file field named `file`.

### 2. **Document Intelligence OCR**
- **Endpoint:** `/azure/intelligence`
- **Method:** `POST`
- **Description:** Analyzes a PDF document using Azure Document Intelligence.

## Scripts

- **`scripts/template.js`**: Parses OCR data and generates structured JSON.
- **`scripts/test.js`**: Tests the Azure Form Recognizer with a sample PDF.

This project demonstrates a robust approach to OCR by integrating multiple AI services to enhance accuracy and efficiency in text extraction and structuring.

