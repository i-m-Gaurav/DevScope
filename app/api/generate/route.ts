import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const BATCH_SIZE = 1;

export async function POST(req: Request) {
  try {
    const { userInfo, questionCount = 1, previousQuestions = [] } = await req.json();

    const prompt = `Generate ${BATCH_SIZE} ${userInfo.experienceLevel} level programming question focusing on ${userInfo.techStack.join(", ")}.
Current knowledge: ${userInfo.currentKnowledge}
Learning goals: ${userInfo.learningGoals}

Return in JSON format:
{
  "id": ${previousQuestions.length + 1},
  "question": string,
  "type": "multiple-choice",
  "category": string,
  "subcategory": string,
  "options": string[],
  "difficulty": string,
  "skills_assessed": string[]
}

Ensure the question:
1. Matches level: ${userInfo.experienceLevel}
2. Focuses on: ${userInfo.techStack.join(", ")}
3. Is practical and different from previous questions
Only return the JSON output.`;

    const chatCompletion = await getGroqChatCompletion(prompt);
    const text = chatCompletion.choices[0]?.message?.content || "";
    const jsonString = text.replace(/```json\s*|\s*```/g, "").trim();

    try {
      const parsedQuestion = JSON.parse(jsonString);
      return Response.json({ 
        question: parsedQuestion,
        isComplete: previousQuestions.length + 1 >= questionCount 
      });
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return Response.json({ error: "Invalid JSON format" }, { status: 500 });
    }
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Failed to generate question" }, { status: 500 });
  }
}

async function getGroqChatCompletion(prompt: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}