# OCR POC

Is Proof of Concept (POC) for Optical Character Recognition (OCR) using Azure Cognitive Services. It extracts text from images and PDFs and processes the extracted data to generate structured JSON output.

# Three Different Azure AI Services Implemented in the Project

1. **OCR Computer Vision Service**

   - Output format is text, which requires more human effort to parse into the expected JSON output.

2. **OCR Computer Vision Service with Template**                    

   - Uses the same OCR service but parses the text data into a template to return the expected JSON output.

3. **Document Intelligence Service**
   - Utilizes the Document Intelligence service with some predefined models to parse image or PDF data into the expected output with high accuracy. If more accuracy is needed, it also provides custom model training and usage. This is considered a better approach for the OCR service.

## Project Structure

## Prerequisites

- Node.js
- Azure Cognitive Services account

## Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/saranvlmna/poc_ocr.git
   cd poc_ocr
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a [.env](http://_vscodecontentref_/10) file in the root directory and add your Azure Cognitive Services credentials:
   ```
   END_POINT="your_computer_vision_endpoint"
   API_KEY="your_computer_vision_api_key"
   DI_KEY="your_document_intelligence_api_key"
   DI_ENDPOINT="your_document_intelligence_endpoint"
   ```

## Running the Project

1. Start the server:

   ```sh
   npm run dev
   ```

2. The server will be running at `http://localhost:4578`.

## API Endpoints

### Computer Vision

- **Endpoint:** `/azure/vision`
- **Method:** `POST`
- **Description:** Upload an image file to extract text using Azure Computer Vision.
- **Request:** `multipart/form-data` with a file field named `file`.

### Document Intelligence

- **Endpoint:** `/azure/intelligence`
- **Method:** `POST`
- **Description:** Analyze a PDF document using Azure Document Intelligence.

## Scripts

- `scripts/template.js`: Parses OCR data and generates structured JSON.
- `scripts/test.js`: Tests the Azure Form Recognizer with a sample PDF.
