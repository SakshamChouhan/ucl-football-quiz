import { useEffect, useState } from "react";
import { getScoreMessage, getStarCount } from "@/lib/questions";
import { Save, Redo, Share, Star, StarHalf, Trophy } from "lucide-react";
import { playSuccessSound } from "@/lib/sounds";

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  totalTime: number;
  onSaveScore: () => void;
  onRestartQuiz: () => void;
}

export const ResultsScreen = ({
  score,
  totalQuestions,
  totalTime,
  onSaveScore,
  onRestartQuiz,
}: ResultsScreenProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const percentage = (score / totalQuestions) * 100;
  const message = getScoreMessage(score, totalQuestions);
  const stars = getStarCount(score, totalQuestions);
  
  useEffect(() => {
    // Animation delay for entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
      playSuccessSound();
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Format total time (in seconds) to minutes:seconds
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleShareResults = () => {
    // Basic share functionality
    if (navigator.share) {
      navigator.share({
        title: 'UEFA Champions League Quiz Results',
        text: `I scored ${score}/${totalQuestions} in the Champions League Quiz! Can you beat my score?`,
        url: window.location.href,
      }).catch(err => {
        console.log('Error sharing:', err);
      });
    } else {
      // Fallback - copy to clipboard
      const text = `I scored ${score}/${totalQuestions} in the Champions League Quiz! Can you beat my score?`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Result copied to clipboard!');
      });
    }
  };

  return (
    <div
      id="results-screen"
      className={`bg-white rounded-xl shadow-xl p-8 text-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mb-6">
        <Trophy className="w-16 h-16 mx-auto text-[#cfa00d] mb-4" />
        <h1 className="text-3xl font-montserrat font-bold text-[#0e1e5b] mb-2">
          Quiz Complete!
        </h1>
        <p className="text-gray-700 font-roboto">
          You've finished the UEFA Champions League quiz
        </p>
      </div>

      <div className="bg-gray-100 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-montserrat font-bold text-[#0e1e5b] mb-1">
          Your Score:
        </h2>
        <div className="text-5xl font-montserrat font-bold text-[#0e1e5b] mb-4">
          <span id="final-score">{score}</span>/{totalQuestions}
        </div>

        <div className="mb-2">
          <div className="w-full bg-gray-300 rounded-full h-4">
            <div
              id="score-percentage"
              className="bg-[#0e1e5b] rounded-full h-4 transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Time taken: {formatTime(totalTime)}
        </p>

        <p id="score-message" className="text-lg font-roboto text-gray-700 mb-2">
          {message}
        </p>

        <div className="flex justify-center mt-4">
          {/* Star rating based on score */}
          <div className="flex space-x-1">
            {[...Array(Math.floor(stars))].map((_, i) => (
              <Star key={i} className="w-8 h-8 text-[#cfa00d] fill-[#cfa00d]" />
            ))}
            {stars % 1 === 0.5 && <StarHalf className="w-8 h-8 text-[#cfa00d] fill-[#cfa00d]" />}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          id="submit-score-btn"
          onClick={onSaveScore}
          className="w-full bg-[#0e1e5b] hover:bg-blue-800 text-white font-montserrat font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
        >
          <Save className="w-5 h-5 mr-2" /> Save to Leaderboard
        </button>

        <button
          id="restart-quiz-btn"
          onClick={onRestartQuiz}
          className="w-full bg-[#cfa00d] hover:bg-yellow-600 text-white font-montserrat font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
        >
          <Redo className="w-5 h-5 mr-2" /> Play Again
        </button>

        <button
          id="share-results-btn"
          onClick={handleShareResults}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-montserrat font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
        >
          <Share className="w-5 h-5 mr-2" /> Share Results
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
