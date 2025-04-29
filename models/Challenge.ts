import { Timestamp } from 'firebase-admin/firestore';

// 챌린지 타입 정의
export type ChallengeType = 'LECTURE' | 'ASSIGNMENT' | 'TEST';
export type ChallengeStatus = 'draft' | 'published' | 'archived';
export type WeekNumber = 1 | 2 | 3 | 4 | 5;

// 주차별 서브타입 정의
export type Week1SubType = 'BASIC_LECTURE' | 'PRACTICE' | 'LEVEL_TEST';
export type Week2SubType = 'TOOL_TUTORIAL' | 'PRACTICE';
export type Week3SubType = 'RANKING' | 'RISK_MANAGEMENT' | 'SALES_MAXIMIZATION';
export type Week4SubType = 'TEMPLATE' | 'PRACTICE_VIDEO';
export type Week5SubType = 'MINDSET' | 'SCHOLARSHIP';

export type ChallengeSubType = Week1SubType | Week2SubType | Week3SubType | Week4SubType | Week5SubType;

// 챌린지 콘텐츠 인터페이스
export interface ChallengeContent {
  videoUrl?: string;      // Vimeo 영상 URL
  text?: string;          // 텍스트 내용
  attachments?: string[]; // 첨부파일 URL 배열
}

// 기본 챌린지 인터페이스
export interface Challenge {
  id?: string;
  title: string;          // 챌린지 제목
  description: string;    // 챌린지 설명
  week: WeekNumber;       // 주차 (1-5)
  order: number;          // 주차 내 순서
  type: ChallengeType;    // 콘텐츠 타입
  subType: ChallengeSubType; // 세부 타입
  content: ChallengeContent;  // 콘텐츠 정보
  isRequired: boolean;    // 필수 과제 여부
  points: number;         // 획득 가능 포인트
  status: ChallengeStatus; // 챌린지 상태
  startDate: Timestamp;   // 시작일
  endDate: Timestamp;     // 종료일
  createdBy?: string;     // 생성자 ID
  createdAt: Timestamp;   // 생성일시
  updatedAt: Timestamp;   // 수정일시
}

// 챌린지 진행상황 인터페이스
export interface ChallengeProgress {
  id?: string;
  userId: string;         // 사용자 ID (Firebase Auth UID)
  challengeId: string;    // 챌린지 ID
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'; // 진행상태
  submissionUrl?: string; // 과제 제출 URL
  feedback?: string;      // 피드백 내용
  points: number;         // 획득한 포인트
  completedAt?: Timestamp; // 완료일시
  updatedAt: Timestamp;   // 최종 수정일시
}

// 컬렉션 이름 상수
export const CHALLENGE_COLLECTION = 'challenges';
export const CHALLENGE_PROGRESS_COLLECTION = 'challengeProgress'; 