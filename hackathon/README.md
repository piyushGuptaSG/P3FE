# AI Confluence PDF Analyzer

A fully functional chatbot application that can analyze PDFs from Confluence and extract valuable insights using AI. This application uses Hugging Face AI models to process documents and provide intelligent responses.

## Features

- **Chat Interface**: Ask questions and get AI-powered responses
- **PDF Analysis**: Upload Confluence PDFs and extract structured information
- **Multiple Analysis Types**:
  - **Summary**: Get an overview of the document content
  - **Requirements**: Extract user stories and requirements
  - **Technical Details**: Extract architecture and implementation details
  - **General Analysis**: Comprehensive document analysis

## Tech Stack

- **Frontend**: React with Styled Components
- **Backend**: FastAPI with Phidata AI framework
- **AI Models**: Hugging Face models (Llama, Phi, Mistral)
- **PDF Processing**: PyPDF2

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Python (3.8 or higher)
- Hugging Face API key

### Backend Setup

1. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the `backend` directory:

   ```
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```

4. Start the backend server:
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup

1. Install Node.js dependencies:

   ```bash
   npm install
   ```

2. Start the React development server:

   ```bash
   npm start
   ```

3. The application should now be running at http://localhost:3005

## Usage

### Chat with AI

1. Use the toggle at the top to switch between "Developer" and "Project Manager" modes
2. Type your questions in the input field and press Enter or click Send

### Analyze Confluence PDFs

1. Click the file icon in the chat input
2. Select a PDF file from your computer
3. Choose the analysis type from the dropdown menu
4. Click "Analyze Document"
5. The AI will process the PDF and provide insights
6. You can view the extracted text by clicking "Show Extracted Text"

## API Endpoints

- `POST /api/chat`: Send chat messages to the AI
- `POST /api/analyze-document`: Analyze text documents
- `POST /api/analyze-pdf`: Analyze PDF files

## Extending the Application

To add support for additional AI models or analysis types:

1. Update the backend `main.py` file to add new assistants or analysis types
2. Update the frontend `agentService.js` to support new API endpoints
3. Update the UI in `ChatBot.js` to add new options

## License

MIT

## Credits

- Built using [Phidata](https://docs.phidata.com/)
- AI models from [Hugging Face](https://huggingface.co/)
