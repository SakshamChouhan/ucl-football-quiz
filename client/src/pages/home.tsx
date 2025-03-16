import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { QuizQuestion, LeaderboardEntry } from "@shared/schema";
import { sortQuestionsByDifficulty, backupQuestions } from "@/lib/questions";
import { useToast } from "@/hooks/use-toast";

import UCLLogo from "@/components/quiz/UCLLogo";
import StartScreen from "@/components/quiz/StartScreen";
import QuizSection from "@/components/quiz/QuizSection";
import ResultsScreen from "@/components/quiz/ResultsScreen";
import Leaderboard from "@/components/quiz/Leaderboard";
import NameEntryModal from "@/components/quiz/NameEntryModal";

enum ScreenState {
  START,
  QUIZ,
  RESULTS,
  LEADERBOARD
}

const Home = () => {
  // State
  const [screenState, setScreenState] = useState<ScreenState>(ScreenState.START);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showNameModal, setShowNameModal] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const [totalQuizTime, setTotalQuizTime] = useState(0);
  const { toast } = useToast();

  // Fetch questions
  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery<QuizQuestion[]>({
    queryKey: ["/api/questions"],
    onError: (error) => {
      console.error("Failed to fetch questions:", error);
      toast({
        title: "Failed to fetch questions",
        description: "Using backup questions instead",
        variant: "destructive",
      });
    },
  });

  // Sort questions by difficulty
  const sortedQuestions = sortQuestionsByDifficulty(
    questions.length > 0 ? questions : backupQuestions
  );

  // Fetch leaderboard
  const { 
    data: leaderboard = [], 
    isLoading: isLoadingLeaderboard,
    refetch: refetchLeaderboard
  } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
    onError: (error) => {
      console.error("Failed to fetch leaderboard:", error);
      toast({
        title: "Failed to fetch leaderboard",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  // Submit score mutation
  const submitScoreMutation = useMutation({
    mutationFn: async (data: { playerName: string, score: number, totalQuestions: number, timeInSeconds: number }) => {
      return await apiRequest("POST", "/api/leaderboard", data);
    },
    onSuccess: () => {
      toast({
        title: "Score submitted!",
        description: "Your score has been added to the leaderboard",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      setShowNameModal(false);
      setScreenState(ScreenState.LEADERBOARD);
    },
    onError: (error) => {
      console.error("Failed to submit score:", error);
      toast({
        title: "Failed to submit score",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  // Update total time when quiz is running
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (screenState === ScreenState.QUIZ && quizStartTime) {
      intervalId = setInterval(() => {
        setTotalQuizTime(Math.floor((Date.now() - quizStartTime) / 1000));
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [screenState, quizStartTime]);

  // Handle starting the quiz
  const handleStartQuiz = () => {
    setScreenState(ScreenState.QUIZ);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizStartTime(Date.now());
    setTotalQuizTime(0);
  };

  // Handle showing the leaderboard
  const handleShowLeaderboard = async () => {
    setScreenState(ScreenState.LEADERBOARD);
    refetchLeaderboard();
  };

  // Handle quiz answer selection
  const handleAnswerSelected = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  // Handle time up for a question
  const handleTimeUp = () => {
    // No score change needed for time up
  };

  // Handle moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < sortedQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setScreenState(ScreenState.RESULTS);
    }
  };

  // Handle saving the score (show name entry modal)
  const handleSaveScore = () => {
    setShowNameModal(true);
  };

  // Handle submitting the name and score
  const handleSubmitName = (playerName: string) => {
    submitScoreMutation.mutate({
      playerName,
      score,
      totalQuestions: sortedQuestions.length,
      timeInSeconds: totalQuizTime
    });
  };

  // Handle restarting the quiz
  const handleRestartQuiz = () => {
    handleStartQuiz();
  };

  // Handle going back to the start screen
  const handleBackToStart = () => {
    setScreenState(ScreenState.START);
  };

  // Render the appropriate screen based on state
  return (
    <div className="stars-background min-h-screen">
      <style jsx>{`
        .stars-background {
          background-color: #0e1e5b;
          background-image: radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 10px),
            radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 5px),
            radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 15px),
            radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 5px);
          background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px;
          background-position: 0 0, 40px 60px, 130px 270px, 70px 100px;
        }
      `}</style>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <UCLLogo />

        {screenState === ScreenState.START && (
          <StartScreen
            onStartQuiz={handleStartQuiz}
            onShowLeaderboard={handleShowLeaderboard}
          />
        )}

        {screenState === ScreenState.QUIZ && sortedQuestions.length > 0 && (
          <QuizSection
            questions={sortedQuestions}
            currentQuestionIndex={currentQuestionIndex}
            score={score}
            onAnswerSelected={handleAnswerSelected}
            onTimeUp={handleTimeUp}
            onNextQuestion={handleNextQuestion}
          />
        )}

        {screenState === ScreenState.RESULTS && (
          <ResultsScreen
            score={score}
            totalQuestions={sortedQuestions.length}
            totalTime={totalQuizTime}
            onSaveScore={handleSaveScore}
            onRestartQuiz={handleRestartQuiz}
          />
        )}

        {screenState === ScreenState.LEADERBOARD && (
          <Leaderboard
            entries={leaderboard}
            isLoading={isLoadingLeaderboard}
            onBackToStart={handleBackToStart}
          />
        )}

        <NameEntryModal
          isOpen={showNameModal}
          onClose={() => setShowNameModal(false)}
          onSubmit={handleSubmitName}
          score={score}
          totalQuestions={sortedQuestions.length}
        />
      </div>
    </div>
  );
};

export default Home;
