import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * 레버리지캠프 소개 페이지
 */
export default function AboutPage() {
  // 팀 멤버 데이터
  const teamMembers = [
    {
      name: "신자동",
      role: "대표 & 강사",
      description: "해외 구매대행 및 온라인 마케팅 전문가",
      image: "/images/team-1.jpg",
    },
    {
      name: "신우성",
      role: "AI 전문가 & 강사",
      description: "ChatGPT 및 AI 활용 전문가",
      image: "/images/team-2.jpg",
    },
  ];

  // 레버리지캠프 특징
  const features = [
    {
      title: "실전 중심 교육",
      description: "이론보다는 실제 비즈니스에 바로 적용할 수 있는 실전 중심의 교육을 제공합니다.",
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
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
      ),
    },
    {
      title: "커뮤니티 지원",
      description: "강의 수강 후에도 지속적인 성장을 위한 커뮤니티와 네트워킹 기회를 제공합니다.",
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
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      title: "챌린지 프로그램",
      description: "배운 내용을 실천하고 결과를 만들어낼 수 있는 다양한 챌린지 프로그램을 운영합니다.",
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
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
        </svg>
      ),
    },
    {
      title: "최신 트렌드",
      description: "빠르게 변화하는 디지털 환경에서 최신 트렌드와 기술을 반영한 교육 콘텐츠를 제공합니다.",
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
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-16 py-12">
      {/* 히어로 섹션 */}
      <section className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              레버리지캠프 소개
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              레버리지캠프는 해외 구매대행, ChatGPT 활용, 온라인 마케팅 등 다양한 분야의 전문 지식을 제공하는 교육 플랫폼입니다. 
              실전 중심의 교육과 커뮤니티 지원을 통해 수강생들이 실질적인 성과를 낼 수 있도록 돕고 있습니다.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/lectures">
                <Button className="px-8">강의 둘러보기</Button>
              </Link>
              <Link href="/challenge">
                <Button variant="outline" className="px-8">챌린지 참여하기</Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl bg-gray-200">
              {/* 이미지 파일이 없으므로 임시로 배경색 처리 */}
              {/* <Image 
                src="/images/about-hero.jpg" 
                alt="레버리지캠프 소개 이미지"
                width={600}
                height={400}
                className="object-cover"
                priority
              /> */}
            </div>
          </div>
        </div>
      </section>

      {/* 비전 및 미션 */}
      <section className="container px-4 md:px-6 py-12 bg-muted/50 rounded-lg">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">비전 및 미션</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              레버리지캠프의 비전과 미션을 소개합니다
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-4">비전</h3>
            <CardContent className="p-0">
              <p className="text-gray-500 dark:text-gray-400">
                "디지털 시대에 누구나 자신만의 비즈니스를 성공적으로 운영할 수 있는 세상을 만든다"
              </p>
              <p className="mt-4">
                레버리지캠프는 디지털 기술과 온라인 비즈니스의 민주화를 통해 더 많은 사람들이 경제적 자유와 성장의 기회를 얻을 수 있도록 돕는 것을 목표로 합니다.
              </p>
            </CardContent>
          </Card>
          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-4">미션</h3>
            <CardContent className="p-0">
              <p className="text-gray-500 dark:text-gray-400">
                "실전 중심의 교육과 커뮤니티 지원을 통해 디지털 비즈니스 성공의 문턱을 낮춘다"
              </p>
              <p className="mt-4">
                이론보다는 실제 비즈니스에 바로 적용할 수 있는 실전 중심의 교육과 지속적인 성장을 위한 커뮤니티 지원을 통해 누구나 디지털 비즈니스에서 성공할 수 있도록 돕습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 레버리지캠프 특징 */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">레버리지캠프의 특징</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              레버리지캠프가 다른 교육 플랫폼과 차별화되는 특징을 소개합니다
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 팀 소개 */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">팀 소개</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              레버리지캠프를 이끌어가는 전문가들을 소개합니다
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative aspect-square w-full overflow-hidden bg-gray-200">
                {/* 실제 이미지가 있을 때 사용할 코드 */}
                {/* <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                /> */}
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
                <p className="mt-2 text-gray-500 dark:text-gray-400">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="container px-4 md:px-6 py-12 bg-primary/5 rounded-lg">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">레버리지캠프와 함께하세요</h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              지금 바로 레버리지캠프의 다양한 강의와 챌린지에 참여하고 성장의 기회를 잡으세요.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/register">
              <Button className="px-8">회원가입</Button>
            </Link>
            <Link href="/lectures">
              <Button variant="outline" className="px-8">강의 둘러보기</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
