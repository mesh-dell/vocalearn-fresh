export interface LeaderboardEntry {
  totalPoints: number;
  studentName: string;
  badgesAcquired: Record<string, number>;
}
