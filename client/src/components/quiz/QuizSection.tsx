import React, { useEffect, useState, useRef } from "react";
import { QuizQuestion } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { getFeedbackText } from "@/lib/questions";
import { ArrowRight, Trophy } from "lucide-react";
import { playCorrectSound, playIncorrectSound, playTickSound } from "@/lib/sounds";

interface QuizSectionProps {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  onAnswerSelected: (isCorrect: boolean) => void;
  onTimeUp: () => void;
  onNextQuestion: () => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  currentQuestionIndex,
  score,
  onAnswerSelected,
  onTimeUp,
  onNextQuestion,
}) => {
  // Simple state for UI
  const [timeLeft, setTimeLeft] = useState(20);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(true);
  const [fadeIn, setFadeIn] = useState(true);
  
  // Refs to prevent multiple triggers
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const actionTakenRef = useRef(false);
  
  // Current question data
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  
  // Letter options for multiple choice
  const optionLetters = ["A", "B", "C", "D"];

  // Function to safely clear the timer
  const clearQuizTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerActive(false);
  };

  // Function to safely play sounds with error handling
  const playSoundSafely = (soundFunction: () => void) => {
    try {
      soundFunction();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // Handle when player selects an answer
  const selectAnswer = (index: number) => {
    // Prevent action if already answered or action taken
    if (answered || actionTakenRef.current) return;
    
    // Mark that an action has been taken
    actionTakenRef.current = true;
    
    // Stop the timer
    clearQuizTimer();
    
    // Determine if answer is correct
    const isCorrect = index === currentQuestion.correctAnswer;
    
    // Play sound based on correctness
    playSoundSafely(isCorrect ? playCorrectSound : playIncorrectSound);
    
    // Update UI
    setAnswered(true);
    setSelectedOption(index);
    
    // Notify parent component about answer
    onAnswerSelected(isCorrect);
  };

  // Handle skipping a question
  const skipQuestion = () => {
    // Prevent action if already answered or action taken
    if (answered || actionTakenRef.current) return;
    
    // Mark that action has been taken
    actionTakenRef.current = true;
    
    // Stop the timer
    clearQuizTimer();
    
    // Play incorrect sound
    playSoundSafely(playIncorrectSound);
    
    // Update UI
    setAnswered(true);
    setSelectedOption(null);
    
    // Notify parent component
    onTimeUp();
  };

  // Handle moving to next question
  const goToNextQuestion = () => {
    // Reset fade animation
    setFadeIn(false);
    
    // Delay to allow fade-out animation
    setTimeout(() => {
      onNextQuestion();
    }, 300);
  };

  // Setup timer and reset state when question changes
  useEffect(() => {
    // Reset all state for new question
    setTimeLeft(20);
    setAnswered(false);
    setSelectedOption(null);
    setTimerActive(true);
    setFadeIn(true);
    actionTakenRef.current = false;
    
    // Clear any existing timer
    clearQuizTimer();
    
    // Create new timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        // When timer reaches 0
        if (prev <= 1) {
          // Clear the timer
          clearInterval(timer);
          
          // If no action taken yet, handle time up
          if (!actionTakenRef.current) {
            actionTakenRef.current = true;
            setAnswered(true);
            onTimeUp();
          }
          return 0;
        }
        
        // Play tick sound in final 5 seconds
        if (prev <= 5) {
          playSoundSafely(playTickSound);
        }
        
        // Count down
        return prev - 1;
      });
    }, 1000);
    
    // Save timer reference
    timerRef.current = timer;
    
    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentQuestionIndex, onTimeUp]); // Only run when question changes

  return (
    <div 
      className={`transition-opacity duration-300 ${fadeIn ? "opacity-100" : "opacity-0"}`}
      data-testid="quiz-section"
    >
      <div className="bg-white rounded-xl shadow-xl p-6 mb-4">
        {/* Header: Question number and score */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-[#0e1e5b] text-white py-2 px-4 rounded-lg">
            <span className="font-bold">Question:</span>{" "}
            <span data-testid="question-number">{currentQuestionIndex + 1}</span>/{totalQuestions}
          </div>
          <div className="bg-[#b3b3b3] py-2 px-4 rounded-lg text-[#0e1e5b]">
            <span className="font-bold">Score:</span>{" "}
            <span data-testid="current-score">{score}</span>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Time remaining:</span>
            <span 
              className="text-sm font-bold text-gray-600" 
              data-testid="timer-seconds"
            >
              {timeLeft}s
            </span>
          </div>
          <Progress 
            value={(timeLeft / 20) * 100} 
            className={`h-2 ${timeLeft <= 5 ? "bg-red-500" : ""}`} 
          />
        </div>

        {/* Question and answer options */}
        <div className="mb-6">
          <h2
            className="text-xl md:text-2xl font-semibold text-[#0e1e5b] mb-4"
            data-testid="question-text"
          >
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                className={`bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg text-left transition-all duration-200 hover:shadow-md ${
                  answered && index === currentQuestion.correctAnswer
                    ? "bg-[#4caf50] text-white hover:bg-[#4caf50]"
                    : ""
                } ${
                  answered && index === selectedOption && index !== currentQuestion.correctAnswer
                    ? "bg-[#f44336] text-white hover:bg-[#f44336]"
                    : ""
                }`}
                disabled={answered}
                data-testid={`answer-option-${index}`}
              >
                <span className="inline-block w-8 h-8 bg-[#0e1e5b] text-white rounded-full text-center leading-8 mr-2">
                  {optionLetters[index]}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback message */}
      {answered && (
        <div
          className={`text-center py-3 px-6 rounded-lg mb-4 font-bold text-white ${
            selectedOption === currentQuestion.correctAnswer
              ? "bg-[#4caf50]"
              : "bg-[#f44336]"
          }`}
          data-testid="answer-feedback"
        >
          {selectedOption === currentQuestion.correctAnswer
            ? `Correct! ${getFeedbackText(currentQuestion)}`
            : `Incorrect! ${getFeedbackText(currentQuestion)}`}
        </div>
      )}

      {/* Skip/Next buttons */}
      <div className="flex justify-end">
        {answered ? (
          <button
            onClick={goToNextQuestion}
            className="bg-[#0e1e5b] hover:bg-blue-800 text-white py-2 px-6 rounded-lg transition-all duration-300 flex items-center"
            data-testid="next-question-btn"
          >
            {isLastQuestion ? (
              <>See Results <Trophy className="w-5 h-5 ml-2" /></>
            ) : (
              <>Next Question <ArrowRight className="w-5 h-5 ml-2" /></>
            )}
          </button>
        ) : (
          <button
            onClick={skipQuestion}
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-6 rounded-lg transition-all duration-300"
            data-testid="skip-question-btn"
          >
            Skip Question
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizSection;
