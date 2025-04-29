import { Timestamp } from 'firebase-admin/firestore';

// 강의 상태 타입
export type LectureStatus = 'draft' | 'published' | 'archived';

// 강의 카테고리 타입
export type LectureCategory = 
  | '소싱기초' 
  | 'SEO최적화' 
  | '브랜딩' 
  | '마케팅자동화'
  | '마인드셋';

// 강의 난이도 타입
export type LectureDifficulty = '입문' | '초급' | '중급' | '고급';

// 강의 콘텐츠 인터페이스
export interface LectureContent {
  videoUrl: string;       // Vimeo 영상 URL
  thumbnailUrl: string;   // 썸네일 이미지 URL
  duration: number;       // 영상 길이(초)
  attachments?: string[]; // 첨부파일 URL 배열
  transcript?: string;    // 강의 스크립트
}

// 강의 진행상황 인터페이스
export interface LectureProgress {
  id?: string;
  userId: string;         // 사용자 ID
  lectureId: string;      // 강의 ID
  watchedSeconds: number; // 시청한 시간(초)
  isCompleted: boolean;   // 수강 완료 여부
  lastWatchedAt: Timestamp; // 마지막 시청 시간
  completedAt?: Timestamp; // 수강 완료 시간
  notes?: string;        // 수강 노트
  createdAt: Timestamp;  // 생성 시간
  updatedAt: Timestamp;  // 수정 시간
}

// 기본 강의 인터페이스
export interface Lecture {
  id?: string;
  title: string;         // 강의 제목
  description: string;   // 강의 설명
  shortDescription: string; // 짧은 설명(목록용)
  content: LectureContent; // 강의 콘텐츠
  category: LectureCategory; // 카테고리
  difficulty: LectureDifficulty; // 난이도
  prerequisites?: string[]; // 선수 강의 ID 배열
  tags: string[];        // 태그
  status: LectureStatus; // 상태
  order: number;         // 정렬 순서
  isRequired: boolean;   // 필수 강의 여부
  estimatedTime: number; // 예상 수강 시간(분)
  createdBy?: string;    // 생성자 ID
  updatedBy?: string;    // 수정자 ID
  createdAt: Timestamp;  // 생성 시간
  updatedAt: Timestamp;  // 수정 시간
}

// 컬렉션 이름 상수
export const LECTURE_COLLECTION = 'lectures';
export const LECTURE_PROGRESS_COLLECTION = 'lectureProgress'; 