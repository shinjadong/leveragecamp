import "next-auth";

/**
 * NextAuth 타입 확장
 */
declare module "next-auth" {
  /**
   * 세션 사용자 정보 타입 확장
   */
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    points: number;
  }

  /**
   * 세션 타입 확장
   */
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      points: number;
    };
  }
}

/**
 * JWT 토큰 타입 확장
 */
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    points: number;
  }
}
