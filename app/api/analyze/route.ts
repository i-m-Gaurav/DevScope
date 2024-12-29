import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { answers, questions }: { answers: Record<string, string>, questions: { id: string, question: string, category: string, difficulty: string }[] } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const analysisPrompt = `
    Analyze these programming assessment answers and provide a detailed report.
    
    Questions and Answers:
    ${questions.map((q: { id: string, question: string, category: string, difficulty: string }, index: number) => `
      Q${index + 1}: ${q.question}
      Selected Answer: ${answers[q.id] || 'Not answered'}
      Category: ${q.category}
      Difficulty: ${q.difficulty}
    `).join('\n')}

    Please provide:
    1. Overall skill level assessment
    2. Strong areas
    3. Areas needing improvement
    4. Specific topics to study
    5. Recommended learning path
    Format as JSON:
    {
      "skillLevel": "text",
      "strongAreas": ["area1", "area2"],
      "improvementAreas": ["area1", "area2"],
      "studyTopics": ["topic1", "topic2"],
      "learningPath": "detailed text",
      "detailedAnalysis": "comprehensive analysis text"
    }`;

    const result = await model.generateContent(analysisPrompt);
    const response = result.response;
    const text = response.text();
    
    const analysis = JSON.parse(text.replace(/```json\s*|\s*```/g, '').trim());
    return Response.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json({ error: 'Failed to analyze answers' }, { status: 500 });
  }
}
