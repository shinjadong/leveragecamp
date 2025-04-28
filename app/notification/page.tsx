import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 공지사항 목록 페이지
 */
export default function NotificationPage() {
  // 공지사항 데이터 (실제로는 DB에서 가져올 예정)
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

  // 중요 공지와 일반 공지 분리
  const importantNotifications = notifications.filter(notification => notification.isImportant);
  const regularNotifications = notifications.filter(notification => !notification.isImportant);

  // 카테고리 목록 생성
  const categories = Array.from(new Set(notifications.map(notification => notification.category)));

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">공지사항</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            레버리지캠프의 중요 소식과 안내사항을 확인하세요
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" className="text-sm">전체</Button>
          {categories.map((category) => (
            <Button key={category} variant="outline" className="text-sm">{category}</Button>
          ))}
        </div>
      </div>

      {/* 중요 공지사항 */}
      {importantNotifications.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">중요 공지</h2>
          <div className="mt-4 space-y-4">
            {importantNotifications.map((notification) => (
              <Link key={notification.id} href={`/notification/${notification.id}`}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                          <span className="text-sm font-medium text-red-500">중요</span>
                          <span className="text-sm text-muted-foreground">{notification.category}</span>
                        </div>
                        <h3 className="mt-1 font-semibold">{notification.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {notification.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{notification.date}</span>
                        <span>{notification.author}</span>
                        <span>조회 {notification.viewCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 일반 공지사항 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold">공지사항</h2>
        <div className="mt-4 space-y-4">
          {regularNotifications.map((notification) => (
            <Link key={notification.id} href={`/notification/${notification.id}`}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{notification.category}</span>
                      </div>
                      <h3 className="mt-1 font-semibold">{notification.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {notification.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{notification.date}</span>
                      <span>{notification.author}</span>
                      <span>조회 {notification.viewCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" disabled>
            <span className="sr-only">이전 페이지</span>
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
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </Button>
          <Button variant="outline" size="sm" className="font-medium">
            1
          </Button>
          <Button variant="ghost" size="sm">
            2
          </Button>
          <Button variant="ghost" size="sm">
            3
          </Button>
          <Button variant="outline" size="icon">
            <span className="sr-only">다음 페이지</span>
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
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
