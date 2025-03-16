import { QuizQuestion } from "@shared/schema";

// Backup questions in case the API fails
export const backupQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which team has won the most UEFA Champions League titles?",
    options: ["Real Madrid", "Barcelona", "Bayern Munich", "Liverpool"],
    correctAnswer: 0,
    difficulty: "easy"
  },
  {
    id: 2,
    question: "Who is the all-time top scorer in the UEFA Champions League?",
    options: ["Lionel Messi", "Cristiano Ronaldo", "Robert Lewandowski", "Karim Benzema"],
    correctAnswer: 1,
    difficulty: "easy"
  },
  {
    id: 3,
    question: "Which player has won the most Champions League titles?",
    options: ["Cristiano Ronaldo", "Paco Gento", "Lionel Messi", "Paolo Maldini"],
    correctAnswer: 1,
    difficulty: "medium"
  },
  {
    id: 4,
    question: "In which season was the European Cup rebranded as the UEFA Champions League?",
    options: ["1990/91", "1991/92", "1992/93", "1995/96"],
    correctAnswer: 2,
    difficulty: "medium"
  },
  {
    id: 5,
    question: "Which club won the first European Cup in 1956?",
    options: ["Real Madrid", "Benfica", "AC Milan", "Bayern Munich"],
    correctAnswer: 0,
    difficulty: "medium"
  }
];

export const getFeedbackText = (question: QuizQuestion): string => {
  return `${question.options[question.correctAnswer]} is the correct answer.`;
};

// Sort questions by difficulty
export const sortQuestionsByDifficulty = (questions: QuizQuestion[]): QuizQuestion[] => {
  const difficultyOrder: Record<string, number> = {
    easy: 1,
    medium: 2,
    hard: 3
  };
  
  return [...questions].sort((a, b) => 
    difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
  );
};

// Get a message based on the final score
export const getScoreMessage = (score: number, total: number): string => {
  const percentage = (score / total) * 100;
  
  if (percentage >= 90) {
    return "Outstanding! You're a Champions League expert!";
  } else if (percentage >= 70) {
    return "Great job! You really know your Champions League facts!";
  } else if (percentage >= 50) {
    return "Not bad! You have decent knowledge of the Champions League.";
  } else {
    return "Keep learning! The Champions League has a rich history to explore.";
  }
};

// Get stars based on score
export const getStarCount = (score: number, total: number): number => {
  const percentage = (score / total) * 100;
  
  if (percentage >= 90) return 5;
  if (percentage >= 70) return 4;
  if (percentage >= 50) return 3;
  if (percentage >= 30) return 2;
  return 1;
};
