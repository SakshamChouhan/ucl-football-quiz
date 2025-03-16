import { 
  users, 
  type User, 
  type InsertUser, 
  leaderboardEntries, 
  type LeaderboardEntry,
  type InsertLeaderboardEntry,
  quizQuestions,
  type QuizQuestion,
  type InsertQuizQuestion
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Leaderboard operations
  getLeaderboardEntries(): Promise<LeaderboardEntry[]>;
  createLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry>;
  
  // Quiz question operations
  getQuizQuestions(): Promise<QuizQuestion[]>;
  getQuizQuestionById(id: number): Promise<QuizQuestion | undefined>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  initializeDefaultQuestions(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leaderboardEntries: Map<number, LeaderboardEntry>;
  private quizQuestions: Map<number, QuizQuestion>;
  private userId: number;
  private leaderboardId: number;
  private questionId: number;

  constructor() {
    this.users = new Map();
    this.leaderboardEntries = new Map();
    this.quizQuestions = new Map();
    this.userId = 1;
    this.leaderboardId = 1;
    this.questionId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Leaderboard operations
  async getLeaderboardEntries(): Promise<LeaderboardEntry[]> {
    return Array.from(this.leaderboardEntries.values())
      .sort((a, b) => {
        // First sort by score (descending)
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        // Then by time (ascending)
        return a.timeInSeconds - b.timeInSeconds;
      });
  }
  
  async createLeaderboardEntry(insertEntry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    const id = this.leaderboardId++;
    const entry: LeaderboardEntry = { 
      ...insertEntry, 
      id, 
      date: new Date() 
    };
    this.leaderboardEntries.set(id, entry);
    return entry;
  }
  
  // Quiz question operations
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values());
  }
  
  async getQuizQuestionById(id: number): Promise<QuizQuestion | undefined> {
    return this.quizQuestions.get(id);
  }
  
  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const id = this.questionId++;
    const question: QuizQuestion = { ...insertQuestion, id };
    this.quizQuestions.set(id, question);
    return question;
  }
  
  async initializeDefaultQuestions(): Promise<void> {
    const defaultQuestions: InsertQuizQuestion[] = [
      {
        question: "Which team has won the most UEFA Champions League titles?",
        options: ["Real Madrid", "Barcelona", "Bayern Munich", "Liverpool"],
        correctAnswer: 0,
        difficulty: "easy"
      },
      {
        question: "Who is the all-time top scorer in the UEFA Champions League?",
        options: ["Lionel Messi", "Cristiano Ronaldo", "Robert Lewandowski", "Karim Benzema"],
        correctAnswer: 1,
        difficulty: "easy"
      },
      {
        question: "In which city was the first European Cup final played in 1956?",
        options: ["Paris", "Madrid", "London", "Rome"],
        correctAnswer: 0,
        difficulty: "medium"
      },
      {
        question: "Which player has won the most Champions League titles?",
        options: ["Cristiano Ronaldo", "Paco Gento", "Lionel Messi", "Paolo Maldini"],
        correctAnswer: 1,
        difficulty: "medium"
      },
      {
        question: "In which season was the European Cup rebranded as the UEFA Champions League?",
        options: ["1990/91", "1991/92", "1992/93", "1995/96"],
        correctAnswer: 2,
        difficulty: "medium"
      },
      {
        question: "Which club won the first European Cup in 1956?",
        options: ["Real Madrid", "Benfica", "AC Milan", "Bayern Munich"],
        correctAnswer: 0,
        difficulty: "medium"
      },
      {
        question: "Which team has appeared in the most European Cup/Champions League finals?",
        options: ["Real Madrid", "Bayern Munich", "AC Milan", "Liverpool"],
        correctAnswer: 0,
        difficulty: "medium"
      },
      {
        question: "Who scored the winning goal for Chelsea in the 2012 Champions League final?",
        options: ["Didier Drogba", "Frank Lampard", "Fernando Torres", "Juan Mata"],
        correctAnswer: 0,
        difficulty: "medium"
      },
      {
        question: "Which player scored the fastest goal in Champions League history?",
        options: ["Roy Makaay", "Alessandro Del Piero", "Raúl", "David Alaba"],
        correctAnswer: 0,
        difficulty: "hard"
      },
      {
        question: "Which team completed the treble (domestic league, domestic cup, and Champions League) in the 1998-99 season?",
        options: ["Manchester United", "Bayern Munich", "Barcelona", "Inter Milan"],
        correctAnswer: 0,
        difficulty: "medium"
      },
      {
        question: "Which was the first team to win the Champions League undefeated?",
        options: ["Manchester United", "Barcelona", "AC Milan", "Ajax"],
        correctAnswer: 2,
        difficulty: "hard"
      },
      {
        question: "Who is the only player to win the Champions League with three different clubs?",
        options: ["Clarence Seedorf", "Cristiano Ronaldo", "Zlatan Ibrahimović", "Thiago Alcântara"],
        correctAnswer: 0,
        difficulty: "hard"
      },
      {
        question: "Which team came back from 3-0 down to win the 2005 Champions League final?",
        options: ["Liverpool", "Real Madrid", "Barcelona", "AC Milan"],
        correctAnswer: 0,
        difficulty: "medium"
      },
      {
        question: "Who scored Real Madrid's 93rd-minute equalizing goal in the 2014 Champions League final?",
        options: ["Cristiano Ronaldo", "Gareth Bale", "Sergio Ramos", "Karim Benzema"],
        correctAnswer: 2,
        difficulty: "hard"
      },
      {
        question: "Which manager has won the most Champions League titles?",
        options: ["Carlo Ancelotti", "Alex Ferguson", "Pep Guardiola", "José Mourinho"],
        correctAnswer: 0,
        difficulty: "medium"
      },
      {
        question: "Which team beat Barcelona 8-2 in the 2020 Champions League quarter-finals?",
        options: ["Bayern Munich", "Liverpool", "PSG", "Manchester City"],
        correctAnswer: 0,
        difficulty: "easy"
      },
      {
        question: "Who was the first English player to win the Champions League with a foreign club?",
        options: ["Steve McManaman", "David Beckham", "Owen Hargreaves", "Gary Lineker"],
        correctAnswer: 0,
        difficulty: "hard"
      },
      {
        question: "Which goalkeeper holds the record for most clean sheets in Champions League history?",
        options: ["Iker Casillas", "Gianluigi Buffon", "Manuel Neuer", "Petr Čech"],
        correctAnswer: 0,
        difficulty: "medium"
      },
      {
        question: "Which was the first team to retain the Champions League in its modern format?",
        options: ["AC Milan", "Barcelona", "Real Madrid", "Manchester United"],
        correctAnswer: 2,
        difficulty: "medium"
      },
      {
        question: "Which team won the Champions League in 2018, 2016, and 2017?",
        options: ["Barcelona", "Real Madrid", "Liverpool", "Bayern Munich"],
        correctAnswer: 1,
        difficulty: "easy"
      }
    ];
    
    // Check if questions already exist
    const existingQuestions = await this.getQuizQuestions();
    if (existingQuestions.length === 0) {
      for (const question of defaultQuestions) {
        await this.createQuizQuestion(question);
      }
    }
  }
}

export const storage = new MemStorage();
