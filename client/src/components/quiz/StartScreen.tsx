import { CheckCircle, Clock, Star, Trophy, ListOrdered, Play } from "lucide-react";
import { useState } from "react";

interface StartScreenProps {
  onStartQuiz: () => void;
  onShowLeaderboard: () => void;
}

export const StartScreen = ({ onStartQuiz, onShowLeaderboard }: StartScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleStartQuiz = () => {
    setIsVisible(false);
    setTimeout(() => {
      onStartQuiz();
    }, 300);
  };

  const handleShowLeaderboard = () => {
    setIsVisible(false);
    setTimeout(() => {
      onShowLeaderboard();
    }, 300);
  };

  return (
    <div
      id="start-screen"
      className={`bg-white rounded-xl shadow-xl p-8 text-center mb-8 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-[#0e1e5b] mb-6">
        Champions League Quiz
      </h1>
      <p className="text-gray-700 font-roboto mb-8">
        Test your knowledge of the UEFA Champions League history, teams, and legendary players!
      </p>

      <div className="bg-gray-100 rounded-lg p-4 mb-8">
        <h2 className="text-xl font-montserrat font-semibold text-[#0e1e5b] mb-3">
          How to Play:
        </h2>
        <ul className="text-left text-gray-700 font-roboto space-y-2">
          <li className="flex items-center">
            <CheckCircle className="text-[#0e1e5b] w-5 h-5 mr-2" />
            <span>Answer 20 questions about the Champions League</span>
          </li>
          <li className="flex items-center">
            <Clock className="text-[#0e1e5b] w-5 h-5 mr-2" />
            <span>You have 20 seconds to answer each question</span>
          </li>
          <li className="flex items-center">
            <Star className="text-[#cfa00d] w-5 h-5 mr-2" />
            <span>Questions get progressively harder</span>
          </li>
          <li className="flex items-center">
            <Trophy className="text-[#cfa00d] w-5 h-5 mr-2" />
            <span>See if you can make it to the leaderboard!</span>
          </li>
        </ul>
      </div>

      <button
        id="start-quiz-btn"
        onClick={handleStartQuiz}
        className="bg-[#0e1e5b] hover:bg-blue-800 text-white font-montserrat font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center mx-auto"
      >
        <Play className="w-5 h-5 mr-2" /> Start Quiz
      </button>

      <div className="mt-6">
        <button
          id="show-leaderboard-btn"
          onClick={handleShowLeaderboard}
          className="text-[#0e1e5b] hover:text-blue-800 font-roboto font-medium underline flex items-center justify-center mx-auto"
        >
          <ListOrdered className="w-4 h-4 mr-1" /> View Leaderboard
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
