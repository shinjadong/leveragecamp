"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/**
 * 공지사항 관리 페이지
 */
export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 공지사항 데이터 (실제로는 API에서 가져올 예정)
  const notifications = [
    {
      id: 1,
      title: "레버리지캠프 Next.js 웹사이트 오픈 안내",
      content: "안녕하세요, 레버리지캠프입니다. 새롭게 단장한 Next.js 기반 웹사이트가 오픈되었습니다. 더 나은 사용자 경험과 다양한 기능을 제공할 예정이니 많은 관심 부탁드립니다.",
      author: "관리자",
      date: "2025-04-25",
      isImportant: true,
      category: "공지",
      viewCount: 156,
    },
    {
      id: 2,
      title: "5월 해외구매대행 챌린지 참가자 모집",
      content: "5월 한 달 동안 진행될 해외구매대행 챌린지 참가자를 모집합니다. 해외구매대행에 관심 있으신 분들은 챌린지 페이지에서 신청해주세요.",
      author: "신자동",
      date: "2025-04-20",
      isImportant: true,
      category: "이벤트",
      viewCount: 98,
    },
    {
      id: 3,
      title: "새로운 강의 오픈: ChatGPT 활용법",
      content: "ChatGPT를 비즈니스에 효과적으로 활용하는 방법에 대한 새로운 강의가 오픈되었습니다. 인공지능을 활용한 생산성 향상에 관심 있으신 분들의 많은 참여 바랍니다.",
      author: "신우성",
      date: "2025-04-15",
      isImportant: false,
      category: "강의",
      viewCount: 87,
    },
    {
      id: 4,
      title: "레버리지캠프 커뮤니티 오픈 안내",
      content: "회원님들 간의 정보 공유와 네트워킹을 위한 커뮤니티가 오픈되었습니다. 다양한 주제에 대해 자유롭게 의견을 나누고 정보를 공유해보세요.",
      author: "관리자",
      date: "2025-04-10",
      isImportant: false,
      category: "공지",
      viewCount: 120,
    },
    {
      id: 5,
      title: "시스템 점검 안내 (2025년 5월 1일)",
      content: "2025년 5월 1일 오전 2시부터 4시까지 시스템 점검이 예정되어 있습니다. 해당 시간 동안에는 서비스 이용이 제한될 수 있으니 양해 부탁드립니다.",
      author: "관리자",
      date: "2025-04-28",
      isImportant: true,
      category: "공지",
      viewCount: 45,
    },
    {
      id: 6,
      title: "온라인 마케팅 전략 강의 할인 이벤트",
      content: "온라인 마케팅 전략 강의를 20% 할인된 가격으로 제공합니다. 이번 기회에 효과적인 온라인 마케팅 전략을 배워보세요.",
      author: "신자동",
      date: "2025-04-05",
      isImportant: false,
      category: "이벤트",
      viewCount: 76,
    },
    {
      id: 7,
      title: "레버리지캠프 뉴스레터 구독 안내",
      content: "레버리지캠프의 최신 소식과 유용한 정보를 받아보실 수 있는 뉴스레터 서비스를 시작합니다. 메인 페이지에서 이메일 주소를 등록하시면 매주 유익한 정보를 받아보실 수 있습니다.",
      author: "관리자",
      date: "2025-04-02",
      isImportant: false,
      category: "공지",
      viewCount: 63,
    },
  ];

  // 카테고리 목록 생성
  const categories = Array.from(new Set(notifications.map(notification => notification.category)));

  // 필터 및 검색 적용
  const filteredNotifications = notifications.filter((notification) => {
    // 카테고리 필터 적용
    if (selectedCategory !== "all" && notification.category !== selectedCategory) {
      return false;
    }

    // 검색어 필터 적용
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.content.toLowerCase().includes(query) ||
        notification.author.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // 페이지네이션 설정
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>공지사항 관리</CardTitle>
            <CardDescription>
              총 {filteredNotifications.length}개의 공지사항이 있습니다.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/notifications/create">
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
                공지사항 추가
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
                  placeholder="제목, 내용, 작성자로 검색"
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
                  aria-label="공지사항 카테고리 필터"
                  title="공지사항 카테고리 필터"
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

            {/* 공지사항 목록 테이블 */}
            <div className="rounded-md border">
              <div className="grid grid-cols-6 p-3 text-sm font-medium">
                <div className="col-span-3">제목</div>
                <div>작성자</div>
                <div>작성일</div>
                <div>관리</div>
              </div>
              <div className="divide-y">
                {paginatedNotifications.length > 0 ? (
                  paginatedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="grid grid-cols-6 p-3 text-sm hover:bg-muted/50"
                    >
                      <div className="col-span-3 flex items-center">
                        {notification.isImportant && (
                          <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                        )}
                        <div>
                          <div className="font-medium">{notification.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {notification.category} · 조회 {notification.viewCount}
                          </div>
                        </div>
                      </div>
                      <div className="text-muted-foreground">{notification.author}</div>
                      <div className="text-muted-foreground">{notification.date}</div>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/notifications/${notification.id}`}>
                          <Button variant="outline" size="sm">
                            상세
                          </Button>
                        </Link>
                        <Link href={`/admin/notifications/${notification.id}/edit`}>
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

      {/* 공지사항 통계 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 공지사항</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}개</div>
            <p className="text-xs text-muted-foreground">
              전체 공지사항 수
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">중요 공지</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter((notification) => notification.isImportant).length}개
            </div>
            <p className="text-xs text-muted-foreground">
              중요 표시된 공지사항 수
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">평균 조회수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                notifications.reduce((sum, notification) => sum + notification.viewCount, 0) / notifications.length
              ).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              공지사항 평균 조회수
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
