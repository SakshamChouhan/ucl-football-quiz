import { useState, useEffect } from "react";
import { LeaderboardEntry } from "@shared/schema";
import { ArrowLeft } from "lucide-react";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  onBackToStart: () => void;
}

export const Leaderboard = ({ entries, isLoading, onBackToStart }: LeaderboardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleBackToStart = () => {
    setIsVisible(false);
    setTimeout(() => {
      onBackToStart();
    }, 300);
  };

  // Format time (in seconds) to minutes:seconds
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Format date to YYYY-MM-DD
  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div
      id="leaderboard"
      className={`bg-white rounded-xl shadow-xl p-8 text-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <h1 className="text-3xl font-montserrat font-bold text-[#0e1e5b] mb-6">
        Champions League Quiz Leaderboard
      </h1>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="py-10 text-center text-gray-600">Loading leaderboard...</div>
        ) : entries.length === 0 ? (
          <div className="py-10 text-center text-gray-600">
            No entries yet. Be the first to make the leaderboard!
          </div>
        ) : (
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-[#0e1e5b] text-white">
              <tr>
                <th className="py-3 px-4 text-left font-montserrat">Rank</th>
                <th className="py-3 px-4 text-left font-montserrat">Player</th>
                <th className="py-3 px-4 text-left font-montserrat">Score</th>
                <th className="py-3 px-4 text-left font-montserrat">Time</th>
                <th className="py-3 px-4 text-left font-montserrat">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entries.map((entry, index) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-montserrat font-bold">
                    <div className="flex items-center">
                      {index < 3 ? (
                        <span
                          className={`text-white w-6 h-6 rounded-full text-center leading-6 mr-2 ${
                            index === 0
                              ? "bg-[#cfa00d]"
                              : index === 1
                              ? "bg-[#b3b3b3]"
                              : "bg-orange-600"
                          }`}
                        >
                          {index + 1}
                        </span>
                      ) : (
                        index + 1
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-roboto">{entry.playerName}</td>
                  <td className="py-3 px-4 font-roboto font-bold">
                    {entry.score}/{entry.totalQuestions}
                  </td>
                  <td className="py-3 px-4 font-roboto">
                    {formatTime(entry.timeInSeconds)}
                  </td>
                  <td className="py-3 px-4 font-roboto text-gray-600">
                    {formatDate(entry.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-8">
        <button
          id="back-to-start-btn"
          onClick={handleBackToStart}
          className="bg-[#0e1e5b] hover:bg-blue-800 text-white font-montserrat font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center mx-auto"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Quiz
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
