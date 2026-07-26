export interface BookRecord {
  id: string;
  grade: string;       // e.g. "5학년"
  classNum: string;    // e.g. "2반"
  studentName: string; // e.g. "김민준"
  title: string;       // 도서명
  author: string;      // 지은이
  publisher: string;   // 출판사
  summary: string;     // 줄거리 요약
  thoughts: string;    // 소감 및 느낀 점
  rating: number;      // 1 to 5
  readDate: string;    // YYYY-MM-DD
  createdAt: string;   // ISO string timestamp
}

export interface CheerMessage {
  id: string;
  fromStudent: string;
  toStudent: string;
  message: string;
  createdAt: string;
  likes: number;
}

export interface GasConfig {
  url: string;
  lastSyncedAt?: string;
  isConnected: boolean;
}

export type TabType = 'write' | 'my-records' | 'hall-of-fame' | 'teacher-dashboard' | 'settings';

export interface StudentStats {
  studentName: string;
  grade: string;
  classNum: string;
  count: number;
  avgRating: number;
  lastReadDate: string;
  favoriteAuthor?: string;
}
