// Agent Service - Provides responses using mock data instead of backend API
// This service simulates responses that would normally come from the backend

// Mock API endpoints (not actually used, just for reference)
// eslint-disable-next-line no-unused-vars
const API_ENDPOINTS = {
  CHAT: "http://localhost:8000/api/chat",
  ANALYZE_DOCUMENT: "http://localhost:8000/api/analyze-document",
  ANALYZE_PDF: "http://localhost:8000/api/analyze-pdf",
};

// Define models to use for different roles (just for reference)
// eslint-disable-next-line no-unused-vars
const MODELS = {
  DEVELOPER: "meta-llama/Meta-Llama-3-8B-Instruct",
  PROJECT_MANAGER: "microsoft/Phi-3-mini-4k-instruct",
  DOCUMENT_ANALYZER: "mistralai/Mistral-7B-Instruct-v0.2",
};

// These knowledge patterns are used for our mock responses
const DEVELOPER_KNOWLEDGE = {
  patterns: [
    {
      keywords: ["javascript", "js", "framework", "react"],
      responses: [
        "React is a JavaScript library for building user interfaces. It's known for its component-based architecture and virtual DOM which optimizes rendering performance.",
        "When working with React, remember to use functional components with hooks for modern development. UseEffect and useState are fundamental hooks to understand.",
      ],
    },
    {
      keywords: ["node", "backend", "express", "server"],
      responses: [
        "Node.js allows JavaScript to run on the server-side. Combined with Express, it creates a powerful backend framework for web applications.",
        "For Node.js development, consider using async/await for cleaner asynchronous code instead of callbacks or promise chains.",
      ],
    },
    {
      keywords: ["database", "sql", "nosql", "mongodb", "postgres"],
      responses: [
        "MongoDB is a NoSQL database ideal for flexible, document-oriented data structures, while PostgreSQL is a robust relational database with strong ACID compliance.",
        "When designing your database schema, consider the query patterns your application will use to determine the optimal structure.",
      ],
    },
    {
      keywords: ["api", "rest", "graphql", "endpoint"],
      responses: [
        "RESTful APIs use standard HTTP methods and stateless communication. GraphQL offers more flexibility with a single endpoint and client-specified queries.",
        "When designing APIs, ensure proper authentication, rate limiting, and clear documentation for developers.",
      ],
    },
    {
      keywords: ["testing", "jest", "unit test", "integration test"],
      responses: [
        "Testing is crucial for code quality. Unit tests verify individual components while integration tests check how components work together.",
        "Jest is a popular JavaScript testing framework with built-in mocking capabilities and snapshot testing.",
      ],
    },
    {
      keywords: ["deployment", "ci/cd", "pipeline", "docker", "kubernetes"],
      responses: [
        "CI/CD pipelines automate testing and deployment, ensuring code quality and faster releases. Tools like Jenkins, GitHub Actions, and GitLab CI are popular choices.",
        "Docker containers provide environment consistency across development, testing, and production.",
      ],
    },
    {
      keywords: ["architecture", "structure", "design pattern", "mvc", "mvvm"],
      responses: [
        "Software architecture defines the structure and relationships between components. Common patterns include MVC, MVVM, and microservices.",
        "Clean architecture emphasizes separation of concerns, with business logic independent of frameworks and UI.",
      ],
    },
    {
      keywords: ["performance", "optimization", "speed", "load time"],
      responses: [
        "Web performance optimization involves minimizing file sizes, reducing HTTP requests, and efficient rendering strategies.",
        "Consider code splitting, lazy loading, and memoization to improve React application performance.",
      ],
    },
  ],
};

// Project manager knowledge patterns
const PROJECT_MANAGER_KNOWLEDGE = {
  patterns: [
    {
      keywords: ["agile", "scrum", "sprint", "kanban"],
      responses: [
        "Agile methodologies like Scrum focus on iterative development with regular feedback. Sprints typically last 2-4 weeks with daily standups to track progress.",
        "Kanban is a visual workflow management method that helps teams visualize their work, limit work-in-progress, and maximize efficiency.",
      ],
    },
    {
      keywords: ["timeline", "deadline", "schedule", "milestone"],
      responses: [
        "When planning project timelines, always include buffer time for unexpected challenges and technical debt resolution.",
        "Breaking down large projects into smaller milestones makes progress more measurable and provides natural checkpoints for course correction.",
      ],
    },
    {
      keywords: ["team", "resource", "allocation", "planning"],
      responses: [
        "Effective resource allocation requires understanding team members' strengths and ensuring they're working on tasks that maximize their contributions.",
        "Consider using a RACI matrix (Responsible, Accountable, Consulted, Informed) to clarify roles and responsibilities in complex projects.",
      ],
    },
    {
      keywords: ["stakeholder", "communication", "meeting", "report"],
      responses: [
        "Regular stakeholder communication is essential. Tailor your communication style and level of technical detail to your audience.",
        "Project status reports should be concise, highlight achievements, address challenges transparently, and clearly communicate next steps.",
      ],
    },
    {
      keywords: ["requirements", "user story", "feature", "scope"],
      responses: [
        "Well-defined requirements reduce development ambiguity. User stories should follow the format 'As a [role], I want [goal] so that [benefit]'.",
        "Requirements gathering should involve stakeholders early and often, using techniques like interviews, workshops, and prototyping.",
      ],
    },
    {
      keywords: ["budget", "cost", "estimate", "financial"],
      responses: [
        "Software project budgeting should account for development hours, infrastructure costs, third-party services, and contingency reserves.",
        "Track actual costs against estimates throughout the project to identify variances early and adjust as needed.",
      ],
    },
    {
      keywords: ["quality", "qa", "testing", "acceptance criteria"],
      responses: [
        "Quality assurance strategy should balance automated and manual testing, with clear acceptance criteria for each feature.",
        "Implement quality gates throughout the development process rather than leaving all testing to the end of the project.",
      ],
    },
    {
      keywords: ["jira", "ticket", "task", "issue tracking"],
      responses: [
        "JIRA tickets should be specific, measurable, and include clear acceptance criteria. Epics group related stories, while tasks break down implementation steps.",
        "Maintain your JIRA board with regular grooming sessions to ensure tickets are properly prioritized and contain up-to-date information.",
      ],
    },
  ],
};

// In-memory conversation context
let conversationContext = [];

// Helper function to find matching patterns in knowledge base
const findMatchingPatterns = (input, knowledgeBase) => {
  const inputLower = input.toLowerCase();
  const matches = [];

  knowledgeBase.patterns.forEach((pattern) => {
    const matchesKeyword = pattern.keywords.some((keyword) =>
      inputLower.includes(keyword.toLowerCase())
    );

    if (matchesKeyword) {
      matches.push(pattern);
    }
  });

  return matches;
};

// Helper function to get a random response from matching patterns
const getRandomResponse = (matches) => {
  if (matches.length === 0) {
    return "I don't have specific information about that topic. Could you ask something else about software development or project management?";
  }

  // Pick a random matching pattern
  const randomPattern = matches[Math.floor(Math.random() * matches.length)];

  // Pick a random response from the pattern
  return randomPattern.responses[
    Math.floor(Math.random() * randomPattern.responses.length)
  ];
};

// Mock function to get a developer response
const getDeveloperResponse = async (input) => {
  // Store in context
  conversationContext.push({ role: "user", content: input });

  // Find matching patterns
  const matches = findMatchingPatterns(input, DEVELOPER_KNOWLEDGE);

  // Generate response
  const response =
    getRandomResponse(matches) ||
    "As a developer, I'd approach this by breaking down the problem into smaller components and implementing them incrementally. What specific aspect would you like me to elaborate on?";

  // Store in context
  conversationContext.push({ role: "assistant", content: response });

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return response;
};

// Mock function to get a project manager response
const getProjectManagerResponse = async (input) => {
  // Store in context
  conversationContext.push({ role: "user", content: input });

  // Find matching patterns
  const matches = findMatchingPatterns(input, PROJECT_MANAGER_KNOWLEDGE);

  // Generate response
  const response =
    getRandomResponse(matches) ||
    "From a project management perspective, I would recommend setting clear milestones, tracking progress regularly, and maintaining open communication with stakeholders. Would you like more specific advice on any of these areas?";

  // Store in context
  conversationContext.push({ role: "assistant", content: response });

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return response;
};

// Mock function to clear conversation context
const clearConversation = () => {
  conversationContext = [];
  return true;
};

// Mock function for PDF analysis
const analyzeConfluencePDF = async (file, requestType = "summary") => {
  // Simulate loading time
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Generate mock responses based on analysis type
  let analysisText = "";

  switch (requestType) {
    case "summary":
      analysisText =
        "# Summary of Confluence Document\n\n" +
        "This document appears to cover project requirements and technical specifications for a new system. " +
        "Key points include:\n\n" +
        "- The project aims to deliver a web-based application with mobile support\n" +
        "- Target completion is set for Q3 2023\n" +
        "- Main stakeholders include Product, Engineering, and QA teams\n" +
        "- Technical stack includes React, Node.js, and PostgreSQL";
      break;

    case "requirements":
      analysisText =
        "# Requirements and User Stories\n\n" +
        "## Functional Requirements\n\n" +
        "1. Users must be able to register and login securely\n" +
        "2. Users must be able to upload and manage documents\n" +
        "3. System must support real-time notifications\n\n" +
        "## User Stories\n\n" +
        "- As a user, I want to easily search for documents by keyword\n" +
        "- As an admin, I want to manage user permissions\n" +
        "- As a user, I want to receive notifications when documents are updated";
      break;

    case "technical_details":
      analysisText =
        "# Technical Architecture\n\n" +
        "## Frontend\n\n" +
        "- React 18 with TypeScript\n" +
        "- Redux for state management\n" +
        "- Material UI for components\n\n" +
        "## Backend\n\n" +
        "- Node.js with Express\n" +
        "- PostgreSQL database\n" +
        "- REST API with JWT authentication\n\n" +
        "## Infrastructure\n\n" +
        "- AWS hosting (EC2, S3, RDS)\n" +
        "- CI/CD with GitHub Actions\n" +
        "- Docker containerization";
      break;

    // Developer-specific analysis types
    case "lld":
      analysisText =
        "# Low-Level Design Document\n\n" +
        "## Component Architecture\n\n" +
        "### User Authentication Module\n" +
        "- AuthService: Handles JWT token generation, validation, and refresh\n" +
        "- UserRepository: Data access layer for user information\n" +
        "- AuthController: API endpoints for login, logout, and registration\n\n" +
        "### Document Management System\n" +
        "- DocumentService: Business logic for document operations\n" +
        "- StorageProvider: Interface for file storage (S3 implementation)\n" +
        "- PermissionValidator: Validates user permissions for documents\n\n" +
        "### Notification System\n" +
        "- NotificationService: Manages user notification preferences and delivery\n" +
        "- NotificationFactory: Creates different types of notifications\n" +
        "- DeliveryProvider: Interface for notification delivery methods\n\n" +
        "## Data Models\n\n" +
        "```typescript\n" +
        "interface User {\n" +
        "  id: string;\n" +
        "  email: string;\n" +
        "  passwordHash: string;\n" +
        "  role: 'admin' | 'user';\n" +
        "  createdAt: Date;\n" +
        "}\n\n" +
        "interface Document {\n" +
        "  id: string;\n" +
        "  title: string;\n" +
        "  content: string;\n" +
        "  ownerId: string;\n" +
        "  createdAt: Date;\n" +
        "  updatedAt: Date;\n" +
        "  tags: string[];\n" +
        "}\n" +
        "```\n\n" +
        "## API Endpoints\n\n" +
        "POST /api/auth/login\n" +
        "GET /api/documents\n" +
        "POST /api/documents\n" +
        "GET /api/documents/:id\n" +
        "PUT /api/documents/:id\n" +
        "DELETE /api/documents/:id";
      break;

    case "code_gen":
      analysisText =
        "# Code Structure Generation\n\n" +
        "## Folder Structure\n\n" +
        "```\n" +
        "src/\n" +
        "├── components/\n" +
        "│   ├── auth/\n" +
        "│   │   ├── Login.tsx\n" +
        "│   │   ├── Register.tsx\n" +
        "│   │   └── ProtectedRoute.tsx\n" +
        "│   ├── documents/\n" +
        "│   │   ├── DocumentList.tsx\n" +
        "│   │   ├── DocumentEditor.tsx\n" +
        "│   │   ├── DocumentCard.tsx\n" +
        "│   │   └── DocumentSearch.tsx\n" +
        "│   ├── notifications/\n" +
        "│   │   ├── NotificationCenter.tsx\n" +
        "│   │   └── NotificationItem.tsx\n" +
        "│   └── common/\n" +
        "│       ├── Header.tsx\n" +
        "│       ├── Footer.tsx\n" +
        "│       ├── Sidebar.tsx\n" +
        "│       └── Modal.tsx\n" +
        "├── services/\n" +
        "│   ├── authService.ts\n" +
        "│   ├── documentService.ts\n" +
        "│   └── notificationService.ts\n" +
        "├── hooks/\n" +
        "│   ├── useAuth.ts\n" +
        "│   ├── useDocuments.ts\n" +
        "│   └── useNotifications.ts\n" +
        "├── context/\n" +
        "│   ├── AuthContext.tsx\n" +
        "│   └── ThemeContext.tsx\n" +
        "└── utils/\n" +
        "    ├── api.ts\n" +
        "    ├── validation.ts\n" +
        "    └── formatters.ts\n" +
        "```\n\n" +
        "## Key Component Implementation\n\n" +
        "### DocumentList.tsx\n\n" +
        "```tsx\n" +
        "import React, { useEffect, useState } from 'react';\n" +
        "import { useDocuments } from '../../hooks/useDocuments';\n" +
        "import DocumentCard from './DocumentCard';\n" +
        "import DocumentSearch from './DocumentSearch';\n\n" +
        "const DocumentList = () => {\n" +
        "  const { documents, loading, error, fetchDocuments } = useDocuments();\n" +
        "  const [searchTerm, setSearchTerm] = useState('');\n\n" +
        "  useEffect(() => {\n" +
        "    fetchDocuments();\n" +
        "  }, [fetchDocuments]);\n\n" +
        "  const filteredDocuments = documents.filter(doc =>\n" +
        "    doc.title.toLowerCase().includes(searchTerm.toLowerCase())\n" +
        "  );\n\n" +
        "  return (\n" +
        '    <div className="document-list-container">\n' +
        "      <DocumentSearch value={searchTerm} onChange={setSearchTerm} />\n" +
        "      {loading ? (\n" +
        "        <p>Loading documents...</p>\n" +
        "      ) : error ? (\n" +
        "        <p>Error loading documents: {error}</p>\n" +
        "      ) : (\n" +
        '        <div className="document-grid">\n' +
        "          {filteredDocuments.map(doc => (\n" +
        "            <DocumentCard key={doc.id} document={doc} />\n" +
        "          ))}\n" +
        "        </div>\n" +
        "      )}\n" +
        "    </div>\n" +
        "  );\n" +
        "};\n\n" +
        "export default DocumentList;\n" +
        "```";
      break;

    case "gaps":
      analysisText =
        "# Requirements Gaps Analysis\n\n" +
        "## Missing Requirements\n\n" +
        "1. **Authentication Error Handling**\n" +
        "   - The document doesn't specify how authentication errors should be handled\n" +
        "   - No details about account lockout after failed attempts\n" +
        "   - Missing password recovery workflow\n\n" +
        "2. **Data Validation**\n" +
        "   - No specific validation rules for user inputs\n" +
        "   - Missing constraints for document size and supported formats\n" +
        "   - No information about input sanitization to prevent security issues\n\n" +
        "3. **Performance Requirements**\n" +
        "   - No defined SLAs or performance benchmarks\n" +
        "   - Missing information about expected load and scaling requirements\n" +
        "   - No caching strategy defined for frequently accessed resources\n\n" +
        "4. **Accessibility Requirements**\n" +
        "   - No mention of WCAG compliance or accessibility standards\n" +
        "   - Missing requirements for screen reader support\n" +
        "   - No color contrast requirements specified\n\n" +
        "5. **Internationalization**\n" +
        "   - No requirements for multiple language support\n" +
        "   - Missing details about date/time/currency formatting for different locales\n" +
        "   - No RTL language support requirements\n\n" +
        "## Ambiguous Requirements\n\n" +
        '1. "System must support real-time notifications" - What is the expected latency?\n' +
        '2. "Users must be able to manage documents" - What specific operations are included?\n' +
        '3. "Secure authentication" - What security standards should be followed?\n\n' +
        "## Recommended Clarifications\n\n" +
        "1. Define specific performance SLAs (e.g., page load time < 2s)\n" +
        "2. Specify all CRUD operations and permissions for document management\n" +
        "3. Detail the authentication method (OAuth, JWT, etc.) and security requirements\n" +
        "4. Clarify notification types and delivery mechanisms";
      break;

    // Project manager-specific analysis types
    case "planning":
      analysisText =
        "# Project Planning\n\n" +
        "## Project Timeline\n\n" +
        "| Phase | Duration | Start Date | End Date |\n" +
        "|-------|----------|------------|----------|\n" +
        "| Requirements Gathering | 2 weeks | 2023-07-03 | 2023-07-14 |\n" +
        "| Design | 3 weeks | 2023-07-17 | 2023-08-04 |\n" +
        "| Development | 8 weeks | 2023-08-07 | 2023-09-29 |\n" +
        "| Testing | 3 weeks | 2023-10-02 | 2023-10-20 |\n" +
        "| UAT | 2 weeks | 2023-10-23 | 2023-11-03 |\n" +
        "| Deployment | 1 week | 2023-11-06 | 2023-11-10 |\n\n" +
        "## Resource Allocation\n\n" +
        "- Frontend Development: 3 engineers (8 weeks)\n" +
        "- Backend Development: 2 engineers (8 weeks)\n" +
        "- UX/UI Design: 1 designer (5 weeks)\n" +
        "- QA: 2 testers (5 weeks)\n" +
        "- DevOps: 1 engineer (3 weeks)\n" +
        "- Product Manager: 1 (full project duration)\n\n" +
        "## Risk Assessment\n\n" +
        "| Risk | Probability | Impact | Mitigation |\n" +
        "|------|------------|--------|------------|\n" +
        "| Scope creep | High | High | Regular backlog refinement, strict change management process |\n" +
        "| Technical debt | Medium | Medium | Code reviews, architectural oversight, documentation |\n" +
        "| Resource unavailability | Low | High | Cross-training team members, flexible resource allocation |\n" +
        "| Third-party integration issues | Medium | High | Early integration testing, fallback options |\n\n" +
        "## Communication Plan\n\n" +
        "- Daily Standups: 15 minutes, every workday at 10:00 AM\n" +
        "- Sprint Planning: Bi-weekly, Mondays 9:00 AM - 11:00 AM\n" +
        "- Sprint Review: Bi-weekly, Fridays 3:00 PM - 4:00 PM\n" +
        "- Sprint Retrospective: Bi-weekly, Fridays 4:00 PM - 5:00 PM\n" +
        "- Stakeholder Updates: Weekly, Wednesdays 2:00 PM - 3:00 PM";
      break;

    case "subtasks":
      analysisText =
        "# JIRA Ticket Breakdown\n\n" +
        "## Epic: User Authentication System\n\n" +
        "### User Stories\n\n" +
        "**STORY-1: User Registration**\n" +
        "As a new user, I want to create an account so that I can access the system.\n\n" +
        "**Tasks:**\n" +
        "- TASK-1.1: Create registration form UI (Frontend, 3 points)\n" +
        "- TASK-1.2: Implement form validation (Frontend, 2 points)\n" +
        "- TASK-1.3: Create user registration API endpoint (Backend, 3 points)\n" +
        "- TASK-1.4: Implement email verification flow (Backend, 5 points)\n" +
        "- TASK-1.5: Write unit tests for registration (QA, 2 points)\n\n" +
        "**STORY-2: User Login**\n" +
        "As a registered user, I want to log in so that I can use the system.\n\n" +
        "**Tasks:**\n" +
        "- TASK-2.1: Create login form UI (Frontend, 2 points)\n" +
        "- TASK-2.2: Implement form validation (Frontend, 1 point)\n" +
        "- TASK-2.3: Create authentication API endpoint (Backend, 3 points)\n" +
        "- TASK-2.4: Implement JWT token generation and validation (Backend, 5 points)\n" +
        "- TASK-2.5: Write unit tests for login (QA, 2 points)\n\n" +
        "**STORY-3: Password Reset**\n" +
        "As a user, I want to reset my password if I forget it.\n\n" +
        "**Tasks:**\n" +
        "- TASK-3.1: Create password reset request UI (Frontend, 2 points)\n" +
        "- TASK-3.2: Create new password form UI (Frontend, 2 points)\n" +
        "- TASK-3.3: Implement password reset API endpoints (Backend, 4 points)\n" +
        "- TASK-3.4: Create email notification service for reset links (Backend, 3 points)\n" +
        "- TASK-3.5: Write integration tests for password reset flow (QA, 3 points)\n\n" +
        "## Epic: Document Management\n\n" +
        "### User Stories\n\n" +
        "**STORY-4: Document Upload**\n" +
        "As a user, I want to upload documents so that I can store them in the system.\n\n" +
        "**Tasks:**\n" +
        "- TASK-4.1: Create document upload UI (Frontend, 3 points)\n" +
        "- TASK-4.2: Implement file type and size validation (Frontend, 2 points)\n" +
        "- TASK-4.3: Create document upload API endpoint (Backend, 3 points)\n" +
        "- TASK-4.4: Implement storage service integration (Backend, 4 points)\n" +
        "- TASK-4.5: Create progress indicator for uploads (Frontend, 2 points)\n\n" +
        "**STORY-5: Document Search**\n" +
        "As a user, I want to search for documents by keyword.\n\n" +
        "**Tasks:**\n" +
        "- TASK-5.1: Create search UI (Frontend, 2 points)\n" +
        "- TASK-5.2: Implement search results display (Frontend, 3 points)\n" +
        "- TASK-5.3: Create search API endpoint (Backend, 3 points)\n" +
        "- TASK-5.4: Implement search indexing service (Backend, 5 points)\n" +
        "- TASK-5.5: Optimize search performance (Backend, 3 points)";
      break;

    default: // general
      analysisText =
        "# General Analysis\n\n" +
        "The document contains a mix of business requirements, technical specifications, " +
        "and project timeline information. It appears to be a comprehensive project plan " +
        "for a new web application development initiative.\n\n" +
        "Key sections include project overview, goals, technical architecture, " +
        "team structure, and implementation timeline. The document is well-structured " +
        "but could benefit from more detailed acceptance criteria for each requirement.";
  }

  // Generate random extraction text
  const extractedContent = `CONFLUENCE DOCUMENT
Document Title: Project Requirements
Author: John Smith
Created: January 15, 2023
Last Updated: February 20, 2023

CONTENT SECTION 1: Introduction
This document outlines the requirements and specifications for the new system.
The project aims to deliver improvements in user experience and performance.

CONTENT SECTION 2: Requirements
The system must support the following features:
- User authentication and authorization
- Document management
- Reporting and analytics
- Notifications and alerts

CONTENT SECTION 3: Technical Specifications
The implementation will use the following technologies:
- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- Hosting: AWS`;

  return {
    text: analysisText,
    extractedContent: extractedContent,
  };
};

// Mock function for Confluence URL analysis
const analyzeConfluenceURL = async (url, requestType = "summary") => {
  // Check if it's a valid Confluence URL
  if (!url.includes("confluence") && !url.includes("atlassian")) {
    return {
      error: "Please provide a valid Confluence or Atlassian URL.",
      text: "",
      extractedContent: "",
    };
  }

  // Simulate loading time
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate mock responses based on analysis type - reusing the same content from PDF analysis
  let analysisText = "";

  switch (requestType) {
    case "summary":
      analysisText =
        "# Summary of Confluence Document\n\n" +
        "This document appears to cover project requirements and technical specifications for a new system. " +
        "Key points include:\n\n" +
        "- The project aims to deliver a web-based application with mobile support\n" +
        "- Target completion is set for Q3 2023\n" +
        "- Main stakeholders include Product, Engineering, and QA teams\n" +
        "- Technical stack includes React, Node.js, and PostgreSQL";
      break;

    case "requirements":
      analysisText =
        "# Requirements and User Stories\n\n" +
        "## Functional Requirements\n\n" +
        "1. Users must be able to register and login securely\n" +
        "2. Users must be able to upload and manage documents\n" +
        "3. System must support real-time notifications\n\n" +
        "## User Stories\n\n" +
        "- As a user, I want to easily search for documents by keyword\n" +
        "- As an admin, I want to manage user permissions\n" +
        "- As a user, I want to receive notifications when documents are updated";
      break;

    case "technical_details":
      analysisText =
        "# Technical Architecture\n\n" +
        "## Frontend\n\n" +
        "- React 18 with TypeScript\n" +
        "- Redux for state management\n" +
        "- Material UI for components\n\n" +
        "## Backend\n\n" +
        "- Node.js with Express\n" +
        "- PostgreSQL database\n" +
        "- REST API with JWT authentication\n\n" +
        "## Infrastructure\n\n" +
        "- AWS hosting (EC2, S3, RDS)\n" +
        "- CI/CD with GitHub Actions\n" +
        "- Docker containerization";
      break;

    // Developer-specific analysis types
    case "lld":
      analysisText =
        "# Low-Level Design Document\n\n" +
        "## Component Architecture\n\n" +
        "### User Authentication Module\n" +
        "- AuthService: Handles JWT token generation, validation, and refresh\n" +
        "- UserRepository: Data access layer for user information\n" +
        "- AuthController: API endpoints for login, logout, and registration\n\n" +
        "### Document Management System\n" +
        "- DocumentService: Business logic for document operations\n" +
        "- StorageProvider: Interface for file storage (S3 implementation)\n" +
        "- PermissionValidator: Validates user permissions for documents\n\n" +
        "### Notification System\n" +
        "- NotificationService: Manages user notification preferences and delivery\n" +
        "- NotificationFactory: Creates different types of notifications\n" +
        "- DeliveryProvider: Interface for notification delivery methods\n\n" +
        "## Data Models\n\n" +
        "```typescript\n" +
        "interface User {\n" +
        "  id: string;\n" +
        "  email: string;\n" +
        "  passwordHash: string;\n" +
        "  role: 'admin' | 'user';\n" +
        "  createdAt: Date;\n" +
        "}\n\n" +
        "interface Document {\n" +
        "  id: string;\n" +
        "  title: string;\n" +
        "  content: string;\n" +
        "  ownerId: string;\n" +
        "  createdAt: Date;\n" +
        "  updatedAt: Date;\n" +
        "  tags: string[];\n" +
        "}\n" +
        "```\n\n" +
        "## API Endpoints\n\n" +
        "POST /api/auth/login\n" +
        "GET /api/documents\n" +
        "POST /api/documents\n" +
        "GET /api/documents/:id\n" +
        "PUT /api/documents/:id\n" +
        "DELETE /api/documents/:id";
      break;

    case "code_gen":
      analysisText =
        "# Code Structure Generation\n\n" +
        "## Folder Structure\n\n" +
        "```\n" +
        "src/\n" +
        "├── components/\n" +
        "│   ├── auth/\n" +
        "│   │   ├── Login.tsx\n" +
        "│   │   ├── Register.tsx\n" +
        "│   │   └── ProtectedRoute.tsx\n" +
        "│   ├── documents/\n" +
        "│   │   ├── DocumentList.tsx\n" +
        "│   │   ├── DocumentEditor.tsx\n" +
        "│   │   ├── DocumentCard.tsx\n" +
        "│   │   └── DocumentSearch.tsx\n" +
        "│   ├── notifications/\n" +
        "│   │   ├── NotificationCenter.tsx\n" +
        "│   │   └── NotificationItem.tsx\n" +
        "│   └── common/\n" +
        "│       ├── Header.tsx\n" +
        "│       ├── Footer.tsx\n" +
        "│       ├── Sidebar.tsx\n" +
        "│       └── Modal.tsx\n" +
        "├── services/\n" +
        "│   ├── authService.ts\n" +
        "│   ├── documentService.ts\n" +
        "│   └── notificationService.ts\n" +
        "├── hooks/\n" +
        "│   ├── useAuth.ts\n" +
        "│   ├── useDocuments.ts\n" +
        "│   └── useNotifications.ts\n" +
        "├── context/\n" +
        "│   ├── AuthContext.tsx\n" +
        "│   └── ThemeContext.tsx\n" +
        "└── utils/\n" +
        "    ├── api.ts\n" +
        "    ├── validation.ts\n" +
        "    └── formatters.ts\n" +
        "```\n\n" +
        "## Key Component Implementation\n\n" +
        "```tsx\n" +
        "import React, { useEffect, useState } from 'react';\n" +
        "import { useDocuments } from '../../hooks/useDocuments';\n" +
        "import DocumentCard from './DocumentCard';\n" +
        "import DocumentSearch from './DocumentSearch';\n\n" +
        "const DocumentList = () => {\n" +
        "  const { documents, loading, error, fetchDocuments } = useDocuments();\n" +
        "  const [searchTerm, setSearchTerm] = useState('');\n\n" +
        "  useEffect(() => {\n" +
        "    fetchDocuments();\n" +
        "  }, [fetchDocuments]);\n\n" +
        "  const filteredDocuments = documents.filter(doc =>\n" +
        "    doc.title.toLowerCase().includes(searchTerm.toLowerCase())\n" +
        "  );\n\n" +
        "  return (\n" +
        '    <div className="document-list-container">\n' +
        "      <DocumentSearch value={searchTerm} onChange={setSearchTerm} />\n" +
        "      {loading ? (\n" +
        "        <p>Loading documents...</p>\n" +
        "      ) : error ? (\n" +
        "        <p>Error loading documents: {error}</p>\n" +
        "      ) : (\n" +
        '        <div className="document-grid">\n' +
        "          {filteredDocuments.map(doc => (\n" +
        "            <DocumentCard key={doc.id} document={doc} />\n" +
        "          ))}\n" +
        "        </div>\n" +
        "      )}\n" +
        "    </div>\n" +
        "  );\n" +
        "};\n" +
        "```";
      break;

    case "gaps":
      analysisText =
        "# Requirements Gaps Analysis\n\n" +
        "## Missing Requirements\n\n" +
        "1. **Authentication Error Handling**\n" +
        "   - The document doesn't specify how authentication errors should be handled\n" +
        "   - No details about account lockout after failed attempts\n" +
        "   - Missing password recovery workflow\n\n" +
        "2. **Data Validation**\n" +
        "   - No specific validation rules for user inputs\n" +
        "   - Missing constraints for document size and supported formats\n" +
        "   - No information about input sanitization to prevent security issues\n\n" +
        "3. **Performance Requirements**\n" +
        "   - No defined SLAs or performance benchmarks\n" +
        "   - Missing information about expected load and scaling requirements\n" +
        "   - No caching strategy defined for frequently accessed resources\n\n" +
        "4. **Accessibility Requirements**\n" +
        "   - No mention of WCAG compliance or accessibility standards\n" +
        "   - Missing requirements for screen reader support\n" +
        "   - No color contrast requirements specified\n\n" +
        "5. **Internationalization**\n" +
        "   - No requirements for multiple language support\n" +
        "   - Missing details about date/time/currency formatting for different locales\n" +
        "   - No RTL language support requirements\n\n" +
        "## Ambiguous Requirements\n\n" +
        '1. "System must support real-time notifications" - What is the expected latency?\n' +
        '2. "Users must be able to manage documents" - What specific operations are included?\n' +
        '3. "Secure authentication" - What security standards should be followed?\n\n' +
        "## Recommended Clarifications\n\n" +
        "1. Define specific performance SLAs (e.g., page load time < 2s)\n" +
        "2. Specify all CRUD operations and permissions for document management\n" +
        "3. Detail the authentication method (OAuth, JWT, etc.) and security requirements\n" +
        "4. Clarify notification types and delivery mechanisms";
      break;

    case "planning":
      analysisText =
        "# Project Planning\n\n" +
        "## Project Timeline\n\n" +
        "| Phase | Duration | Start Date | End Date |\n" +
        "|-------|----------|------------|----------|\n" +
        "| Requirements Gathering | 2 weeks | 2023-07-03 | 2023-07-14 |\n" +
        "| Design | 3 weeks | 2023-07-17 | 2023-08-04 |\n" +
        "| Development | 8 weeks | 2023-08-07 | 2023-09-29 |\n" +
        "| Testing | 3 weeks | 2023-10-02 | 2023-10-20 |\n" +
        "| UAT | 2 weeks | 2023-10-23 | 2023-11-03 |\n" +
        "| Deployment | 1 week | 2023-11-06 | 2023-11-10 |\n\n" +
        "## Resource Allocation\n\n" +
        "- Frontend Development: 3 engineers (8 weeks)\n" +
        "- Backend Development: 2 engineers (8 weeks)\n" +
        "- UX/UI Design: 1 designer (5 weeks)\n" +
        "- QA: 2 testers (5 weeks)\n" +
        "- DevOps: 1 engineer (3 weeks)\n" +
        "- Product Manager: 1 (full project duration)\n\n" +
        "## Risk Assessment\n\n" +
        "| Risk | Probability | Impact | Mitigation |\n" +
        "|------|------------|--------|------------|\n" +
        "| Scope creep | High | High | Regular backlog refinement, strict change management process |\n" +
        "| Technical debt | Medium | Medium | Code reviews, architectural oversight, documentation |\n" +
        "| Resource unavailability | Low | High | Cross-training team members, flexible resource allocation |\n" +
        "| Third-party integration issues | Medium | High | Early integration testing, fallback options |\n\n" +
        "## Communication Plan\n\n" +
        "- Daily Standups: 15 minutes, every workday at 10:00 AM\n" +
        "- Sprint Planning: Bi-weekly, Mondays 9:00 AM - 11:00 AM\n" +
        "- Sprint Review: Bi-weekly, Fridays 3:00 PM - 4:00 PM\n" +
        "- Sprint Retrospective: Bi-weekly, Fridays 4:00 PM - 5:00 PM\n" +
        "- Stakeholder Updates: Weekly, Wednesdays 2:00 PM - 3:00 PM";
      break;

    case "subtasks":
      analysisText =
        "# JIRA Ticket Breakdown\n\n" +
        "## Epic: User Authentication System\n\n" +
        "### User Stories\n\n" +
        "**STORY-1: User Registration**\n" +
        "As a new user, I want to create an account so that I can access the system.\n\n" +
        "**Tasks:**\n" +
        "- TASK-1.1: Create registration form UI (Frontend, 3 points)\n" +
        "- TASK-1.2: Implement form validation (Frontend, 2 points)\n" +
        "- TASK-1.3: Create user registration API endpoint (Backend, 3 points)\n" +
        "- TASK-1.4: Implement email verification flow (Backend, 5 points)\n" +
        "- TASK-1.5: Write unit tests for registration (QA, 2 points)\n\n" +
        "**STORY-2: User Login**\n" +
        "As a registered user, I want to log in so that I can use the system.\n\n" +
        "**Tasks:**\n" +
        "- TASK-2.1: Create login form UI (Frontend, 2 points)\n" +
        "- TASK-2.2: Implement form validation (Frontend, 1 point)\n" +
        "- TASK-2.3: Create authentication API endpoint (Backend, 3 points)\n" +
        "- TASK-2.4: Implement JWT token generation and validation (Backend, 5 points)\n" +
        "- TASK-2.5: Write unit tests for login (QA, 2 points)\n\n" +
        "**STORY-3: Password Reset**\n" +
        "As a user, I want to reset my password if I forget it.\n\n" +
        "**Tasks:**\n" +
        "- TASK-3.1: Create password reset request UI (Frontend, 2 points)\n" +
        "- TASK-3.2: Create new password form UI (Frontend, 2 points)\n" +
        "- TASK-3.3: Implement password reset API endpoints (Backend, 4 points)\n" +
        "- TASK-3.4: Create email notification service for reset links (Backend, 3 points)\n" +
        "- TASK-3.5: Write integration tests for password reset flow (QA, 3 points)\n\n" +
        "## Epic: Document Management\n\n" +
        "### User Stories\n\n" +
        "**STORY-4: Document Upload**\n" +
        "As a user, I want to upload documents so that I can store them in the system.\n\n" +
        "**Tasks:**\n" +
        "- TASK-4.1: Create document upload UI (Frontend, 3 points)\n" +
        "- TASK-4.2: Implement file type and size validation (Frontend, 2 points)\n" +
        "- TASK-4.3: Create document upload API endpoint (Backend, 3 points)\n" +
        "- TASK-4.4: Implement storage service integration (Backend, 4 points)\n" +
        "- TASK-4.5: Create progress indicator for uploads (Frontend, 2 points)\n\n" +
        "**STORY-5: Document Search**\n" +
        "As a user, I want to search for documents by keyword.\n\n" +
        "**Tasks:**\n" +
        "- TASK-5.1: Create search UI (Frontend, 2 points)\n" +
        "- TASK-5.2: Implement search results display (Frontend, 3 points)\n" +
        "- TASK-5.3: Create search API endpoint (Backend, 3 points)\n" +
        "- TASK-5.4: Implement search indexing service (Backend, 5 points)\n" +
        "- TASK-5.5: Optimize search performance (Backend, 3 points)";
      break;

    default: // general
      analysisText =
        "# General Analysis of Confluence Document\n\n" +
        "The document contains a mix of business requirements, technical specifications, " +
        "and project timeline information. It appears to be a comprehensive project plan " +
        "for a new web application development initiative.\n\n" +
        "Key sections include project overview, goals, technical architecture, " +
        "team structure, and implementation timeline. The document is well-structured " +
        "but could benefit from more detailed acceptance criteria for each requirement.";
  }

  // Generate mock page title and metadata for Confluence
  const pageTitle = "Project Requirements and Technical Specifications";
  const author = "John Smith";
  const lastUpdated = "February 20, 2023";
  const spaceKey = "PROJ";
  const pageId = "12345678";

  // Generate random extraction text
  const extractedContent = `CONFLUENCE PAGE: ${pageTitle}
URL: ${url}
Space: ${spaceKey}
Page ID: ${pageId}
Author: ${author}
Last Updated: ${lastUpdated}

CONTENT SECTION 1: Introduction
This document outlines the requirements and specifications for the new system.
The project aims to deliver improvements in user experience and performance.

CONTENT SECTION 2: Requirements
The system must support the following features:
- User authentication and authorization
- Document management
- Reporting and analytics
- Notifications and alerts

CONTENT SECTION 3: Technical Specifications
The implementation will use the following technologies:
- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- Hosting: AWS`;

  return {
    text: analysisText,
    extractedContent: extractedContent,
    pageTitle: pageTitle,
    author: author,
    lastUpdated: lastUpdated,
    spaceKey: spaceKey,
    pageId: pageId,
  };
};

// Helper function to convert a file to base64 (still needed for mock implementation)
// eslint-disable-next-line no-unused-vars
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Extract the base64 part (remove the data:application/pdf;base64, prefix)
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

// Export the agent service functions
const agentService = {
  getDeveloperResponse,
  getProjectManagerResponse,
  clearConversation,
  analyzeConfluencePDF,
  analyzeConfluenceURL,
};

export default agentService;
