import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * 미들웨어 - 관리자 페이지 접근 제한
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 관리자 페이지 경로 확인
  const isAdminPath = path.startsWith("/admin");
  
  // 공개 경로 (로그인 필요 없음)
  const isPublicPath = 
    path === "/login" || 
    path === "/register" || 
    path === "/" || 
    path.startsWith("/api/public");

  // JWT 토큰 가져오기
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // 로그인 상태 확인
  const isLoggedIn = !!token;
  
  // 관리자 권한 확인
  const isAdmin = token?.role === "admin" || token?.role === "superadmin";

  // 관리자 페이지 접근 제한
  if (isAdminPath) {
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    // 관리자가 아닌 경우 메인 페이지로 리다이렉트
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 이미 로그인한 상태에서 로그인/회원가입 페이지 접근 시 메인 페이지로 리다이렉트
  if (isLoggedIn && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// 미들웨어가 적용될 경로 지정
export const config = {
  matcher: [
    // 관리자 페이지
    "/admin/:path*",
    // 인증 페이지
    "/login",
    "/register",
  ],
};
