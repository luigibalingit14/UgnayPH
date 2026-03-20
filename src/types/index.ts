// Analysis Types
export interface VibeAnalysis {
  score: number;
  label: string;
  labelTagalog: string;
  explanation: string;
  redFlags: RedFlag[];
  literacyTips: string[];
  confidence: number;
  category: ContentCategory;
}

export interface RedFlag {
  type: RedFlagType;
  description: string;
  severity: "low" | "medium" | "high";
}

export type RedFlagType =
  | "clickbait"
  | "emotional_manipulation"
  | "unverified_source"
  | "suspicious_url"
  | "fake_urgency"
  | "missing_context"
  | "impersonation"
  | "scam_patterns"
  | "misinformation"
  | "outdated_info";

export type ContentCategory =
  | "news"
  | "social_media"
  | "advertisement"
  | "government"
  | "scam"
  | "satire"
  | "opinion"
  | "unknown";

// User Types
export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  streak_count: number;
  last_check_date: string | null;
  total_checks: number;
  created_at: string;
  updated_at: string;
}

// Report Types
export interface Report {
  id: string;
  user_id: string;
  content: string;
  content_type: "text" | "url" | "image";
  score: number;
  label: string;
  label_tagalog: string;
  explanation: string;
  red_flags: RedFlag[];
  literacy_tips: string[];
  category: ContentCategory;
  created_at: string;
}

// API Types
export interface AnalyzeRequest {
  content: string;
  contentType: "text" | "url" | "image";
  imageData?: string; // Base64 encoded image
  imageMimeType?: string; // e.g., "image/jpeg", "image/png"
}

export interface AnalyzeResponse {
  success: boolean;
  analysis?: VibeAnalysis;
  error?: string;
}

// Battle Types
export interface BattleResult {
  post1: VibeAnalysis;
  post2: VibeAnalysis;
  winner: 1 | 2 | "tie";
  comparison: string;
}

// Example Types
export interface Example {
  id: string;
  title: string;
  content: string;
  category: "fake" | "real" | "scam";
  description: string;
  source?: string;
}

// Meme Types
export interface MemeData {
  score: number;
  label: string;
  labelTagalog: string;
  content: string;
  timestamp: string;
}
