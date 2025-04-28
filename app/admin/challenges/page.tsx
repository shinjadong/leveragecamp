"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/**
 * 챌린지 관리 페이지
 */
export default function ChallengesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");

  // 챌린지 데이터 (실제로는 API에서 가져올 예정)
  const challenges = [
    {
      id: 1,
      title: "5월 해외구매대행 챌린지",
      description: "한 달 동안 해외구매대행으로 수익 창출하기",
      startDate: "2025-05-01",
      endDate: "2025-05-31",
      participants: 45,
      status: "upcoming",
      price: 50000,
      mentor: "신자동",
      image: "/images/challenge-1.jpg",
    },
    {
      id: 2,
      title: "ChatGPT 활용 30일 챌린지",
      description: "ChatGPT를 활용한 비즈니스 생산성 향상",
      startDate: "2025-04-15",
      endDate: "2025-05-15",
      participants: 78,
      status: "active",
      price: 30000,
      mentor: "신우성",
      image: "/images/challenge-2.jpg",
    },
    {
      id: 3,
      title: "유튜브 채널 성장 챌린지",
      description: "60일 동안 유튜브 채널 구독자 1000명 달성하기",
      startDate: "2025-06-01",
      endDate: "2025-07-31",
      participants: 12,
      status: "upcoming",
      price: 70000,
      mentor: "신우성",
      image: "/images/challenge-3.jpg",
    },
    {
      id: 4,
      title: "블로그 수익화 챌린지",
      description: "90일 동안 블로그로 월 50만원 수익 만들기",
      startDate: "2025-03-01",
      endDate: "2025-05-31",
      participants: 65,
      status: "active",
      price: 60000,
      mentor: "신자동",
      image: "/images/challenge-4.jpg",
    },
    {
      id: 5,
      title: "아마존 셀러 첫 판매 챌린지",
      description: "45일 안에 아마존에서 첫 판매 달성하기",
      startDate: "2025-07-01",
      endDate: "2025-08-15",
      participants: 0,
      status: "upcoming",
      price: 80000,
      mentor: "신자동",
      image: "/images/challenge-5.jpg",
    },
    {
      id: 6,
      title: "SNS 마케팅 챌린지",
      description: "30일 동안 인스타그램 팔로워 2배 늘리기",
      startDate: "2025-04-01",
      endDate: "2025-04-30",
      participants: 92,
      status: "completed",
      price: 40000,
      mentor: "신우성",
      image: "/images/challenge-6.jpg",
    },
    {
      id: 7,
      title: "부업 수익 창출 챌린지",
      description: "60일 동안 부업으로 월 100만원 수익 만들기",
      startDate: "2025-02-01",
      endDate: "2025-03-31",
      participants: 120,
      status: "completed",
      price: 65000,
      mentor: "신자동",
      image: "/images/challenge-7.jpg",
    },
  ];

  // 필터 및 검색 적용
  const filteredChallenges = challenges.filter((challenge) => {
    // 상태 필터 적용
    if (selectedStatus !== "all" && challenge.status !== selectedStatus) {
      return false;
    }

    // 검색어 필터 적용
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        challenge.title.toLowerCase().includes(query) ||
        challenge.description.toLowerCase().includes(query) ||
        challenge.mentor.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // 페이지네이션 설정
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredChallenges.length / itemsPerPage);
  const paginatedChallenges = filteredChallenges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 상태에 따른 표시 텍스트 및 스타일
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "upcoming":
        return {
          text: "예정",
          style: "bg-blue-100 text-blue-800",
        };
      case "active":
        return {
          text: "진행 중",
          style: "bg-green-100 text-green-800",
        };
      case "completed":
        return {
          text: "종료",
          style: "bg-gray-100 text-gray-800",
        };
      default:
        return {
          text: "알 수 없음",
          style: "bg-gray-100 text-gray-800",
        };
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>챌린지 관리</CardTitle>
            <CardDescription>
              총 {filteredChallenges.length}개의 챌린지가 있습니다.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/challenges/create">
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
                챌린지 추가
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
                  placeholder="제목, 설명, 멘토로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">상태:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="챔린지 상태 필터"
                  title="챔린지 상태 필터"
                >
                  <option value="all">전체</option>
                  <option value="upcoming">예정</option>
                  <option value="active">진행 중</option>
                  <option value="completed">종료</option>
                </select>
              </div>
            </div>

            {/* 챌린지 목록 테이블 */}
            <div className="rounded-md border">
              <div className="grid grid-cols-7 p-3 text-sm font-medium">
                <div className="col-span-2">제목</div>
                <div>멘토</div>
                <div>기간</div>
                <div>참가자</div>
                <div>상태</div>
                <div>관리</div>
              </div>
              <div className="divide-y">
                {paginatedChallenges.length > 0 ? (
                  paginatedChallenges.map((challenge) => {
                    const statusDisplay = getStatusDisplay(challenge.status);
                    return (
                      <div
                        key={challenge.id}
                        className="grid grid-cols-7 p-3 text-sm hover:bg-muted/50"
                      >
                        <div className="col-span-2">
                          <div className="font-medium">{challenge.title}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-xs">
                            {challenge.description}
                          </div>
                        </div>
                        <div className="text-muted-foreground">{challenge.mentor}</div>
                        <div className="text-muted-foreground">
                          {challenge.startDate.substring(5)} ~ {challenge.endDate.substring(5)}
                        </div>
                        <div>{challenge.participants}명</div>
                        <div>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusDisplay.style}`}
                          >
                            {statusDisplay.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/challenges/${challenge.id}`}>
                            <Button variant="outline" size="sm">
                              상세
                            </Button>
                          </Link>
                          <Link href={`/admin/challenges/${challenge.id}/edit`}>
                            <Button variant="outline" size="sm">
                              수정
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })
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

      {/* 챌린지 통계 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 챌린지</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{challenges.length}개</div>
            <p className="text-xs text-muted-foreground">
              전체 챌린지 수
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">진행 중 챌린지</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {challenges.filter((challenge) => challenge.status === "active").length}개
            </div>
            <p className="text-xs text-muted-foreground">
              현재 진행 중인 챌린지 수
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 참가자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {challenges.reduce((sum, challenge) => sum + challenge.participants, 0).toLocaleString()}명
            </div>
            <p className="text-xs text-muted-foreground">
              모든 챌린지의 총 참가자 수
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
