import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
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

        await connectToDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("등록되지 않은 이메일입니다.");
        }

        if (user.status === "inactive") {
          throw new Error("비활성화된 계정입니다. 관리자에게 문의하세요.");
        }

        const isPasswordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        );

        if (!isPasswordMatch) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "user",
          points: user.points || 0,
        };
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
