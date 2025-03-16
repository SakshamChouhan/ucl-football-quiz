import { useEffect, useState, useRef, useCallback } from "react";
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

export const QuizSection = ({
  questions,
  currentQuestionIndex,
  score,
  onAnswerSelected,
  onTimeUp,
  onNextQuestion,
}: QuizSectionProps) => {
  const [timeLeft, setTimeLeft] = useState(20);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [fadeIn, setFadeIn] = useState(true);

  // Create stateful timer ref - used to track active timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track if answer has been processed to prevent multiple score counts
  const answerProcessedRef = useRef(false);

  // Current question info
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  
  // Option letters
  const optionLetters = ["A", "B", "C", "D"];

  // Stop timer function - extracted to reuse
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Handle selecting an answer
  const handleAnswerClick = useCallback((index: number) => {
    // Prevent action if answer already selected
    if (isAnswerSelected || answerProcessedRef.current) return;

    // Mark as processed to prevent multiple calls
    answerProcessedRef.current = true;
    
    // Stop the timer
    stopTimer();

    // Check if answer is correct
    const isCorrect = index === currentQuestion.correctAnswer;
    
    // Play appropriate sound
    try {
      if (isCorrect) {
        playCorrectSound();
      } else {
        playIncorrectSound();
      }
    } catch (e) {
      console.error("Sound playback error:", e);
    }
    
    // Update UI state
    setIsAnswerSelected(true);
    setSelectedAnswerIndex(index);
    
    // Notify parent component (only once)
    onAnswerSelected(isCorrect);
  }, [currentQuestion, isAnswerSelected, onAnswerSelected, stopTimer]);

  // Skip question handler
  const handleSkipQuestion = useCallback(() => {
    // Prevent action if answer already selected
    if (isAnswerSelected || answerProcessedRef.current) return;
    
    // Mark as processed
    answerProcessedRef.current = true;
    
    // Stop the timer
    stopTimer();
    
    // Play incorrect sound
    try {
      playIncorrectSound();
    } catch (e) {
      console.error("Sound playback error:", e);
    }
    
    // Update UI state
    setIsAnswerSelected(true);
    setSelectedAnswerIndex(null);
    
    // Notify parent
    onTimeUp();
  }, [isAnswerSelected, onTimeUp, stopTimer]);

  // Next question handler
  const handleNextQuestion = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => {
      onNextQuestion();
    }, 300);
  }, [onNextQuestion]);

  // Initialize and reset for each new question
  useEffect(() => {
    // Reset UI state
    setTimeLeft(20);
    setIsAnswerSelected(false);
    setSelectedAnswerIndex(null);
    setFadeIn(true);
    answerProcessedRef.current = false;
    
    // Stop any existing timer
    stopTimer();
    
    // Start a new timer - countdown from 20 seconds
    const newTimer = setInterval(() => {
      setTimeLeft(prev => {
        // When time runs out
        if (prev <= 1) {
          // Clean up timer
          clearInterval(newTimer);
          
          // If answer not already processed, handle timeout
          if (!answerProcessedRef.current) {
            answerProcessedRef.current = true;
            setIsAnswerSelected(true);
            onTimeUp();
          }
          return 0;
        }
        
        // Play tick sound for last 5 seconds
        if (prev <= 5) {
          try {
            playTickSound();
          } catch (e) {
            // Silently handle sound errors
          }
        }
        
        // Decrement timer
        return prev - 1;
      });
    }, 1000);
    
    // Store timer reference
    timerRef.current = newTimer;
    
    // Cleanup on unmount or before effect runs again
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentQuestionIndex, onTimeUp, stopTimer]);

  return (
    <div
      id="quiz-section"
      className={`transition-opacity duration-300 ${fadeIn ? "opacity-100" : "opacity-0"}`}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 mb-4">
        {/* Quiz Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-[#0e1e5b] text-white py-2 px-4 rounded-lg font-montserrat">
            <span className="font-bold">Question:</span>{" "}
            <span id="question-number">{currentQuestionIndex + 1}</span>/{totalQuestions}
          </div>
          <div className="bg-[#b3b3b3] py-2 px-4 rounded-lg text-[#0e1e5b] font-montserrat">
            <span className="font-bold">Score:</span>{" "}
            <span id="current-score">{score}</span>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-roboto text-gray-600">Time remaining:</span>
            <span id="timer-seconds" className="text-sm font-roboto font-bold text-gray-600">
              {timeLeft}s
            </span>
          </div>
          <Progress 
            value={(timeLeft / 20) * 100} 
            className={`h-2 ${timeLeft <= 5 ? "bg-red-500" : ""}`} 
          />
        </div>

        {/* Question */}
        <div className="mb-6">
          <h2
            id="question-text"
            className="text-xl md:text-2xl font-montserrat font-semibold text-[#0e1e5b] mb-4"
          >
            {currentQuestion.question}
          </h2>

          <div id="answer-options" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                className={`answer-btn bg-gray-100 hover:bg-gray-200 text-gray-800 font-roboto py-3 px-4 rounded-lg text-left transition-all duration-200 hover:shadow-md ${
                  isAnswerSelected && index === currentQuestion.correctAnswer
                    ? "bg-[#4caf50] text-white hover:bg-[#4caf50]"
                    : ""
                } ${
                  isAnswerSelected && index === selectedAnswerIndex && index !== currentQuestion.correctAnswer
                    ? "bg-[#f44336] text-white hover:bg-[#f44336]"
                    : ""
                }`}
                disabled={isAnswerSelected}
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

      {/* Feedback Message */}
      {isAnswerSelected && (
        <div
          id="answer-feedback"
          className={`text-center py-3 px-6 rounded-lg mb-4 font-montserrat font-bold text-white ${
            selectedAnswerIndex === currentQuestion.correctAnswer
              ? "bg-[#4caf50]"
              : "bg-[#f44336]"
          }`}
        >
          {selectedAnswerIndex === currentQuestion.correctAnswer
            ? `Correct! ${getFeedbackText(currentQuestion)}`
            : `Incorrect! ${getFeedbackText(currentQuestion)}`}
        </div>
      )}

      {/* Next Button - Always show after answering */}
      <div className="flex justify-end">
        {isAnswerSelected ? (
          <button
            id="next-question-btn"
            onClick={handleNextQuestion}
            className="bg-[#0e1e5b] hover:bg-blue-800 text-white font-montserrat py-2 px-6 rounded-lg transition-all duration-300 flex items-center"
          >
            {isLastQuestion ? (
              <>See Results <Trophy className="w-5 h-5 ml-2" /></>
            ) : (
              <>Next Question <ArrowRight className="w-5 h-5 ml-2" /></>
            )}
          </button>
        ) : (
          <button
            id="skip-question-btn"
            onClick={handleSkipQuestion}
            className="bg-gray-400 hover:bg-gray-500 text-white font-montserrat py-2 px-6 rounded-lg transition-all duration-300"
          >
            Skip Question
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizSection;
