'use client'
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const Questions = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  // Example questions grouped by categories
  const questions = {
    basicConcepts: [
      {
        id: 'q1',
        question: 'How comfortable are you with variables and data types?',
        options: ['Not at all', 'Basic understanding', 'Comfortable', 'Very comfortable'],
        category: 'Fundamentals'
      },
      {
        id: 'q2',
        question: 'How well do you understand loops and control structures?',
        options: ['Not at all', 'Basic understanding', 'Comfortable', 'Very comfortable'],
        category: 'Fundamentals'
      }
    ],
    problemSolving: [
      {
        id: 'q3',
        question: 'Can you break down complex problems into smaller steps?',
        options: ['Not at all', 'Sometimes', 'Usually', 'Always'],
        category: 'Problem Solving'
      }
    ]
  };

  const flatQuestions = Object.values(questions).flat();

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentStep < flatQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentQuestion = flatQuestions[currentStep];
  const progress = (currentStep / flatQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Programming Skills Assessment</h2>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500">
            Question {currentStep + 1} of {flatQuestions.length}
          </p>
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
          <Button 
            onClick={handleNext}
            disabled={currentStep === flatQuestions.length - 1}
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Questions;