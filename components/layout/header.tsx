"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * 헤더 컴포넌트
 * 웹사이트의 상단 네비게이션 바를 제공합니다.
 */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">레버리지캠프</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <Link href="/lectures" className="text-sm font-medium hover:text-primary transition-colors">
              강의
            </Link>
            <Link href="/challenge" className="text-sm font-medium hover:text-primary transition-colors">
              챌린지
            </Link>
            <Link href="/notification" className="text-sm font-medium hover:text-primary transition-colors">
              공지사항
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              소개
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block text-sm font-medium hover:text-primary transition-colors">
            로그인
          </Link>
          <Link href="/register" className="hidden md:block">
            <Button size="sm">회원가입</Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label="메뉴 열기"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isMenuOpen ? "hidden" : "block h-6 w-6"}
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isMenuOpen ? "block h-6 w-6" : "hidden"}
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Button>
        </div>
      </div>
      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/lectures"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                강의
              </Link>
              <Link
                href="/challenge"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                챌린지
              </Link>
              <Link
                href="/notification"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                공지사항
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                소개
              </Link>
            </nav>
            <div className="flex flex-col space-y-2">
              <Link
                href="/login"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                로그인
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button size="sm" className="w-full">
                  회원가입
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
