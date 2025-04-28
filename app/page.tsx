import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 레버리지캠프 메인 페이지
 */
export default function Home() {
  return (
    <div className="flex flex-col gap-12 py-8">
      {/* 히어로 섹션 */}
      <section className="container px-4 md:px-6 py-12 md:py-24 lg:py-32">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              레버리지캠프에 오신 것을 환영합니다
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              신자동의 레버리지캠프는 해외 구매대행, ChatGPT 활용 등 다양한 분야의 전문 지식을 제공합니다.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/lectures">
                <Button className="px-8">강의 둘러보기</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="px-8">회원가입</Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl bg-gray-200">
              {/* 이미지 파일이 없으므로 임시로 배경색 처리 */}
              {/* <Image 
                src="/images/hero-image.jpg" 
                alt="레버리지캠프 메인 이미지"
                width={600}
                height={400}
                className="object-cover"
                priority
              /> */}
            </div>
          </div>
        </div>
      </section>

      {/* 강의 섹션 */}
      <section className="container px-4 md:px-6 py-12 bg-muted/50 rounded-lg">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">인기 강의</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              레버리지캠프의 인기 있는 강의를 만나보세요.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* 강의 카드 1 */}
          <Card>
            <CardHeader>
              <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-4 bg-gray-200">
                {/* <Image 
                  src="/images/lecture-1.jpg" 
                  alt="해외 구매대행 기초"
                  fill
                  className="object-cover"
                /> */}
              </div>
              <CardTitle>해외 구매대행 기초</CardTitle>
              <CardDescription>해외 구매대행 비즈니스의 기초를 배워보세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">강사: 신자동</p>
              <p className="font-bold mt-2">₩99,000</p>
            </CardContent>
            <CardFooter>
              <Link href="/lectures/1" className="w-full">
                <Button className="w-full">자세히 보기</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* 강의 카드 2 */}
          <Card>
            <CardHeader>
              <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-4 bg-gray-200">
                {/* <Image 
                  src="/images/lecture-2.jpg" 
                  alt="ChatGPT 활용법"
                  fill
                  className="object-cover"
                /> */}
              </div>
              <CardTitle>ChatGPT 활용법</CardTitle>
              <CardDescription>ChatGPT를 비즈니스에 효과적으로 활용하는 방법</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">강사: 신우성</p>
              <p className="font-bold mt-2">₩79,000</p>
            </CardContent>
            <CardFooter>
              <Link href="/lectures/2" className="w-full">
                <Button className="w-full">자세히 보기</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* 강의 카드 3 */}
          <Card>
            <CardHeader>
              <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-4 bg-gray-200">
                {/* <Image 
                  src="/images/lecture-3.jpg" 
                  alt="온라인 마케팅 전략"
                  fill
                  className="object-cover"
                /> */}
              </div>
              <CardTitle>온라인 마케팅 전략</CardTitle>
              <CardDescription>효과적인 온라인 마케팅 전략 수립하기</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">강사: 신자동</p>
              <p className="font-bold mt-2">₩89,000</p>
            </CardContent>
            <CardFooter>
              <Link href="/lectures/3" className="w-full">
                <Button className="w-full">자세히 보기</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/lectures">
            <Button variant="outline">모든 강의 보기</Button>
          </Link>
        </div>
      </section>

      {/* 챌린지 섹션 */}
      <section className="container px-4 md:px-6 py-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">진행 중인 챌린지</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              함께 성장하는 레버리지캠프의 챌린지에 참여해보세요.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* 챌린지 카드 1 */}
          <Card>
            <CardHeader>
              <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-4 bg-gray-200">
                {/* <Image 
                  src="/images/challenge-1.jpg" 
                  alt="30일 해외구매대행 챌린지"
                  fill
                  className="object-cover"
                /> */}
              </div>
              <CardTitle>30일 해외구매대행 챌린지</CardTitle>
              <CardDescription>30일 동안 해외구매대행 비즈니스 시작하기</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">기간: 2025.05.01 ~ 2025.05.30</p>
              <p className="font-bold mt-2">참가비: ₩50,000</p>
            </CardContent>
            <CardFooter>
              <Link href="/challenge/1" className="w-full">
                <Button className="w-full">참가하기</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* 챌린지 카드 2 */}
          <Card>
            <CardHeader>
              <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-4 bg-gray-200">
                {/* <Image 
                  src="/images/challenge-2.jpg" 
                  alt="AI 비즈니스 아이디어 챌린지"
                  fill
                  className="object-cover"
                /> */}
              </div>
              <CardTitle>AI 비즈니스 아이디어 챌린지</CardTitle>
              <CardDescription>AI를 활용한 비즈니스 아이디어 개발하기</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">기간: 2025.06.01 ~ 2025.06.30</p>
              <p className="font-bold mt-2">참가비: ₩30,000</p>
            </CardContent>
            <CardFooter>
              <Link href="/challenge/2" className="w-full">
                <Button className="w-full">참가하기</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/challenge">
            <Button variant="outline">모든 챌린지 보기</Button>
          </Link>
        </div>
      </section>

      {/* 뉴스레터 구독 섹션 */}
      <section className="container px-4 md:px-6 py-12 bg-primary/5 rounded-lg">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">뉴스레터 구독하기</h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              레버리지캠프의 최신 소식과 유용한 정보를 받아보세요.
            </p>
          </div>
          <div className="w-full max-w-md space-y-2">
            <form className="flex space-x-2">
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                placeholder="이메일 주소를 입력하세요"
                type="email"
              />
              <Button type="submit">구독하기</Button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              구독 신청 시 개인정보 처리방침에 동의하게 됩니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
