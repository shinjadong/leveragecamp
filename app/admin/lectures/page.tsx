"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/**
 * 강의 관리 페이지
 */
export default function LecturesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 강의 데이터 (실제로는 API에서 가져올 예정)
  const lectures = [
    {
      id: 1,
      title: "해외 구매대행 기초",
      description: "해외 구매대행 비즈니스의 기초를 배워보세요.",
      instructor: "신자동",
      price: 99000,
      category: "비즈니스",
      tags: ["해외구매대행", "창업", "수익화"],
      image: "/images/lecture-1.jpg",
      status: "published",
      createdAt: "2025-04-10",
    },
    {
      id: 2,
      title: "ChatGPT 활용법",
      description: "ChatGPT를 비즈니스에 효과적으로 활용하는 방법",
      instructor: "신우성",
      price: 79000,
      category: "AI",
      tags: ["ChatGPT", "AI", "생산성"],
      image: "/images/lecture-2.jpg",
      status: "published",
      createdAt: "2025-04-12",
    },
    {
      id: 3,
      title: "온라인 마케팅 전략",
      description: "효과적인 온라인 마케팅 전략 수립하기",
      instructor: "신자동",
      price: 89000,
      category: "마케팅",
      tags: ["마케팅", "SNS", "광고"],
      image: "/images/lecture-3.jpg",
      status: "published",
      createdAt: "2025-04-15",
    },
    {
      id: 4,
      title: "아마존 셀러 되기",
      description: "아마존에서 성공적인 셀러가 되는 방법",
      instructor: "신자동",
      price: 129000,
      category: "비즈니스",
      tags: ["아마존", "이커머스", "해외판매"],
      image: "/images/lecture-4.jpg",
      status: "published",
      createdAt: "2025-04-18",
    },
    {
      id: 5,
      title: "디지털 노마드 생활",
      description: "장소에 구애받지 않고 일하는 디지털 노마드 생활 시작하기",
      instructor: "신우성",
      price: 69000,
      category: "라이프스타일",
      tags: ["디지털노마드", "원격근무", "자유"],
      image: "/images/lecture-5.jpg",
      status: "published",
      createdAt: "2025-04-20",
    },
    {
      id: 6,
      title: "부업으로 월 100만원 만들기",
      description: "본업 외에 부업으로 월 100만원 수익 창출하는 방법",
      instructor: "신자동",
      price: 109000,
      category: "비즈니스",
      tags: ["부업", "수익화", "사이드프로젝트"],
      image: "/images/lecture-6.jpg",
      status: "draft",
      createdAt: "2025-04-22",
    },
    {
      id: 7,
      title: "유튜브 채널 성장 전략",
      description: "유튜브 채널 구독자 1000명 달성하는 전략",
      instructor: "신우성",
      price: 89000,
      category: "콘텐츠",
      tags: ["유튜브", "콘텐츠", "크리에이터"],
      image: "/images/lecture-7.jpg",
      status: "draft",
      createdAt: "2025-04-23",
    },
    {
      id: 8,
      title: "블로그 수익화 방법",
      description: "개인 블로그로 수익 창출하는 방법",
      instructor: "신자동",
      price: 79000,
      category: "콘텐츠",
      tags: ["블로그", "수익화", "애드센스"],
      image: "/images/lecture-8.jpg",
      status: "published",
      createdAt: "2025-04-24",
    },
  ];

  // 카테고리 목록 생성
  const categories = Array.from(new Set(lectures.map(lecture => lecture.category)));

  // 필터 및 검색 적용
  const filteredLectures = lectures.filter((lecture) => {
    // 카테고리 필터 적용
    if (selectedCategory !== "all" && lecture.category !== selectedCategory) {
      return false;
    }

    // 검색어 필터 적용
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        lecture.title.toLowerCase().includes(query) ||
        lecture.description.toLowerCase().includes(query) ||
        lecture.instructor.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // 페이지네이션 설정
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredLectures.length / itemsPerPage);
  const paginatedLectures = filteredLectures.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>강의 관리</CardTitle>
            <CardDescription>
              총 {filteredLectures.length}개의 강의가 있습니다.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/lectures/create">
              <Button>
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
                  className="h-4 w-4 mr-2"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                강의 추가
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 검색 및 필터 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="제목, 설명, 강사로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">카테고리:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="강의 카테고리 필터"
                  title="강의 카테고리 필터"
                >
                  <option value="all">전체</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 강의 목록 테이블 */}
            <div className="rounded-md border">
              <div className="grid grid-cols-6 p-3 text-sm font-medium">
                <div className="col-span-2">제목</div>
                <div>강사</div>
                <div>가격</div>
                <div>상태</div>
                <div>관리</div>
              </div>
              <div className="divide-y">
                {paginatedLectures.length > 0 ? (
                  paginatedLectures.map((lecture) => (
                    <div
                      key={lecture.id}
                      className="grid grid-cols-6 p-3 text-sm hover:bg-muted/50"
                    >
                      <div className="col-span-2">
                        <div className="font-medium">{lecture.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-xs">
                          {lecture.description}
                        </div>
                      </div>
                      <div className="text-muted-foreground">{lecture.instructor}</div>
                      <div>₩{lecture.price.toLocaleString()}</div>
                      <div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            lecture.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {lecture.status === "published" ? "게시됨" : "초안"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/lectures/${lecture.id}`}>
                          <Button variant="outline" size="sm">
                            상세
                          </Button>
                        </Link>
                        <Link href={`/admin/lectures/${lecture.id}/edit`}>
                          <Button variant="outline" size="sm">
                            수정
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    검색 결과가 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
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
                      className="h-4 w-4"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    <span className="sr-only">이전 페이지</span>
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
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
                      className="h-4 w-4"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                    <span className="sr-only">다음 페이지</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 강의 통계 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 강의</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lectures.length}개</div>
            <p className="text-xs text-muted-foreground">
              전체 강의 수
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">게시된 강의</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lectures.filter((lecture) => lecture.status === "published").length}개
            </div>
            <p className="text-xs text-muted-foreground">
              현재 게시 중인 강의 수
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">평균 가격</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₩{Math.round(
                lectures.reduce((sum, lecture) => sum + lecture.price, 0) / lectures.length
              ).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              전체 강의의 평균 가격
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
