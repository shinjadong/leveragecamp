import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 관리자 대시보드 페이지
 */
export default function AdminDashboard() {
  // 통계 데이터 (실제로는 API에서 가져올 예정)
  const stats = [
    {
      title: "총 회원수",
      value: "97",
      description: "전체 회원 수",
      change: "+5%",
      changeType: "increase",
      icon: (
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
          className="h-6 w-6"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "총 강의수",
      value: "12",
      description: "전체 강의 수",
      change: "+2",
      changeType: "increase",
      icon: (
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
          className="h-6 w-6"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
    {
      title: "진행 중인 챌린지",
      value: "3",
      description: "현재 진행 중인 챌린지",
      change: "+1",
      changeType: "increase",
      icon: (
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
          className="h-6 w-6"
        >
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      ),
    },
    {
      title: "총 매출",
      value: "₩3,250,000",
      description: "이번 달 총 매출",
      change: "+12%",
      changeType: "increase",
      icon: (
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
          className="h-6 w-6"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
  ];

  // 최근 가입 회원 (실제로는 API에서 가져올 예정)
  const recentUsers = [
    {
      id: 1,
      name: "김철수",
      email: "chulsoo@example.com",
      date: "2025-04-25",
    },
    {
      id: 2,
      name: "이영희",
      email: "younghee@example.com",
      date: "2025-04-24",
    },
    {
      id: 3,
      name: "박지민",
      email: "jimin@example.com",
      date: "2025-04-23",
    },
    {
      id: 4,
      name: "정수진",
      email: "soojin@example.com",
      date: "2025-04-22",
    },
    {
      id: 5,
      name: "최민준",
      email: "minjun@example.com",
      date: "2025-04-21",
    },
  ];

  // 최근 공지사항 (실제로는 API에서 가져올 예정)
  const recentNotifications = [
    {
      id: 1,
      title: "레버리지캠프 Next.js 웹사이트 오픈 안내",
      date: "2025-04-25",
      author: "관리자",
    },
    {
      id: 2,
      title: "5월 해외구매대행 챌린지 참가자 모집",
      date: "2025-04-20",
      author: "신자동",
    },
    {
      id: 3,
      title: "새로운 강의 오픈: ChatGPT 활용법",
      date: "2025-04-15",
      author: "신우성",
    },
    {
      id: 4,
      title: "레버리지캠프 커뮤니티 오픈 안내",
      date: "2025-04-10",
      author: "관리자",
    },
    {
      id: 5,
      title: "시스템 점검 안내 (2025년 5월 1일)",
      date: "2025-04-28",
      author: "관리자",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-600">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className="mt-2 flex items-center text-xs">
                <span
                  className={
                    stat.changeType === "increase"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-1 text-muted-foreground">
                  {stat.changeType === "increase" ? "증가" : "감소"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 최근 가입 회원 */}
        <Card>
          <CardHeader>
            <CardTitle>최근 가입 회원</CardTitle>
            <CardDescription>최근에 가입한 회원 목록입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-3 p-3 text-sm font-medium">
                  <div>이름</div>
                  <div>이메일</div>
                  <div>가입일</div>
                </div>
                <div className="divide-y">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-3 p-3 text-sm hover:bg-muted/50"
                    >
                      <div>{user.name}</div>
                      <div className="text-muted-foreground">{user.email}</div>
                      <div className="text-muted-foreground">{user.date}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Link
                  href="/admin/users"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  모든 회원 보기 &rarr;
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 최근 공지사항 */}
        <Card>
          <CardHeader>
            <CardTitle>최근 공지사항</CardTitle>
            <CardDescription>최근에 등록된 공지사항입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-3 p-3 text-sm font-medium">
                  <div className="col-span-2">제목</div>
                  <div>작성일</div>
                </div>
                <div className="divide-y">
                  {recentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="grid grid-cols-3 p-3 text-sm hover:bg-muted/50"
                    >
                      <div className="col-span-2 truncate">{notification.title}</div>
                      <div className="text-muted-foreground">{notification.date}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Link
                  href="/admin/notifications"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  모든 공지사항 보기 &rarr;
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 빠른 작업 버튼 */}
      <Card>
        <CardHeader>
          <CardTitle>빠른 작업</CardTitle>
          <CardDescription>자주 사용하는 관리 기능에 빠르게 접근하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            <Link
              href="/admin/users/create"
              className="flex flex-col items-center justify-center rounded-md border p-4 hover:bg-muted/50"
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
                className="h-6 w-6 mb-2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" x2="19" y1="8" y2="14" />
                <line x1="22" x2="16" y1="11" y2="11" />
              </svg>
              <span className="text-sm font-medium">회원 추가</span>
            </Link>
            <Link
              href="/admin/lectures/create"
              className="flex flex-col items-center justify-center rounded-md border p-4 hover:bg-muted/50"
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
                className="h-6 w-6 mb-2"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" x2="12" y1="18" y2="12" />
                <line x1="9" x2="15" y1="15" y2="15" />
              </svg>
              <span className="text-sm font-medium">강의 등록</span>
            </Link>
            <Link
              href="/admin/challenges/create"
              className="flex flex-col items-center justify-center rounded-md border p-4 hover:bg-muted/50"
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
                className="h-6 w-6 mb-2"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" x2="12" y1="18" y2="12" />
                <line x1="9" x2="15" y1="15" y2="15" />
              </svg>
              <span className="text-sm font-medium">챌린지 등록</span>
            </Link>
            <Link
              href="/admin/notifications/create"
              className="flex flex-col items-center justify-center rounded-md border p-4 hover:bg-muted/50"
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
                className="h-6 w-6 mb-2"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" x2="12" y1="18" y2="12" />
                <line x1="9" x2="15" y1="15" y2="15" />
              </svg>
              <span className="text-sm font-medium">공지사항 등록</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
