import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 챌린지 목록 페이지
 */
export default function ChallengePage() {
  // 챌린지 데이터 (실제로는 DB에서 가져올 예정)
  const challenges = [
    {
      id: 1,
      title: "30일 해외구매대행 챌린지",
      description: "30일 동안 해외구매대행 비즈니스 시작하기",
      period: "2025.05.01 ~ 2025.05.30",
      fee: 50000,
      participants: 24,
      maxParticipants: 30,
      category: "비즈니스",
      image: "/images/challenge-1.jpg",
    },
    {
      id: 2,
      title: "AI 비즈니스 아이디어 챌린지",
      description: "AI를 활용한 비즈니스 아이디어 개발하기",
      period: "2025.06.01 ~ 2025.06.30",
      fee: 30000,
      participants: 18,
      maxParticipants: 40,
      category: "AI",
      image: "/images/challenge-2.jpg",
    },
    {
      id: 3,
      title: "블로그 수익화 챌린지",
      description: "개인 블로그를 통한 수익 창출 방법 배우기",
      period: "2025.07.01 ~ 2025.07.31",
      fee: 40000,
      participants: 32,
      maxParticipants: 50,
      category: "콘텐츠",
      image: "/images/challenge-3.jpg",
    },
    {
      id: 4,
      title: "유튜브 채널 성장 챌린지",
      description: "유튜브 채널 구독자 1000명 달성하기",
      period: "2025.08.01 ~ 2025.08.31",
      fee: 60000,
      participants: 15,
      maxParticipants: 30,
      category: "콘텐츠",
      image: "/images/challenge-4.jpg",
    },
  ];

  // 상태별 챌린지 분류
  const upcomingChallenges = challenges.slice(0, 2); // 예정된 챌린지
  const ongoingChallenges = challenges.slice(2, 3); // 진행 중인 챌린지
  const pastChallenges = challenges.slice(3); // 종료된 챌린지

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col items-start">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">챌린지</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          함께 성장하는 레버리지캠프의 챌린지에 참여해보세요
        </p>
      </div>

      {/* 예정된 챌린지 */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold">예정된 챌린지</h2>
        <p className="mt-1 text-muted-foreground">곧 시작될 챌린지에 미리 등록하세요</p>
        
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingChallenges.map((challenge) => (
            <Card key={challenge.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-video w-full overflow-hidden bg-gray-200">
                  {/* 실제 이미지가 있을 때 사용할 코드 */}
                  {/* <Image
                    src={challenge.image}
                    alt={challenge.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  /> */}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-primary">{challenge.category}</p>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                    예정됨
                  </span>
                </div>
                <CardTitle className="mt-2 line-clamp-1">{challenge.title}</CardTitle>
                <CardDescription className="mt-1 line-clamp-2">
                  {challenge.description}
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">기간: {challenge.period}</p>
                  <p className="text-sm text-muted-foreground">
                    참가자: {challenge.participants}/{challenge.maxParticipants}
                  </p>
                  <p className="font-bold">참가비: ₩{challenge.fee.toLocaleString()}</p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href={`/challenge/${challenge.id}`} className="w-full">
                  <Button className="w-full">참가 신청하기</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* 진행 중인 챌린지 */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold">진행 중인 챌린지</h2>
        <p className="mt-1 text-muted-foreground">현재 진행 중인 챌린지를 확인하세요</p>
        
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ongoingChallenges.map((challenge) => (
            <Card key={challenge.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-video w-full overflow-hidden bg-gray-200">
                  {/* 실제 이미지가 있을 때 사용할 코드 */}
                  {/* <Image
                    src={challenge.image}
                    alt={challenge.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  /> */}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-primary">{challenge.category}</p>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                    진행 중
                  </span>
                </div>
                <CardTitle className="mt-2 line-clamp-1">{challenge.title}</CardTitle>
                <CardDescription className="mt-1 line-clamp-2">
                  {challenge.description}
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">기간: {challenge.period}</p>
                  <p className="text-sm text-muted-foreground">
                    참가자: {challenge.participants}/{challenge.maxParticipants}
                  </p>
                  <p className="font-bold">참가비: ₩{challenge.fee.toLocaleString()}</p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href={`/challenge/${challenge.id}`} className="w-full">
                  <Button className="w-full">상세 정보 보기</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* 종료된 챌린지 */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold">종료된 챌린지</h2>
        <p className="mt-1 text-muted-foreground">이전에 진행된 챌린지를 확인하세요</p>
        
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pastChallenges.map((challenge) => (
            <Card key={challenge.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-video w-full overflow-hidden bg-gray-200">
                  {/* 실제 이미지가 있을 때 사용할 코드 */}
                  {/* <Image
                    src={challenge.image}
                    alt={challenge.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  /> */}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-primary">{challenge.category}</p>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800">
                    종료됨
                  </span>
                </div>
                <CardTitle className="mt-2 line-clamp-1">{challenge.title}</CardTitle>
                <CardDescription className="mt-1 line-clamp-2">
                  {challenge.description}
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">기간: {challenge.period}</p>
                  <p className="text-sm text-muted-foreground">
                    참가자: {challenge.participants}/{challenge.maxParticipants}
                  </p>
                  <p className="font-bold">참가비: ₩{challenge.fee.toLocaleString()}</p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href={`/challenge/${challenge.id}`} className="w-full">
                  <Button variant="outline" className="w-full">결과 보기</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
