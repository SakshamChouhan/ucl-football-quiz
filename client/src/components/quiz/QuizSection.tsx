import { useEffect, useState, useRef } from "react";
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
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    // Reset state when question changes
    setTimeLeft(20);
    setIsAnswerSelected(false);
    setSelectedAnswerIndex(null);
    setFadeIn(true);

    // Clear existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Start new timer
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Time's up - clear interval and notify parent
          clearInterval(timerIntervalRef.current!);
          if (!isAnswerSelected) {
            setIsAnswerSelected(true);
            onTimeUp();
          }
          return 0;
        }
        
        // Play tick sound when time is running low (fixed)
        if (prevTime <= 5) {
          try {
            playTickSound();
          } catch (e) {
            console.log("Error playing sound (handled)", e);
          }
        }
        
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [currentQuestionIndex, questions, onTimeUp, isAnswerSelected]);

  const handleAnswerClick = (index: number) => {
    if (isAnswerSelected) return;

    // Clear timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    const isCorrect = index === currentQuestion.correctAnswer;
    
    // Play sound based on answer
    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
    
    setIsAnswerSelected(true);
    setSelectedAnswerIndex(index);
    onAnswerSelected(isCorrect);
  };

  const handleNextQuestion = () => {
    setFadeIn(false);
    setTimeout(() => {
      onNextQuestion();
    }, 300);
  };

  // Calculate options with letters
  const optionLetters = ["A", "B", "C", "D"];

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
            onClick={() => {
              // Mark as answered but don't give points
              if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
              }
              setIsAnswerSelected(true);
              setSelectedAnswerIndex(null);
              playIncorrectSound();
            }}
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
