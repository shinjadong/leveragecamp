import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "./db";
import { User } from "@/models/User";
import { getAuth } from "firebase-admin/auth";
import { getApp } from "firebase-admin/app";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// 사용자 정의 타입 확장
interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  points?: number;
}

// JWT 타입 확장
interface IJWT extends JWT {
  id: string;
  role: string;
  points: number;
}

// 세션 타입 확장
interface ISession extends Session {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    points: number;
  }
}

/**
 * NextAuth 인증 옵션 설정
 */
export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("이메일과 비밀번호를 입력해주세요.");
        }

        try {
          const auth = getAuth(getApp());
          const userCredential = await auth.getUserByEmail(credentials.email);
          
          if (!userCredential) {
            throw new Error("등록되지 않은 이메일입니다.");
          }

          // Firestore에서 추가 사용자 정보 조회
          const db = await connectToDB();
          const userDoc = await db.collection('users').doc(userCredential.uid).get();
          const userData = userDoc.data() as User;

          if (!userData || userData.status === "inactive") {
            throw new Error("비활성화된 계정입니다. 관리자에게 문의하세요.");
          }

          // Firebase Auth로 로그인 시도
          const signInResult = await auth.createCustomToken(userCredential.uid);

          return {
            id: userCredential.uid,
            name: userData.name,
            email: userData.email,
            role: userData.role || "user",
            points: userData.points || 0,
          };
        } catch (error) {
          console.error("로그인 오류:", error);
          throw new Error("로그인에 실패했습니다. 다시 시도해주세요.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: IUser }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.points = user.points || 0;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: IJWT }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.points = token.points as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * 관리자 권한 확인 함수
 */
export const isAdmin = (session: ISession | null) => {
  return session?.user?.role === "admin" || session?.user?.role === "superadmin";
};

/**
 * 슈퍼 관리자 권한 확인 함수
 */
export const isSuperAdmin = (session: ISession | null) => {
  return session?.user?.role === "superadmin";
};
