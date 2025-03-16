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
import { questionsPool } from "@/lib/questions";

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
    // Check if questions already exist
    const existingQuestions = await this.getQuizQuestions();
    
    // Only populate if database is empty
    if (existingQuestions.length === 0) {
      // Use our full question pool from client/lib/questions.ts
      const allQuestions = questionsPool.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty
      }));
      
      // Add all questions to database
      for (const question of allQuestions) {
        await this.createQuizQuestion(question);
      }
      
      console.log(`Initialized database with ${allQuestions.length} quiz questions`);
    }
  }
}

export const storage = new MemStorage();
