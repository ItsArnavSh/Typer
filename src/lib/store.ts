import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "$lib/firebase";

// Types
export interface UserStats {
  totalScore: number;
  attempts: number;
  highScore: number;
  averageScore: number;
  lastPlayed: any; // Firebase Timestamp
  gamesCompleted: number;
  bestWPM?: number;
  bestAccuracy?: number;
}

export interface GameResult {
  score: number;
  wpm?: number;
  accuracy?: number;
  duration?: number;
  gameMode?: string;
  timestamp: any; // Firebase Timestamp
}

export interface ScoreUpdateResult {
  success: boolean;
  newStats: UserStats | null;
  isNewHighScore: boolean;
  error?: string;
}

/**
 * Updates user's score and increments attempts by 1
 * @param score - The score to add to user's total
 * @param gameResult - Optional additional game data
 */
export async function updateUserScore(
  score: number,
  gameResult?: Partial<GameResult>,
): Promise<ScoreUpdateResult> {
  console.log("updating Data");
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const userStatsRef = doc(db, "userStats", user.uid);

    // Get current stats first to check for high score
    const currentStatsDoc = await getDoc(userStatsRef);
    let currentStats: UserStats = {
      totalScore: 0,
      attempts: 0,
      highScore: 0,
      averageScore: 0,
      lastPlayed: null,
      gamesCompleted: 0,
    };

    if (currentStatsDoc.exists()) {
      currentStats = currentStatsDoc.data() as UserStats;
    }

    // Check if this is a new high score
    const isNewHighScore = score > currentStats.highScore;
    const newAttempts = currentStats.attempts + 1;
    const newTotalScore = currentStats.totalScore + score;
    const newAverageScore = Math.round(newTotalScore / newAttempts);

    // Prepare update data
    const updateData: any = {
      totalScore: increment(score),
      attempts: increment(1),
      lastPlayed: serverTimestamp(),
      averageScore: newAverageScore,
      gamesCompleted: increment(1),
    };

    // Update high score if needed
    if (isNewHighScore) {
      updateData.highScore = score;
    }

    // Add optional game result data
    if (gameResult?.wpm !== undefined) {
      if (!currentStats.bestWPM || gameResult.wpm > currentStats.bestWPM) {
        updateData.bestWPM = gameResult.wpm;
      }
    }

    if (gameResult?.accuracy !== undefined) {
      if (
        !currentStats.bestAccuracy ||
        gameResult.accuracy > currentStats.bestAccuracy
      ) {
        updateData.bestAccuracy = gameResult.accuracy;
      }
    }

    // Update user stats
    await updateDoc(userStatsRef, updateData);

    // Also save individual game record
    if (gameResult) {
      await saveGameRecord(user.uid, {
        score,
        ...gameResult,
        timestamp: serverTimestamp(),
      });
    }
    console.log("Updated Log");
    // Get updated stats
    const updatedStatsDoc = await getDoc(userStatsRef);
    const newStats = updatedStatsDoc.data() as UserStats;

    return {
      success: true,
      newStats,
      isNewHighScore,
    };
  } catch (error) {
    console.error("Error updating user score:", error);
    return {
      success: false,
      newStats: null,
      isNewHighScore: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Initialize user stats document if it doesn't exist
 */
export async function initializeUserStats(userId?: string): Promise<void> {
  try {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("No user ID provided");

    const userStatsRef = doc(db, "userStats", uid);
    const statsDoc = await getDoc(userStatsRef);

    if (!statsDoc.exists()) {
      const initialStats: UserStats = {
        totalScore: 0,
        attempts: 0,
        highScore: 0,
        averageScore: 0,
        lastPlayed: serverTimestamp(),
        gamesCompleted: 0,
      };

      await setDoc(userStatsRef, initialStats);
    }
  } catch (error) {
    console.error("Error initializing user stats:", error);
    throw error;
  }
}

/**
 * Get current user stats
 */
export async function getUserStats(userId?: string): Promise<UserStats | null> {
  try {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) return null;

    const userStatsRef = doc(db, "userStats", uid);
    const statsDoc = await getDoc(userStatsRef);

    if (statsDoc.exists()) {
      return statsDoc.data() as UserStats;
    }

    // Initialize if doesn't exist
    await initializeUserStats(uid);
    return {
      totalScore: 0,
      attempts: 0,
      highScore: 0,
      averageScore: 0,
      lastPlayed: null,
      gamesCompleted: 0,
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    return null;
  }
}

/**
 * Save individual game record
 */
async function saveGameRecord(
  userId: string,
  gameResult: GameResult,
): Promise<void> {
  try {
    const gameRecordsRef = collection(db, "gameRecords");
    await setDoc(doc(gameRecordsRef), {
      userId,
      ...gameResult,
    });
  } catch (error) {
    console.error("Error saving game record:", error);
  }
}

/**
 * Get user's recent game history
 */
export async function getUserGameHistory(
  userId?: string,
  limitCount = 10,
): Promise<GameResult[]> {
  try {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) return [];

    const gameRecordsRef = collection(db, "gameRecords");
    const q = query(
      gameRecordsRef,
      where("userId", "==", uid),
      orderBy("timestamp", "desc"),
      limit(limitCount),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as GameResult);
  } catch (error) {
    console.error("Error getting game history:", error);
    return [];
  }
}

/**
 * Quick score update - just adds score and increments attempts
 * Use this for simple games where you just need basic tracking
 */
export async function quickScoreUpdate(score: number): Promise<boolean> {
  try {
    const result = await updateUserScore(score);
    return result.success;
  } catch (error) {
    console.error("Error in quick score update:", error);
    return false;
  }
}

/**
 * Advanced score update with detailed game metrics
 * Use this for typing games or games with detailed metrics
 */
export async function advancedScoreUpdate(
  score: number,
  wpm: number,
  accuracy: number,
  duration: number,
  gameMode = "default",
): Promise<ScoreUpdateResult> {
  return updateUserScore(score, {
    wpm,
    accuracy,
    duration,
    gameMode,
  });
}

/**
 * Batch update multiple scores (useful for completing multiple levels)
 */
export async function batchScoreUpdate(
  scores: number[],
): Promise<ScoreUpdateResult> {
  try {
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const userStatsRef = doc(db, "userStats", user.uid);

    // Get current stats
    const currentStatsDoc = await getDoc(userStatsRef);
    let currentStats: UserStats = {
      totalScore: 0,
      attempts: 0,
      highScore: 0,
      averageScore: 0,
      lastPlayed: null,
      gamesCompleted: 0,
    };

    if (currentStatsDoc.exists()) {
      currentStats = currentStatsDoc.data() as UserStats;
    }

    const highestScore = Math.max(...scores);
    const isNewHighScore = highestScore > currentStats.highScore;
    const newAttempts = currentStats.attempts + scores.length;
    const newTotalScore = currentStats.totalScore + totalScore;
    const newAverageScore = Math.round(newTotalScore / newAttempts);

    const updateData: any = {
      totalScore: increment(totalScore),
      attempts: increment(scores.length),
      lastPlayed: serverTimestamp(),
      averageScore: newAverageScore,
      gamesCompleted: increment(scores.length),
    };

    if (isNewHighScore) {
      updateData.highScore = highestScore;
    }

    await updateDoc(userStatsRef, updateData);

    const updatedStatsDoc = await getDoc(userStatsRef);
    const newStats = updatedStatsDoc.data() as UserStats;

    return {
      success: true,
      newStats,
      isNewHighScore,
    };
  } catch (error) {
    console.error("Error in batch score update:", error);
    return {
      success: false,
      newStats: null,
      isNewHighScore: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
