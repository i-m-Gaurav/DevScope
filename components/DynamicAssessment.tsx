import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { UserInfo } from './UserAssessmentForm';

// Expanded fallback questions
interface Question {
  id: number;
  question: string;
  options: string[];
  difficulty: string;
  category: string;
}

interface Answers {
  [key: number]: string;
}

interface Analysis {
  skillLevel: string;
  strongAreas: string[];
  improvementAreas: string[];
  studyTopics: string[];
  learningPath: string;
  detailedAnalysis: string;
}

const fallbackQuestions: Question[] = [
  {
    id: 1,
    question: "What is the primary purpose of version control systems like Git?",
    options: [
      "To make backup copies of code",
      "To track changes and collaborate with others",
      "To compress code files",
      "To debug code automatically"
    ],
    difficulty: "beginner",
    category: "fundamentals"
  },
  {
    id: 2,
    question: "Which data structure would be most efficient for implementing a LIFO (Last In, First Out) pattern?",
    options: [
      "Queue",
      "Stack",
      "Linked List",
      "Binary Tree"
    ],
    difficulty: "intermediate",
    category: "data-structures"
  },
  {
    id: 3,
    question: "What does the 'async' keyword do in JavaScript?",
    options: [
      "Makes the function run faster",
      "Indicates the function returns a Promise",
      "Stops the function from executing",
      "Creates a new thread"
    ],
    difficulty: "intermediate",
    category: "javascript"
  },
  {
    id: 4,
    question: "What is the time complexity of binary search?",
    options: [
      "O(n)",
      "O(log n)",
      "O(n²)",
      "O(1)"
    ],
    difficulty: "advanced",
    category: "algorithms"
  },
  {
    id: 5,
    question: "Which HTML5 tag is used to display a video?",
    options: [
      "<media>",
      "<video>",
      "<player>",
      "<film>"
    ],
    difficulty: "beginner",
    category: "web-development"
  },
  {
    id: 6,
    question: "What is the purpose of CSS Box Model?",
    options: [
      "To create 3D boxes in CSS",
      "To define spacing and borders around elements",
      "To create popup boxes",
      "To store CSS variables"
    ],
    difficulty: "beginner",
    category: "web-development"
  },
  {
    id: 7,
    question: "What is the difference between '==' and '===' in JavaScript?",
    options: [
      "No difference, they are the same",
      "'===' checks both value and type, '==' only checks value",
      "'==' is deprecated",
      "'===' is only for numbers"
    ],
    difficulty: "intermediate",
    category: "javascript"
  },
  {
    id: 8,
    question: "Which SQL command is used to modify existing data in a table?",
    options: [
      "MODIFY",
      "UPDATE",
      "CHANGE",
      "ALTER"
    ],
    difficulty: "beginner",
    category: "databases"
  },
  {
    id: 9,
    question: "What is a REST API?",
    options: [
      "A programming language",
      "An architectural style for APIs",
      "A database system",
      "A frontend framework"
    ],
    difficulty: "intermediate",
    category: "web-development"
  },
  {
    id: 10,
    question: "What is the purpose of dependency injection?",
    options: [
      "To inject code into a website",
      "To reduce coupling between classes",
      "To speed up code execution",
      "To compress code files"
    ],
    difficulty: "advanced",
    category: "software-design"
  }
];

async function generateQuestions(userInfo: UserInfo): Promise<Question[]> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInfo }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate questions');
    }

    const data = await response.json();
    
    if (data.error || !data.questions) {
      throw new Error(data.error || 'Invalid response format');
    }

    return data.questions.map((q: Question, index: number) => ({
      ...q,
      id: index + 1
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    return fallbackQuestions;
  }
}

interface DynamicAssessmentProps {
  userInfo: UserInfo;
}

const DynamicAssessment: React.FC<DynamicAssessmentProps> = ({ userInfo }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async (): Promise<void> => {
    setLoading(true);
    try {
      const generatedQuestions = await generateQuestions(userInfo);
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error("Error loading questions:", error);
      setQuestions(fallbackQuestions);
    }
    setLoading(false);
  };

  const handleAnswer = (questionId: number, answer: string): void => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = (): void => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRegenerate = (): void => {
    setAnswers({});
    setCurrentStep(0);
    loadQuestions();
  };

  const handleSubmit = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          questions,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const analysisResult = await response.json();
      setAnalysis(analysisResult);
    } catch (error) {
      console.error('Error analyzing answers:', error);
    }
    setAnalyzing(false);
  };

  const currentQuestion = questions[currentStep];
  const progress = (currentStep / questions.length) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Generating questions...</span>
      </div>
    );
  }

  if (analysis) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Assessment Analysis</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Skill Level</h3>
              <p>{analysis.skillLevel}</p>
            </div>
            <div>
              <h3 className="font-semibold">Strong Areas</h3>
              <ul className="list-disc pl-5">
                {analysis.strongAreas.map((area, i) => (
                  <li key={i}>{area}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Areas for Improvement</h3>
              <ul className="list-disc pl-5">
                {analysis.improvementAreas.map((area, i) => (
                  <li key={i}>{area}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Recommended Study Topics</h3>
              <ul className="list-disc pl-5">
                {analysis.studyTopics.map((topic, i) => (
                  <li key={i}>{topic}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Learning Path</h3>
              <p>{analysis.learningPath}</p>
            </div>
            <div>
              <h3 className="font-semibold">Detailed Analysis</h3>
              <p>{analysis.detailedAnalysis}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => {
              setAnalysis(null);
              handleRegenerate();
            }}>
              Take Another Assessment
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Programming Assessment</h2>
            <Button variant="outline" onClick={handleRegenerate}>
              Generate New Questions
            </Button>
          </div>
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Question {currentStep + 1} of {questions.length}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={answers[currentQuestion.id] === option ? "default" : "outline"}
                  className="w-full justify-start text-left"
                  onClick={() => handleAnswer(currentQuestion.id, option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
          >
            Previous
          </Button>
          {currentStep === questions.length - 1 ? (
            <Button 
              onClick={handleSubmit}
              disabled={analyzing}
              className="bg-green-500 hover:bg-green-600"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Submit for Analysis'
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={currentStep === questions.length - 1}
            >
              Next
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default DynamicAssessment;