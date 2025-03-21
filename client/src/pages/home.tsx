import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { QuizQuestion, LeaderboardEntry } from "@shared/schema";
import { sortQuestionsByDifficulty, backupQuestions, getRandomQuestions } from "@/lib/questions";
import { useToast } from "@/hooks/use-toast";
import { Trophy } from "lucide-react";

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
  // Core state
  const [screenState, setScreenState] = useState<ScreenState>(ScreenState.START);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showNameModal, setShowNameModal] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const [totalQuizTime, setTotalQuizTime] = useState(0);
  
  // UI feedback
  const { toast } = useToast();
  
  // Refs to prevent duplicate actions
  const answerProcessedRef = useRef(false);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch questions - each API call gets randomized questions from the server
  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery<QuizQuestion[]>({
    queryKey: ["/api/questions"],
    staleTime: Infinity, // Don't refetch during a game session
  });

  // Use success/error handlers outside options for better type compatibility
  useEffect(() => {
    if (questions && questions.length > 0) {
      console.log(`Received ${questions.length} randomized questions for this game session`);
    }
  }, [questions]);

  // Sort questions by difficulty (with explicit types)
  const sortedQuestions = sortQuestionsByDifficulty(
    questions.length > 0 ? questions as QuizQuestion[] : backupQuestions
  );

  // Fetch leaderboard with proper types
  const { 
    data: leaderboard = [] as LeaderboardEntry[], 
    isLoading: isLoadingLeaderboard,
    refetch: refetchLeaderboard
  } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"]
  });
  
  // Handle leaderboard errors
  useEffect(() => {
    const handleError = () => {
      toast({
        title: "Failed to fetch leaderboard",
        description: "Please try again later",
        variant: "destructive",
      });
    };
    
    if (!leaderboard && !isLoadingLeaderboard) {
      handleError();
    }
  }, [leaderboard, isLoadingLeaderboard, toast]);

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
    onError: () => {
      toast({
        title: "Failed to submit score",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  // Clean up timers
  const cleanupTimers = useCallback(() => {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }
  }, []);

  // Update total time when quiz is running
  useEffect(() => {
    cleanupTimers();
    
    if (screenState === ScreenState.QUIZ && quizStartTime) {
      timeIntervalRef.current = setInterval(() => {
        setTotalQuizTime(Math.floor((Date.now() - quizStartTime) / 1000));
      }, 1000);
    }
    
    return cleanupTimers;
  }, [screenState, quizStartTime, cleanupTimers]);
  
  // Reset answer processed flag when question changes
  useEffect(() => {
    answerProcessedRef.current = false;
  }, [currentQuestionIndex]);

  // Handle starting the quiz
  const handleStartQuiz = useCallback(() => {
    // Get a fresh set of random questions for this quiz session
    if (screenState === ScreenState.START) {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
    }
    
    setScreenState(ScreenState.QUIZ);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizStartTime(Date.now());
    setTotalQuizTime(0);
    answerProcessedRef.current = false;
  }, [screenState]);

  // Handle showing the leaderboard
  const handleShowLeaderboard = useCallback(() => {
    setScreenState(ScreenState.LEADERBOARD);
    refetchLeaderboard();
  }, [refetchLeaderboard]);

  // Handle quiz answer selection
  const handleAnswerSelected = useCallback((isCorrect: boolean) => {
    // Prevent multiple score updates for the same question
    if (answerProcessedRef.current) return;
    
    answerProcessedRef.current = true;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  }, []);

  // Handle time up for a question (no score change)
  const handleTimeUp = useCallback(() => {
    // Prevent multiple actions
    if (answerProcessedRef.current) return;
    
    answerProcessedRef.current = true;
    // No score added for time up
  }, []);

  // Handle moving to the next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < sortedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      cleanupTimers();
      setScreenState(ScreenState.RESULTS);
    }
  }, [currentQuestionIndex, sortedQuestions.length, cleanupTimers]);

  // Handle saving the score (show name entry modal)
  const handleSaveScore = useCallback(() => {
    setShowNameModal(true);
  }, []);

  // Handle submitting the name and score
  const handleSubmitName = useCallback((playerName: string) => {
    submitScoreMutation.mutate({
      playerName,
      score,
      totalQuestions: sortedQuestions.length,
      timeInSeconds: totalQuizTime
    });
  }, [score, sortedQuestions.length, totalQuizTime, submitScoreMutation]);

  // Handle restarting the quiz
  const handleRestartQuiz = useCallback(() => {
    // Refetch questions to get a new random set before starting a new quiz
    queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
    handleStartQuiz();
  }, [handleStartQuiz]);

  // Handle going back to the start screen
  const handleBackToStart = useCallback(() => {
    setScreenState(ScreenState.START);
  }, []);

  // Render the appropriate screen based on state
  return (
    <div className="stars-background min-h-screen">
      <style>{`
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
        {/* Logo only on start screen */}
        {screenState === ScreenState.START ? (
          <UCLLogo />
        ) : (
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              <div className="absolute inset-0 rounded-full bg-[#0e1e5b] border-2 border-[#b3b3b3] flex items-center justify-center">
                <div className="text-[#b3b3b3] text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-1 text-[#cfa00d]" />
                  <div className="font-montserrat font-bold text-xs md:text-sm">UCL QUIZ</div>
                </div>
              </div>
            </div>
          </div>
        )}

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
