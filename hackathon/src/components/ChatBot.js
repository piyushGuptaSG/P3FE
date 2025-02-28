import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
// Import only the icons we're actually using
import { FaLink, FaPaperPlane, FaFile } from "react-icons/fa";
// Remove the unused import
// import agentService from "../agents/agentService";
import axios from "axios"; // Add axios for API calls

// Define the API endpoint with the full URL as requested
const API_ENDPOINT = "https://52c3-14-143-227-22.ngrok-free.app/api/read";
// Define the improve API endpoint
const IMPROVE_API_ENDPOINT =
  "https://52c3-14-143-227-22.ngrok-free.app/api/improve";

// Map analysis types to actions for the new API format
const analysisTypeToAction = {
  // Developer options
  lld: "Low Level Design",
  code_gen: "Code Structure",
  gaps: "Requirement gaps",
  technical_details: "Technical Details",
  // Project Manager options
  summary: "Summary",
  requirements: "Requirements",
  planning: "Project Planning",
  subtasks: "JIRA Tickets",
  timeline: "Timeline Estimation",
  // QA options
  test_plan: "Test Plan",
  test_cases: "Test Cases",
  test_coverage: "Test Coverage",
};

// Map roles to their API representation
const roleToApiRole = {
  developer: "dev",
  pm: "pm",
  qa: "qa",
};

// Styled components for the chat interface
const ChatContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 600px;
`;

const ChatHeader = styled.div`
  background-color: #4a9cff;
  color: white;
  padding: 15px;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// eslint-disable-next-line no-unused-vars
const HuggingFaceLogo = styled.div`
  margin-left: 10px;
  display: flex;
  align-items: center;

  img {
    height: 24px;
    margin-left: 5px;
  }
`;

// Toggle switch container
const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #f0f4f8;
  border-bottom: 1px solid #ddd;
`;

// Toggle switch styles
const ToggleSwitch = styled.div`
  position: relative;
  width: 360px;
  height: 34px;
  background-color: #e4e9f0;
  border-radius: 17px;
  padding: 2px;
  display: flex;
`;

const ToggleOption = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  z-index: 1;
  font-size: 14px;
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
  color: ${(props) => (props.isActive ? "#fff" : "#555")};
  transition: all 0.3s ease;
  cursor: pointer;
`;

const ToggleSlider = styled.div`
  position: absolute;
  top: 2px;
  left: ${(props) => {
    if (props.role === "developer") return "2px";
    if (props.role === "pm") return "122px";
    if (props.role === "qa") return "242px";
    return "2px";
  }};
  width: 120px;
  height: 30px;
  background-color: #4a9cff;
  border-radius: 15px;
  transition: all 0.3s ease;
  pointer-events: none;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const MessageWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  ${(props) =>
    props.isUser &&
    `
    flex-direction: row-reverse;
  `}
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin: ${(props) => (props.isUser ? "0 0 0 12px" : "0 12px 0 0")};
  background-color: ${(props) => (props.isUser ? "#4a9cff" : "#e0e0e0")};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.isUser ? "white" : "#666")};
  font-size: 14px;
  font-weight: bold;
`;

const Message = styled.div`
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;

  ${(props) =>
    props.isUser
      ? `
    background-color: #4a9cff;
    color: white;
    border-bottom-right-radius: 5px;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: -8px;
      width: 16px;
      height: 16px;
      background-color: #4a9cff;
      clip-path: polygon(0 0, 0% 100%, 100% 100%);
    }
  `
      : `
    background-color: white;
    color: #333;
    border-bottom-left-radius: 5px;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: -8px;
      width: 16px;
      height: 16px;
      background-color: white;
      clip-path: polygon(100% 0, 0 100%, 100% 100%);
    }
  `}

  /* Add styling for markdown elements */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 16px;
    margin-bottom: 8px;
    font-weight: 600;
  }

  h1 {
    font-size: 24px;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 8px;
  }

  h2 {
    font-size: 20px;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 6px;
  }

  h3 {
    font-size: 18px;
  }

  p {
    margin: 10px 0;
  }

  ul,
  ol {
    padding-left: 20px;
    margin: 10px 0;
  }

  li {
    margin: 4px 0;
  }

  code {
    font-family: monospace;
    background-color: #f6f8fa;
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 90%;
  }

  pre {
    background-color: #f6f8fa;
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 10px 0;
  }

  blockquote {
    border-left: 4px solid #dfe2e5;
    padding-left: 16px;
    color: #6a737d;
    margin: 10px 0;
  }
`;

const InputContainer = styled.form`
  display: flex;
  padding: 20px;
  background-color: white;
  border-top: 1px solid #ddd;
  flex-direction: column;
  gap: 12px;
`;

const UrlInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f0f4f8;
  border-radius: 8px;
`;

const UrlInputHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const UrlInputTitle = styled.h4`
  margin: 0;
  color: #34495e;
`;

const UrlInputActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 24px;
  font-size: 16px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #4a9cff;
    box-shadow: 0 0 0 3px rgba(74, 156, 255, 0.1);
  }
`;

// eslint-disable-next-line no-unused-vars
const InputActions = styled.div`
  display: flex;
  margin-top: 10px;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background-color: #f0f4f8;
  color: #555;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e4e9f0;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    margin-right: 8px;
  }
`;

const SendButton = styled.button`
  background-color: #4a9cff;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 10px 20px;
  margin-left: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background-color: #3a8cee;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    margin-left: 8px;
  }
`;

const FileUploadOptions = styled.div`
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-direction: column;
  margin-top: 10px;
  gap: 10px;
  padding: 10px;
  background-color: #f0f4f8;
  border-radius: 8px;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AnalysisTypeSelector = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  outline: none;
  font-size: 14px;
  flex: 1;
`;

const FileUploadInfo = styled.div`
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const FileUploadActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const UploadButton = styled.button`
  background-color: #4a9cff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3a8cee;
  }
`;

const CancelButton = styled.button`
  background-color: #f0f4f8;
  color: #555;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e4e9f0;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

// eslint-disable-next-line no-unused-vars
const WelcomeMessage = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 10px;

  h3 {
    margin-top: 0;
    margin-bottom: 10px;
  }

  p {
    margin: 5px 0;
  }
`;

const ExtractedTextContainer = styled.div`
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  font-size: 12px;

  h4 {
    margin-top: 0;
  }

  pre {
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

// eslint-disable-next-line no-unused-vars
const ViewTextButton = styled.button`
  background-color: #6a7b8b;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #566674;
  }
`;

const FunLoadingMessages = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  const loadingMessages = [
    "Thinking deep thoughts...",
    "Consulting my digital brain...",
    "Brewing insights for you...",
    "Hold on, this is taking longer than expected...",
    "Searching for the meaning of life... and your answer...",
    "If I were human, I'd be scratching my head right now...",
    "Analyzing data at the speed of... well, not light...",
    "Doing AI push-ups to get stronger answers...",
    "Processing... please enjoy this digital moment of zen...",
    "Converting coffee to code... wait, I don't drink coffee...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LoadingMessageContainer>
      <LoadingIcon>💭</LoadingIcon>
      <LoadingText>{loadingMessages[messageIndex]}</LoadingText>
    </LoadingMessageContainer>
  );
};

const LoadingMessageContainer = styled.div`
  align-self: center;
  margin: 20px 0;
  padding: 12px 20px;
  background-color: #f0f4f8;
  border-radius: 20px;
  display: flex;
  align-items: center;
  max-width: 80%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const LoadingIcon = styled.div`
  font-size: 24px;
  margin-right: 12px;
`;

const LoadingText = styled.div`
  font-size: 16px;
  color: #4a5568;
  font-style: italic;
`;

// Keep original LoadingIndicator for backwards compatibility
const LoadingIndicator = styled.div`
  align-self: center;
  margin: 10px 0;
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4a9cff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Styled components for specialized CTAs
// eslint-disable-next-line no-unused-vars
const SpecializedCTAContainer = styled.div`
  display: flex;
  padding: 15px;
  background-color: #f0f4f8;
  border-bottom: 1px solid #ddd;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
`;

// Add a new styled component for the analysis options container
const AnalysisOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

// Update the CTAButton styling
// eslint-disable-next-line no-unused-vars
const CTAButton = styled.button`
  background-color: ${(props) => (props.primary ? "#4a9cff" : "#6c757d")};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 200px;
  justify-content: center;

  &:hover {
    background-color: ${(props) => (props.primary ? "#3a8cee" : "#5a6268")};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Add two new container components for the split layout
const ChatLayoutContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const LeftSideContainer = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ddd;
  background-color: #f5f5f5;
  overflow-y: auto;
  padding: 15px;
`;

const RightSideContainer = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
`;

// Simplified ChatBot Component
const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your AI assistant, powered by Hugging Face models. How can I help you today? Please select an analysis type and provide either a Confluence URL or upload a PDF to begin.",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("developer");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [analysisType, setAnalysisType] = useState("");
  const [showPdfOptions, setShowPdfOptions] = useState(false);
  const [isPdfFile, setIsPdfFile] = useState(false);
  const [analysisSource, setAnalysisSource] = useState("");
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add API connection test
  useEffect(() => {
    console.log("API endpoint set to:", API_ENDPOINT);
  }, []);

  // Toggle between roles (developer, PM, QA)
  const toggleRole = (newRole) => {
    // Only update if the role is different from current
    if (newRole === role) return;

    setRole(newRole);

    // Add message based on the selected role
    if (newRole === "developer") {
      setMessages((prev) => [
        ...prev,
        {
          text: "Switched to Developer mode. How can I assist you? Please select an analysis type and provide either a Confluence URL or upload a PDF.",
          isUser: false,
        },
      ]);
    } else if (newRole === "pm") {
      setMessages((prev) => [
        ...prev,
        {
          text: "Switched to Project Manager mode. How can I assist you? Please select an analysis type and provide either a Confluence URL or upload a PDF.",
          isUser: false,
        },
      ]);
    } else if (newRole === "qa") {
      setMessages((prev) => [
        ...prev,
        {
          text: "Switched to QA mode. How can I assist you? Please select an analysis type and provide either a Confluence URL or upload a PDF.",
          isUser: false,
        },
      ]);
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsPdfFile(file.type === "application/pdf");
      setShowFileUpload(true);
      setAnalysisSource("file");

      if (file.type === "application/pdf") {
        setShowPdfOptions(true);
      } else {
        setShowPdfOptions(false);
      }
    }
  };

  // Trigger file input click
  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  // Toggle URL input visibility
  const toggleUrlInput = () => {
    setShowUrlInput(!showUrlInput);
    if (!showUrlInput) {
      // Clear previous URL input when opening
      setUrlInput("");
      setAnalysisSource("url");
    } else {
      setAnalysisSource("");
    }
  };

  // Check if we have all required data for analysis
  const hasRequiredData = () => {
    if (!analysisType) return false;

    if (analysisSource === "url") {
      return urlInput.trim().length > 0;
    }

    if (analysisSource === "file") {
      return selectedFile !== null;
    }

    return false;
  };

  // Handle URL submission
  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    // Validate URL
    let url = urlInput.trim();
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    setIsLoading(true);
    setShowUrlInput(false);

    try {
      // Add message about the URL
      setMessages((prev) => [
        ...prev,
        {
          text: `I'm analyzing this Confluence page: ${url}`,
          isUser: true,
        },
      ]);

      // Get the action based on the selected analysis type
      const action = analysisTypeToAction[analysisType] || "Low Level Design";

      // Create payload with the exact structure requested
      const payload = {
        role: roleToApiRole[role] || "DEV",
        url: url,
        action: action,
      };

      console.log("Sending request to API:", payload);
      // Call the API endpoint
      const response = await axios.post(API_ENDPOINT, payload);
      console.log("API response:", response.data);
      const result = response.data;

      // Structure the API response in a more readable format
      if (result) {
        // Check for success status and add appropriate message
        if (result.status === "success") {
          setMessages((prev) => [
            ...prev,
            {
              text: `Analysis completed successfully!`,
              isUser: false,
            },
          ]);
        }

        // Add structured content if available
        if (result.generated_content) {
          // Set extracted text if available
          setExtractedText(result.generated_content);
          setShowExtractedText(true);

          // Instead of displaying sections as separate messages,
          // format them into a single cohesive message
          let formattedContent = "";

          // Add title if found
          const titleMatch = result.generated_content.match(/^## (.+?)$/m);
          if (titleMatch) {
            formattedContent += `# ${titleMatch[1]}\n\n`;
          }

          // Process content sections
          const sections = result.generated_content
            .split("###")
            .filter((section) => section.trim());

          if (sections.length > 0) {
            // Combine sections with proper markdown formatting
            sections.forEach((section) => {
              formattedContent += `### ${section.trim()}\n\n`;
            });

            // Add as a single message
            setMessages((prev) => [
              ...prev,
              {
                text: formattedContent.trim(),
                isUser: false,
              },
            ]);
          } else {
            // If we can't split it into sections, just show the whole content
            setMessages((prev) => [
              ...prev,
              {
                text: result.generated_content,
                isUser: false,
              },
            ]);
          }
        } else if (result.error) {
          // Handle error
          setMessages((prev) => [
            ...prev,
            {
              text: result.error,
              isUser: false,
            },
          ]);
        }
      } else {
        // Handle empty result
        setMessages((prev) => [
          ...prev,
          {
            text: "The analysis returned an empty result. Please try again.",
            isUser: false,
          },
        ]);
      }
    } catch (error) {
      console.error("Error analyzing URL:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: `Sorry, there was an error analyzing the Confluence URL: ${error.message}`,
          isUser: false,
        },
      ]);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload for analysis
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);

    try {
      if (isPdfFile) {
        // Add messages about the upload and analysis
        setMessages((prev) => [
          ...prev,
          {
            text: `I've uploaded "${selectedFile.name}" for ${analysisType} analysis.`,
            isUser: true,
          },
        ]);

        // Instead of API call, use mock data with setTimeout to simulate delay
        setTimeout(() => {
          const mockResult = {
            text: `Mock analysis for file "${selectedFile.name}" using ${analysisType} analysis.`,
            extractedContent: `Sample extracted content from "${selectedFile.name}"`,
          };

          setExtractedText(mockResult.extractedContent);
          setShowExtractedText(true);

          setMessages((prev) => [
            ...prev,
            {
              text: `I've analyzed your PDF. Here's what I found:`,
              isUser: false,
            },
            {
              text: mockResult.text,
              isUser: false,
            },
          ]);

          setIsLoading(false);
          setShowFileUpload(false);
          setSelectedFile(null);
        }, 2000);
      } else {
        // Handle non-PDF files if needed
        setMessages((prev) => [
          ...prev,
          {
            text: `I've uploaded "${selectedFile.name}" for analysis.`,
            isUser: true,
          },
          {
            text: "Sorry, currently only PDF files are supported for detailed analysis.",
            isUser: false,
          },
        ]);
        setIsLoading(false);
        setShowFileUpload(false);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: `Sorry, there was an error processing your file: ${error.message}`,
          isUser: false,
        },
      ]);
      setIsLoading(false);
      setShowFileUpload(false);
      setSelectedFile(null);
    }
  };

  // Cancel file upload
  const handleCancel = () => {
    setShowFileUpload(false);
    setSelectedFile(null);
    setShowPdfOptions(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Set submission attempt flag to true
    setHasAttemptedSubmit(true);

    // Check if we have all required data
    if (!hasRequiredData()) {
      // If not, add a message asking for the missing data
      setMessages((prev) => [
        ...prev,
        {
          text: "Please select an analysis type and provide either a Confluence URL or upload a PDF before sending a message.",
          isUser: false,
        },
      ]);
      return;
    }

    // Add user message
    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get the action based on the selected analysis type
      const action = analysisTypeToAction[analysisType] || "Test Cases";

      // Create payload with the required format
      const payload = {
        role: roleToApiRole[role] || "qa",
        user_feedback: input,
        action: action,
      };

      console.log("Sending request to improve API:", payload);

      // Call the improve API endpoint
      const response = await axios.post(IMPROVE_API_ENDPOINT, payload);
      console.log("API response:", response.data);
      const result = response.data;

      // Structure the API response in a more readable format
      if (result) {
        // Add structured content if available
        if (result.generated_content) {
          // Set extracted text if available
          setExtractedText(result.generated_content);
          setShowExtractedText(true);

          // Format the content similar to the URL analysis
          let formattedContent = "";

          // Add title if found
          const titleMatch = result.generated_content.match(/^## (.+?)$/m);
          if (titleMatch) {
            formattedContent += `# ${titleMatch[1]}\n\n`;
          }

          // Process content sections
          const sections = result.generated_content
            .split("###")
            .filter((section) => section.trim());

          if (sections.length > 0) {
            // Combine sections with proper markdown formatting
            sections.forEach((section) => {
              formattedContent += `### ${section.trim()}\n\n`;
            });

            // Add as a single message
            setMessages((prev) => [
              ...prev,
              {
                text: formattedContent.trim(),
                isUser: false,
              },
            ]);
          } else {
            // If we can't split it into sections, just show the whole content
            setMessages((prev) => [
              ...prev,
              {
                text: result.generated_content,
                isUser: false,
              },
            ]);
          }
        } else if (result.error) {
          // Handle error
          setMessages((prev) => [
            ...prev,
            {
              text: result.error,
              isUser: false,
            },
          ]);
        } else {
          // Handle empty or unexpected result
          setMessages((prev) => [
            ...prev,
            {
              text: "I received a response but couldn't process it. Please try again.",
              isUser: false,
            },
          ]);
        }
      } else {
        // Handle empty result
        setMessages((prev) => [
          ...prev,
          {
            text: "The analysis returned an empty result. Please try again.",
            isUser: false,
          },
        ]);
      }
    } catch (error) {
      console.error("Error getting agent response:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: `Sorry, I'm having trouble processing your request: ${error.message}`,
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle extracted text visibility
  const toggleExtractedText = () => {
    setShowExtractedText(!showExtractedText);
  };

  // Add helper function to convert file to base64
  // eslint-disable-next-line no-unused-vars
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Helper function to format text with markdown syntax
  const formatMessageText = (text) => {
    if (!text) return "";

    // Replace markdown headings
    let formattedText = text
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^#### (.*$)/gm, "<h4>$1</h4>")
      .replace(/^##### (.*$)/gm, "<h5>$1</h5>")
      .replace(/^###### (.*$)/gm, "<h6>$1</h6>");

    // Replace bold and italic
    formattedText = formattedText
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/__(.*?)__/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>");

    // Replace code blocks
    formattedText = formattedText
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");

    // Replace lists
    formattedText = formattedText
      .replace(/^\s*\d+\.\s+(.*$)/gm, "<li>$1</li>")
      .replace(/^\s*[-*]\s+(.*$)/gm, "<li>$1</li>");

    // Wrap lists with ul or ol
    formattedText = formattedText.replace(
      /<li>(.*?)(?=<\/li>)<\/li>/gs,
      (match) => {
        return `<ul>${match}</ul>`;
      }
    );

    // Replace paragraphs (leave this for last)
    formattedText = formattedText
      .replace(/(?<!\n<[^>]+>)\n\n(?![^<]*>)/g, "<br/><br/>")
      .replace(/(?<!\n<[^>]+>)\n(?![^<]*>)/g, "<br/>");

    return formattedText;
  };

  return (
    <ChatContainer>
      <ChatHeader>P3 - Peak Productivity Partner</ChatHeader>

      <ToggleContainer>
        <ToggleSwitch>
          <ToggleOption
            isActive={role === "developer"}
            onClick={() => toggleRole("developer")}
          >
            Developer
          </ToggleOption>
          <ToggleOption
            isActive={role === "pm"}
            onClick={() => toggleRole("pm")}
          >
            Project Manager
          </ToggleOption>
          <ToggleOption
            isActive={role === "qa"}
            onClick={() => toggleRole("qa")}
          >
            QA
          </ToggleOption>
          <ToggleSlider role={role} />
        </ToggleSwitch>
      </ToggleContainer>

      <ChatLayoutContainer>
        {/* Left Side - Controls */}
        <LeftSideContainer>
          <AnalysisOptionsContainer>
            <h4>Analysis Options</h4>
            <OptionRow>
              <span>Select Analysis Type:</span>
              <AnalysisTypeSelector
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
              >
                <option value="">-- Select Analysis Type --</option>
                {role === "developer" ? (
                  <>
                    <option value="lld">Low Level Design</option>
                    <option value="code_gen">Code Structure</option>
                    <option value="gaps">Requirement Gaps</option>
                  </>
                ) : role === "pm" ? (
                  <>
                    <option value="planning">Project Planning</option>
                    <option value="subtasks">JIRA Tickets</option>
                    <option value="timeline">Timeline Estimation</option>
                  </>
                ) : (
                  <>
                    <option value="test_plan">Test Plan</option>
                    <option value="test_cases">Test Cases</option>
                    <option value="test_coverage">Test Coverage</option>
                  </>
                )}
              </AnalysisTypeSelector>
            </OptionRow>
            {hasAttemptedSubmit && !analysisType && (
              <div
                style={{
                  marginTop: "10px",
                  color: "#e74c3c",
                }}
              >
                Please select an analysis type ⚠️
              </div>
            )}
          </AnalysisOptionsContainer>

          <ButtonGroup
            style={{
              margin: "15px 0",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <ActionButton
              type="button"
              onClick={toggleUrlInput}
              style={{
                width: "100%",
                backgroundColor:
                  analysisSource === "url" ? "#4a9cff" : "#f0f4f8",
                color: analysisSource === "url" ? "white" : "#555",
              }}
            >
              <FaLink /> Analyze Confluence URL
            </ActionButton>
            <ActionButton
              type="button"
              onClick={handleFileButtonClick}
              style={{
                width: "100%",
                backgroundColor:
                  analysisSource === "file" ? "#4a9cff" : "#f0f4f8",
                color: analysisSource === "file" ? "white" : "#555",
              }}
            >
              <FaFile /> Upload & Analyze PDF
            </ActionButton>
            {extractedText && (
              <ActionButton
                type="button"
                onClick={toggleExtractedText}
                style={{ width: "100%" }}
              >
                {showExtractedText
                  ? "Hide Extracted Text"
                  : "Show Extracted Text"}
              </ActionButton>
            )}
          </ButtonGroup>

          {hasAttemptedSubmit &&
            (!analysisSource ||
              (analysisSource === "url" && !urlInput) ||
              (analysisSource === "file" && !selectedFile)) && (
              <div
                style={{
                  marginTop: "10px",
                  color: "#e74c3c",
                }}
              >
                {!analysisSource
                  ? "Please select a source (URL or File) ⚠️"
                  : analysisSource === "url" && !urlInput
                  ? "Please enter a URL ⚠️"
                  : "Please select a file ⚠️"}
              </div>
            )}

          {showFileUpload && selectedFile && (
            <FileUploadInfo>
              <p>Selected file: {selectedFile.name}</p>

              {showPdfOptions && (
                <FileUploadOptions show={showPdfOptions}>
                  <h4>Confluence PDF Analysis Options:</h4>
                  <p>
                    Using selected analysis type:{" "}
                    <strong>{analysisType}</strong>
                  </p>
                </FileUploadOptions>
              )}

              <FileUploadActions>
                <UploadButton type="button" onClick={handleUpload}>
                  Analyze Document
                </UploadButton>
                <CancelButton type="button" onClick={handleCancel}>
                  Cancel
                </CancelButton>
              </FileUploadActions>
            </FileUploadInfo>
          )}

          {showUrlInput && (
            <UrlInputContainer>
              <UrlInputHeader>
                <UrlInputTitle>Enter Confluence URL to Analyze</UrlInputTitle>
              </UrlInputHeader>
              <ChatInput
                type="text"
                placeholder="Paste your Confluence URL here..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <UrlInputActions>
                <UploadButton type="button" onClick={handleUrlSubmit}>
                  Analyze Confluence
                </UploadButton>
                <CancelButton type="button" onClick={toggleUrlInput}>
                  Cancel
                </CancelButton>
              </UrlInputActions>
            </UrlInputContainer>
          )}

          {showExtractedText && extractedText && (
            <ExtractedTextContainer>
              <h4>
                {analysisSource === "file"
                  ? "Extracted Text from PDF:"
                  : "Analysis Results:"}
              </h4>
              <pre>{extractedText}</pre>
            </ExtractedTextContainer>
          )}

          {/* Hidden file input */}
          <HiddenFileInput
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
          />
        </LeftSideContainer>

        {/* Right Side - Chat */}
        <RightSideContainer>
          <ChatMessages>
            {messages.map((message, index) => (
              <MessageWrapper key={index} isUser={message.isUser}>
                <Avatar isUser={message.isUser}>
                  {message.isUser ? "U" : "AI"}
                </Avatar>
                <Message
                  isUser={message.isUser}
                  dangerouslySetInnerHTML={{
                    __html: formatMessageText(message.text),
                  }}
                />
              </MessageWrapper>
            ))}
            {isLoading && <FunLoadingMessages />}
            <div ref={messagesEndRef} />
          </ChatMessages>

          <InputContainer onSubmit={handleSubmit}>
            <ChatInput
              type="text"
              placeholder={
                hasRequiredData()
                  ? "Type your message..."
                  : "Select analysis type and source (URL/PDF) first..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <SendButton
              type="submit"
              disabled={isLoading || !input.trim() || !hasRequiredData()}
              title={
                !hasRequiredData()
                  ? "Please select an analysis type and provide a URL or file first"
                  : ""
              }
            >
              Send <FaPaperPlane />
            </SendButton>
          </InputContainer>
        </RightSideContainer>
      </ChatLayoutContainer>
    </ChatContainer>
  );
};

export default ChatBot;
