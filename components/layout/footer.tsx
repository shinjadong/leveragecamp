"use client";

import Link from "next/link";

/**
 * 푸터 컴포넌트
 * 웹사이트의 하단 정보를 제공합니다.
 */
export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-8">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <h3 className="text-lg font-bold">레버리지캠프</h3>
          <p className="text-sm text-muted-foreground">
            신자동의 레버리지캠프에 오신 것을 환영합니다.
          </p>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-bold">바로가기</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/lectures" className="text-muted-foreground hover:text-foreground">
                강의
              </Link>
            </li>
            <li>
              <Link href="/challenge" className="text-muted-foreground hover:text-foreground">
                챌린지
              </Link>
            </li>
            <li>
              <Link href="/notification" className="text-muted-foreground hover:text-foreground">
                공지사항
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-muted-foreground hover:text-foreground">
                소개
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-bold">고객지원</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                자주 묻는 질문
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                문의하기
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                이용약관
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                개인정보처리방침
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-bold">연락처</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>이메일: info@leveragecamp.kr</li>
            <li>전화: 02-123-4567</li>
            <li>운영시간: 평일 10:00 - 18:00</li>
          </ul>
        </div>
      </div>
      
      <div className="container mt-8 border-t pt-4">
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} 레버리지캠프. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
