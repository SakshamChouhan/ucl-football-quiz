import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeaderboardEntrySchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize default quiz questions
  await storage.initializeDefaultQuestions();

  // Get all quiz questions
  app.get("/api/questions", async (req, res) => {
    try {
      const questions = await storage.getQuizQuestions();
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Get leaderboard entries
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboardEntries();
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Add a new leaderboard entry
  app.post("/api/leaderboard", async (req, res) => {
    try {
      const parseResult = insertLeaderboardEntrySchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const newEntry = await storage.createLeaderboardEntry(parseResult.data);
      res.status(201).json(newEntry);
    } catch (error) {
      console.error("Error creating leaderboard entry:", error);
      res.status(500).json({ message: "Failed to create leaderboard entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
