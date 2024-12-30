import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { answers, questions } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Create a structured analysis prompt
    const analysisPrompt = `
    Based on the following assessment results, provide a detailed analysis in valid JSON format.
    
    Assessment Summary:
    ${questions.map((q: { id: string, question: string, category: string, difficulty: string }, index: number) => `
      Question ${index + 1}: ${q.question}
      Selected Answer: ${answers[q.id] || 'Not answered'}
      Category: ${q.category}
      Difficulty: ${q.difficulty}
    `).join('\n')}

    Provide an analysis in the following JSON structure (ensure it's valid JSON):
    {
      "skillLevel": "string describing overall skill level",
      "strongAreas": ["area1", "area2"],
      "improvementAreas": ["area1", "area2"],
      "studyTopics": ["topic1", "topic2"],
      "learningPath": "string describing recommended learning path",
      "detailedAnalysis": "string with comprehensive analysis"
    }

    Keep the response as a clean JSON object without any markdown formatting or code blocks.`;

    try {
      const result = await model.generateContent(analysisPrompt);
      const response = await result.response;
      const text = response.text();

      // Clean and validate the JSON,
      const cleanText = text
        .replace(/```json\s*|\s*```/g, '') // Remove
        .replace(/[\u0000-\u001F]+/g, ' ') // Remove control characters
        .trim();

      try {
        // First attempt to parse the cleaned JSON
        const analysis = JSON.parse(cleanText);
        return Response.json(analysis);
      } catch (parseError) {
        // If parsing fails, return a structured fallback response
        console.error('JSON parsing error:', parseError);
        return Response.json({
          skillLevel: "Assessment completed",
          strongAreas: ["Unable to determine strong areas"],
          improvementAreas: ["Analysis generation needs improvement"],
          studyTopics: ["General programming fundamentals"],
          learningPath: "Please consult with a mentor for personalized guidance",
          detailedAnalysis: "The analysis system encountered an error. Please try again or consult the raw assessment results."
        });
      }
    } catch (generationError) {
      console.error('Content generation error:', generationError);
      throw new Error('Failed to generate analysis');
    }
  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json({ 
      error: 'Failed to analyze answers',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
