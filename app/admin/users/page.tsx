"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/**
 * 회원 관리 페이지
 */
export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // API에서 회원 데이터 가져오기
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/users');
        
        if (!response.ok) {
          throw new Error('회원 데이터를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error('회원 데이터 로딩 오류:', err);
        setError('회원 데이터를 불러오는데 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // 임시 회원 데이터 (API 로딩 중이거나 오류 발생 시 사용)
  const sampleUsers = [
    {
      id: 1,
      name: "김철수",
      email: "chulsoo@example.com",
      phone: "010-1234-5678",
      joinDate: "2025-04-25",
      points: 1200,
      status: "active",
    },
    {
      id: 2,
      name: "이영희",
      email: "younghee@example.com",
      phone: "010-2345-6789",
      joinDate: "2025-04-24",
      points: 850,
      status: "active",
    },
    {
      id: 3,
      name: "박지민",
      email: "jimin@example.com",
      phone: "010-3456-7890",
      joinDate: "2025-04-23",
      points: 300,
      status: "active",
    },
    {
      id: 4,
      name: "정수진",
      email: "soojin@example.com",
      phone: "010-4567-8901",
      joinDate: "2025-04-22",
      points: 0,
      status: "inactive",
    },
    {
      id: 5,
      name: "최민준",
      email: "minjun@example.com",
      phone: "010-5678-9012",
      joinDate: "2025-04-21",
      points: 500,
      status: "active",
    },
    {
      id: 6,
      name: "강지현",
      email: "jihyun@example.com",
      phone: "010-6789-0123",
      joinDate: "2025-04-20",
      points: 750,
      status: "active",
    },
    {
      id: 7,
      name: "윤서연",
      email: "seoyeon@example.com",
      phone: "010-7890-1234",
      joinDate: "2025-04-19",
      points: 100,
      status: "inactive",
    },
    {
      id: 8,
      name: "임현우",
      email: "hyunwoo@example.com",
      phone: "010-8901-2345",
      joinDate: "2025-04-18",
      points: 1500,
      status: "active",
    },
    {
      id: 9,
      name: "한소희",
      email: "sohee@example.com",
      phone: "010-9012-3456",
      joinDate: "2025-04-17",
      points: 2000,
      status: "active",
    },
    {
      id: 10,
      name: "오민석",
      email: "minseok@example.com",
      phone: "010-0123-4567",
      joinDate: "2025-04-16",
      points: 350,
      status: "active",
    },
  ];

  // 실제 데이터 또는 샘플 데이터 사용
  const displayUsers = loading || error || users.length === 0 ? sampleUsers : users;

  // 필터 및 검색 적용
  const filteredUsers = displayUsers
    .filter((user) => {
      // 검색어 필터링
      const matchesSearch =
        searchQuery === "" ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone && user.phone.includes(searchQuery));

      // 상태 필터링
      const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "active" && user.status === "active") ||
        (selectedFilter === "inactive" && user.status === "inactive");

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const dateA = a.joinDate ? new Date(a.joinDate).getTime() : 0;
      const dateB = b.joinDate ? new Date(b.joinDate).getTime() : 0;
      return dateB - dateA;
    });

  // 페이지네이션 설정
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>회원 관리</CardTitle>
            <CardDescription>
              총 {filteredUsers.length}명의 회원이 있습니다.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/users/create">
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
                회원 추가
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
                  placeholder="이름, 이메일, 연락처로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">상태:</span>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="회원 상태 필터"
                  title="회원 상태 필터"
                >
                  <option value="all">전체</option>
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                </select>
              </div>
            </div>

            {/* 회원 목록 테이블 */}
            <div className="rounded-md border">
              <div className="grid grid-cols-6 p-3 text-sm font-medium">
                <div>이름</div>
                <div>이메일</div>
                <div>연락처</div>
                <div>가입일</div>
                <div>포인트</div>
                <div>관리</div>
              </div>
              <div className="divide-y">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-6 p-3 text-sm hover:bg-muted/50"
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-muted-foreground">{user.email}</div>
                      <div className="text-muted-foreground">{user.phone}</div>
                      <div className="text-muted-foreground">{user.joinDate}</div>
                      <div>{user.points.toLocaleString()}</div>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/users/${user.id}`}>
                          <Button variant="outline" size="sm">
                            상세
                          </Button>
                        </Link>
                        <Link href={`/admin/users/${user.id}/edit`}>
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

      {/* 회원 통계 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 회원</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayUsers.length}명</div>
            <p className="text-xs text-muted-foreground">
              전체 회원 수
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">활성 회원</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user) => user.status === "active").length}명
            </div>
            <p className="text-xs text-muted-foreground">
              활성 상태인 회원 수
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 포인트</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.reduce((sum, user) => sum + user.points, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              전체 회원의 총 포인트
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
