import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { userInfo } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });



    // const prompt = `Generate 5 ${userInfo.experienceLevel} level programming only Multiple choice questions focusing on ${userInfo.techStack.join(', ')}. 
    // Consider that the user's current knowledge: ${userInfo.currentKnowledge}
    // Their learning goals are: ${userInfo.learningGoals}

    // Return questions in this JSON format:
    // [{
    //   "id": number,
    //   "question": string,
    //   "type": string,
    //   "category": string,
    //   "subcategory": string,
    //   "options": string[],
    //   "difficulty": string,
    //   "skills_assessed": string[]
    // }]

    // Questions should:
    // 1. Match their experience level (${userInfo.experienceLevel})
    // 2. Focus on their mentioned technologies: ${userInfo.techStack.join(', ')}
    // 3. Help assess their current knowledge: ${userInfo.currentKnowledge}
    // 4. Align with their learning goals: ${userInfo.learningGoals}
    // 5. Include practical, real-world scenarios
    
    // Ensure questions progressively get more challenging and cover different aspects of their tech stack.`;

    const prompt = `Generate 15 ${userInfo.experienceLevel} level programming multiple-choice questions focusing on ${userInfo.techStack.join(', ')}.
Their current knowledge is: ${userInfo.currentKnowledge}.
Their learning goals are: ${userInfo.learningGoals}.

Return questions in this JSON format:
[{
  "id": number,
  "question": string,
  "type": string,
  "category": string,
  "subcategory": string,
  "options": string[],
  "difficulty": string,
  "skills_assessed": string[]
}]

Questions should:
1. Match their experience level (${userInfo.experienceLevel}).
2. Focus on their mentioned technologies: ${userInfo.techStack.join(', ')}.
3. Be practical and progressively challenging.
Only return the JSON output.`;

    
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
