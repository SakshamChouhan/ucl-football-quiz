import { QuizQuestion } from "@shared/schema";

// A large pool of UEFA Champions League questions
export const questionsPool: QuizQuestion[] = [
  // Easy questions
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
  },
  // Adding more questions
  {
    id: 6,
    question: "Which country has produced the most Champions League winning clubs?",
    options: ["Spain", "Italy", "England", "Germany"],
    correctAnswer: 0,
    difficulty: "medium"
  },
  {
    id: 7,
    question: "Who scored the winning goal for Real Madrid in the 2022 Champions League final?",
    options: ["Karim Benzema", "Vinícius Júnior", "Luka Modrić", "Federico Valverde"],
    correctAnswer: 1,
    difficulty: "easy"
  },
  {
    id: 8,
    question: "In which city was the first Champions League final played under its new name in 1993?",
    options: ["Munich", "Milan", "London", "Paris"],
    correctAnswer: 0,
    difficulty: "hard"
  },
  {
    id: 9,
    question: "Which team completed a historic treble (domestic league, domestic cup, and Champions League) in the 1998-99 season?",
    options: ["Barcelona", "Manchester United", "Bayern Munich", "Real Madrid"],
    correctAnswer: 1,
    difficulty: "medium"
  },
  {
    id: 10,
    question: "Who is the Champions League's all-time leader in assists?",
    options: ["Lionel Messi", "Cristiano Ronaldo", "Andrés Iniesta", "Ryan Giggs"],
    correctAnswer: 0,
    difficulty: "medium"
  },
  {
    id: 11,
    question: "Which goalkeeper holds the record for most clean sheets in Champions League history?",
    options: ["Iker Casillas", "Gianluigi Buffon", "Manuel Neuer", "Petr Čech"],
    correctAnswer: 0,
    difficulty: "medium"
  },
  {
    id: 12,
    question: "Which club has the most consecutive Champions League/European Cup final appearances?",
    options: ["Real Madrid", "Bayern Munich", "Ajax", "Liverpool"],
    correctAnswer: 0,
    difficulty: "hard"
  },
  {
    id: 13,
    question: "Which manager has won the Champions League with three different clubs?",
    options: ["José Mourinho", "Carlo Ancelotti", "Pep Guardiola", "No one has achieved this"],
    correctAnswer: 3,
    difficulty: "hard"
  },
  {
    id: 14,
    question: "Which team overturned a 4-0 first leg deficit against Barcelona in the 2018/19 Champions League semi-finals?",
    options: ["Manchester City", "Liverpool", "Tottenham Hotspur", "Ajax"],
    correctAnswer: 1,
    difficulty: "easy"
  },
  {
    id: 15,
    question: "Who scored the fastest goal in Champions League history?",
    options: ["Roy Makaay", "Alessandro Del Piero", "Raúl", "Kylian Mbappé"],
    correctAnswer: 0,
    difficulty: "hard"
  },
  {
    id: 16,
    question: "In the 2020 Champions League final, which team did Bayern Munich defeat?",
    options: ["Paris Saint-Germain", "Barcelona", "Manchester City", "Real Madrid"],
    correctAnswer: 0,
    difficulty: "easy"
  },
  {
    id: 17,
    question: "Which club won the Champions League in 2012, winning for the first time in their history?",
    options: ["Chelsea", "Manchester City", "Borussia Dortmund", "Atlético Madrid"],
    correctAnswer: 0,
    difficulty: "easy"
  },
  {
    id: 18,
    question: "Which player scored a bicycle kick in the 2018 Champions League final?",
    options: ["Karim Benzema", "Gareth Bale", "Cristiano Ronaldo", "Sergio Ramos"],
    correctAnswer: 1,
    difficulty: "medium"
  },
  {
    id: 19,
    question: "Which club has lost the most Champions League/European Cup finals?",
    options: ["Juventus", "Bayern Munich", "Benfica", "Atlético Madrid"],
    correctAnswer: 0,
    difficulty: "medium"
  },
  {
    id: 20,
    question: "Which Dutch club won the Champions League in 1995?",
    options: ["PSV Eindhoven", "Feyenoord", "Ajax", "AZ Alkmaar"],
    correctAnswer: 2,
    difficulty: "medium"
  },
  {
    id: 21,
    question: "Who was the youngest manager to win the Champions League?",
    options: ["José Mourinho", "Pep Guardiola", "Zinedine Zidane", "Carlo Ancelotti"],
    correctAnswer: 1,
    difficulty: "hard"
  },
  {
    id: 22,
    question: "Which club eliminated Barcelona in the quarter-finals of the 2019/20 Champions League with an 8-2 victory?",
    options: ["Liverpool", "Bayern Munich", "Manchester City", "Paris Saint-Germain"],
    correctAnswer: 1,
    difficulty: "easy"
  },
  {
    id: 23,
    question: "Who scored the winning goal for Liverpool in the 2005 Champions League final against AC Milan?",
    options: ["Steven Gerrard", "Jerzy Dudek (saved the winning penalty)", "Xabi Alonso", "There was no winning goal, Liverpool won on penalties"],
    correctAnswer: 3,
    difficulty: "medium"
  },
  {
    id: 24,
    question: "Which city has hosted the most Champions League finals?",
    options: ["London", "Madrid", "Paris", "Rome"],
    correctAnswer: 0,
    difficulty: "hard"
  },
  {
    id: 25,
    question: "Which player has scored in the most Champions League finals?",
    options: ["Cristiano Ronaldo", "Lionel Messi", "Gareth Bale", "Karim Benzema"],
    correctAnswer: 0,
    difficulty: "medium"
  }
];

// Use as backup questions for API failure
export const backupQuestions = questionsPool.slice(0, 5);

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

// Randomly select a subset of questions without repeating
export const getRandomQuestions = (
  allQuestions: QuizQuestion[], 
  count: number = 15
): QuizQuestion[] => {
  // Make a copy to avoid modifying the original
  const questionsCopy = [...allQuestions];
  
  // Shuffle the questions (Fisher-Yates algorithm)
  for (let i = questionsCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionsCopy[i], questionsCopy[j]] = [questionsCopy[j], questionsCopy[i]];
  }
  
  // Take the first 'count' questions or all if less are available
  return questionsCopy.slice(0, Math.min(count, questionsCopy.length));
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
