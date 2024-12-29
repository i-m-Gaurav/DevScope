// // 'use client'
// // import React, { useState } from 'react';
// // import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
// // import { Button } from '@/components/ui/button';
// // import { Progress } from '@/components/ui/progress';

// // const WebD = () => {
// //   const [currentStep, setCurrentStep] = useState(0);
// //   const [answers, setAnswers] = useState<{ [key: string]: string }>({});

// //   // Example questions grouped by categories
// //   const questions = {
// //     basicConcepts: [
// //       {
// //         id: 'q1',
// //         question: 'How comfortable are you with variables and data types?',
// //         options: ['Not at all', 'Basic understanding', 'Comfortable', 'Very comfortable'],
// //         category: 'Fundamentals'
// //       },
// //       {
// //         id: 'q2',
// //         question: 'How well do you understand loops and control structures?',
// //         options: ['Not at all', 'Basic understanding', 'Comfortable', 'Very comfortable'],
// //         category: 'Fundamentals'
// //       }
// //     ],
// //     problemSolving: [
// //       {
// //         id: 'q3',
// //         question: 'Can you break down complex problems into smaller steps?',
// //         options: ['Not at all', 'Sometimes', 'Usually', 'Always'],
// //         category: 'Problem Solving'
// //       }
// //     ]
// //   };

// //   const flatQuestions = Object.values(questions).flat();

// //   const handleAnswer = (questionId: string, answer: string) => {
// //     setAnswers(prev => ({
// //       ...prev,
// //       [questionId]: answer
// //     }));
// //   };

// //   const handleNext = () => {
// //     if (currentStep < flatQuestions.length - 1) {
// //       setCurrentStep(prev => prev + 1);
// //     }
// //   };

// //   const handlePrevious = () => {
// //     if (currentStep > 0) {
// //       setCurrentStep(prev => prev - 1);
// //     }
// //   };

// //   const currentQuestion = flatQuestions[currentStep];
// //   const progress = (currentStep / flatQuestions.length) * 100;

// //   return (
// //     <div className="max-w-2xl mx-auto p-4">
// //       <Card>
// //         <CardHeader>
// //           <h2 className="text-2xl font-bold">Programming Skills Assessment</h2>
// //           <Progress value={progress} className="w-full" />
// //           <p className="text-sm text-gray-500">
// //             Question {currentStep + 1} of {flatQuestions.length}
// //           </p>
// //         </CardHeader>
// //         <CardContent>
// //           <div className="space-y-4">
// //             <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
// //             <div className="space-y-2">
// //               {currentQuestion.options.map((option, index) => (
// //                 <Button
// //                   key={index}
// //                   variant={answers[currentQuestion.id] === option ? "default" : "outline"}
// //                   className="w-full justify-start text-left"
// //                   onClick={() => handleAnswer(currentQuestion.id, option)}
// //                 >
// //                   {option}
// //                 </Button>
// //               ))}
// //             </div>
// //           </div>
// //         </CardContent>
// //         <CardFooter className="flex justify-between">
// //           <Button 
// //             onClick={handlePrevious}
// //             disabled={currentStep === 0}
// //             variant="outline"
// //           >
// //             Previous
// //           </Button>
// //           <Button 
// //             onClick={handleNext}
// //             disabled={currentStep === flatQuestions.length - 1}
// //           >
// //             Next
// //           </Button>
// //         </CardFooter>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default WebD;


// import React, { useState, useEffect } from 'react';
// import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
// import { Loader2 } from 'lucide-react';

// // Expanded fallback questions
// const fallbackQuestions = [
//   {
//     id: 1,
//     question: "What is the primary purpose of version control systems like Git?",
//     options: [
//       "To make backup copies of code",
//       "To track changes and collaborate with others",
//       "To compress code files",
//       "To debug code automatically"
//     ],
//     difficulty: "beginner",
//     category: "fundamentals"
//   },
//   {
//     id: 2,
//     question: "Which data structure would be most efficient for implementing a LIFO (Last In, First Out) pattern?",
//     options: [
//       "Queue",
//       "Stack",
//       "Linked List",
//       "Binary Tree"
//     ],
//     difficulty: "intermediate",
//     category: "data-structures"
//   },
//   {
//     id: 3,
//     question: "What does the 'async' keyword do in JavaScript?",
//     options: [
//       "Makes the function run faster",
//       "Indicates the function returns a Promise",
//       "Stops the function from executing",
//       "Creates a new thread"
//     ],
//     difficulty: "intermediate",
//     category: "javascript"
//   },
//   {
//     id: 4,
//     question: "What is the time complexity of binary search?",
//     options: [
//       "O(n)",
//       "O(log n)",
//       "O(n²)",
//       "O(1)"
//     ],
//     difficulty: "advanced",
//     category: "algorithms"
//   },
//   {
//     id: 5,
//     question: "Which HTML5 tag is used to display a video?",
//     options: [
//       "<media>",
//       "<video>",
//       "<player>",
//       "<film>"
//     ],
//     difficulty: "beginner",
//     category: "web-development"
//   },
//   {
//     id: 6,
//     question: "What is the purpose of CSS Box Model?",
//     options: [
//       "To create 3D boxes in CSS",
//       "To define spacing and borders around elements",
//       "To create popup boxes",
//       "To store CSS variables"
//     ],
//     difficulty: "beginner",
//     category: "web-development"
//   },
//   {
//     id: 7,
//     question: "What is the difference between '==' and '===' in JavaScript?",
//     options: [
//       "No difference, they are the same",
//       "'===' checks both value and type, '==' only checks value",
//       "'==' is deprecated",
//       "'===' is only for numbers"
//     ],
//     difficulty: "intermediate",
//     category: "javascript"
//   },
//   {
//     id: 8,
//     question: "Which SQL command is used to modify existing data in a table?",
//     options: [
//       "MODIFY",
//       "UPDATE",
//       "CHANGE",
//       "ALTER"
//     ],
//     difficulty: "beginner",
//     category: "databases"
//   },
//   {
//     id: 9,
//     question: "What is a REST API?",
//     options: [
//       "A programming language",
//       "An architectural style for APIs",
//       "A database system",
//       "A frontend framework"
//     ],
//     difficulty: "intermediate",
//     category: "web-development"
//   },
//   {
//     id: 10,
//     question: "What is the purpose of dependency injection?",
//     options: [
//       "To inject code into a website",
//       "To reduce coupling between classes",
//       "To speed up code execution",
//       "To compress code files"
//     ],
//     difficulty: "advanced",
//     category: "software-design"
//   }
// ];

// async function generateQuestions() {
//   const HF_TOKEN = process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN;
  
//   const prompt = `Generate 10 unique programming assessment questions. For each question, include:
//   1. A clear question about programming concepts, tools, or best practices
//   2. Four distinct multiple choice options with one correct answer
//   3. The difficulty level (beginner/intermediate/advanced)
//   4. The category (fundamentals/web-development/databases/algorithms/etc.)
  
//   Ensure questions cover different aspects of programming and vary in difficulty.
//   Format as a JSON array with fields: id, question, options (array), difficulty, and category.`;

//   try {
//     const response = await fetch(
//       "https://api-inference.huggingface.co/models/microsoft/phi-2",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${HF_TOKEN}`,
//         },
//         body: JSON.stringify({ inputs: prompt }),
//       }
//     );

//     const data = await response.json();
//     // Parse the generated text as JSON
//     const questions = JSON.parse(data[0].generated_text);
//     return questions.map((q, index) => ({
//       ...q,
//       id: index + 1 // Ensure each question has a unique ID
//     }));
//   } catch (error) {
//     console.error("Error generating questions:", error);
//     return fallbackQuestions;
//   }
// }

// // Rest of the component code remains the same
// const DynamicAssessment = () => {
//   const [questions, setQuestions] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadQuestions();
//   }, []);

//   const loadQuestions = async () => {
//     setLoading(true);
//     try {
//       const generatedQuestions = await generateQuestions();
//       setQuestions(generatedQuestions);
//     } catch (error) {
//       console.error("Error loading questions:", error);
//       setQuestions(fallbackQuestions);
//     }
//     setLoading(false);
//   };

//   const handleAnswer = (questionId, answer) => {
//     setAnswers(prev => ({
//       ...prev,
//       [questionId]: answer
//     }));
//   };

//   const handleNext = () => {
//     if (currentStep < questions.length - 1) {
//       setCurrentStep(prev => prev + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 0) {
//       setCurrentStep(prev => prev - 1);
//     }
//   };

//   const handleRegenerate = () => {
//     setAnswers({});
//     setCurrentStep(0);
//     loadQuestions();
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="w-8 h-8 animate-spin" />
//         <span className="ml-2">Generating questions...</span>
//       </div>
//     );
//   }

//   const currentQuestion = questions[currentStep];
//   const progress = (currentStep / questions.length) * 100;

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <h2 className="text-2xl font-bold">Programming Assessment</h2>
//             <Button variant="outline" onClick={handleRegenerate}>
//               Generate New Questions
//             </Button>
//           </div>
//           <Progress value={progress} className="w-full" />
//           <div className="flex justify-between items-center">
//             <p className="text-sm text-gray-500">
//               Question {currentStep + 1} of {questions.length}
//             </p>
//             <p className="text-sm text-gray-500">
//               Difficulty: {currentQuestion.difficulty}
//             </p>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
//             <div className="space-y-2">
//               {currentQuestion.options.map((option, index) => (
//                 <Button
//                   key={index}
//                   variant={answers[currentQuestion.id] === option ? "default" : "outline"}
//                   className="w-full justify-start text-left"
//                   onClick={() => handleAnswer(currentQuestion.id, option)}
//                 >
//                   {option}
//                 </Button>
//               ))}
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <Button 
//             onClick={handlePrevious}
//             disabled={currentStep === 0}
//             variant="outline"
//           >
//             Previous
//           </Button>
//           <Button 
//             onClick={handleNext}
//             disabled={currentStep === questions.length - 1}
//           >
//             Next
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// };

// export default DynamicAssessment;


import React from 'react'
import DynamicAssessment from './DynamicAssessment'

const WebD = () => {
  return (
    <div>
      <DynamicAssessment  />
    </div>
  )
}

export default WebD;

