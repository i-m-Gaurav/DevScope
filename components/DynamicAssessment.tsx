import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { UserInfo } from './UserAssessmentForm';

interface Question {
  id: number;
  question: string;
  options: string[];
  difficulty: string;
  category: string;
  type: string;
  subcategory: string;
  skills_assessed: string[];
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
    category: "version-control",
    type: "multiple-choice",
    subcategory: "git",
    skills_assessed: ["version control", "collaboration"]
  }
  // Add more fallback questions as needed
];

async function generateQuestion(userInfo: UserInfo, questionCount: number, previousQuestions: Question[] = []): Promise<{ question: Question; isComplete: boolean }> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userInfo,
        questionCount,
        previousQuestions 
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate question');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating question:', error);
    throw error;
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
  const [loadingNextQuestion, setLoadingNextQuestion] = useState(false);

  const TOTAL_QUESTIONS = 50;

  const loadFirstQuestion = useCallback(async () => {
    setLoading(true);
    try {
      const { question } = await generateQuestion(userInfo, TOTAL_QUESTIONS, []);
      setQuestions([question]);
    } catch (error) {
      console.error("Error loading first question:", error);
      setQuestions(fallbackQuestions);
    }
    setLoading(false);
  }, [userInfo]);

  useEffect(() => {
    loadFirstQuestion();
  }, [loadFirstQuestion]);

  const loadNextQuestion = async () => {
    if (questions.length >= TOTAL_QUESTIONS) return;
    
    setLoadingNextQuestion(true);
    try {
      const { question } = await generateQuestion(
        userInfo,
        TOTAL_QUESTIONS,
        questions
      );
      setQuestions(prev => [...prev, question]);
    } catch (error) {
      console.error("Error loading next question:", error);
    }
    setLoadingNextQuestion(false);
  };

  const handleAnswer = (questionId: number, answer: string): void => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = async (): Promise<void> => {
    if (currentStep === questions.length - 1 && questions.length < TOTAL_QUESTIONS) {
      await loadNextQuestion();
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRegenerate = (): void => {
    setAnswers({});
    setQuestions([]);
    setCurrentStep(0);
    loadFirstQuestion();
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
  const progress = (currentStep / TOTAL_QUESTIONS) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading first question...</span>
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
              Question {currentStep + 1} of {TOTAL_QUESTIONS}
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
          {currentStep === TOTAL_QUESTIONS - 1 ? (
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
              disabled={loadingNextQuestion}
            >
              {loadingNextQuestion ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading next...
                </>
              ) : (
                'Next'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default DynamicAssessment;