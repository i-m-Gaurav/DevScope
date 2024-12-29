import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate 10 scenario-based questions to assess full-stack development proficiency. Return only a JSON array with the following structure:
    [{
      "id": number,
      "question": string,        // Real-world scenario or practical knowledge assessment
      "type": string,           // "practical_experience" | "technical_knowledge" | "problem_solving" | "system_design"
      "category": string,       // Primary skill being assessed (e.g., "React", "Backend Architecture", "Database Design")
      "subcategory": string,    // Specific aspect (e.g., "State Management", "API Integration", "Performance Optimization")
      "options": [              // Multiple choice options that reflect real scenarios
        string,
        string,
        string,
        string
      ],
      "difficulty": string,     // "junior" | "mid-level" | "senior"
      "skills_assessed": [      // Array of specific skills being evaluated
        string,
        string
      ]
    }]
    
    Requirements:
    - Questions should assess practical knowledge rather than theoretical concepts
    - Include scenarios about:
      * Frontend development with React (hooks, state management, performance)
      * Backend development with Node.js/Express
      * Database design and management (MongoDB, SQL)
      * API design and integration
      * Full-stack application architecture
      * Deployment and DevOps basics
      * Security best practices
      * Performance optimization
      * Error handling and debugging
      * State management solutions (Redux, Context API)
      * Authentication and authorization
      * Real-time features implementation
      * Testing strategies
      * Code organization and best practices
    
    - Questions should evaluate the ability to:
      * Build complete features independently
      * Debug complex issues
      * Make architectural decisions
      * Optimize application performance
      * Handle security concerns
      * Work with databases effectively
      * Implement proper error handling
      * Deploy and maintain applications
    
    Example question:
    {
      "id": 1,
      "question": "You're building a real-time chat application using React and Node.js. Users report messages are arriving out of order and some messages are missing. What would be your first step to debug this issue?",
      "type": "problem_solving",
      "category": "Full Stack Development",
      "subcategory": "Real-time Features",
      "options": [
        "Add console.log statements in the frontend React components to track message arrival",
        "Implement message sequencing with timestamps and analyze the message queue in your backend",
        "Switch from WebSocket to long polling to see if it resolves the issue",
        "Add error boundaries in React components to catch message processing errors"
      ],
      "difficulty": "mid-level",
      "skills_assessed": ["WebSocket handling", "Debugging", "Real-time data management"]
    }
    
    Generate questions that help evaluate if a developer can independently build and maintain production-ready full-stack applications.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response text to extract only the JSON part
    const jsonString = text
      .replace(/```json\s*|\s*```/g, '') // Remove markdown code blocks
      .trim();

    try {
      const parsedQuestions = JSON.parse(jsonString);
      return Response.json({ questions: parsedQuestions });
    } catch (parseError) {
      console.error('JSON parsing error:', parseError, 'Raw text:', jsonString);
      return Response.json({ error: 'Invalid JSON format received' }, { status: 500 });
    }
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Failed to generate questions' }, { status: 500 });
  }
}
