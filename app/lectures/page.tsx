import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 강의 목록 페이지
 */
export default function LecturesPage() {
  // 강의 데이터 (실제로는 DB에서 가져올 예정)
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
    },
  ];

  // 카테고리 목록 생성
  const categories = Array.from(new Set(lectures.map(lecture => lecture.category)));

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">강의 목록</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            레버리지캠프의 다양한 강의를 만나보세요
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" className="text-sm">전체</Button>
          {categories.map((category) => (
            <Button key={category} variant="outline" className="text-sm">{category}</Button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lectures.map((lecture) => (
          <Card key={lecture.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative aspect-video w-full overflow-hidden bg-gray-200">
                {/* 실제 이미지가 있을 때 사용할 코드 */}
                {/* <Image
                  src={lecture.image}
                  alt={lecture.title}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                /> */}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-primary">{lecture.category}</p>
                <div className="flex gap-1">
                  {lecture.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <CardTitle className="mt-2 line-clamp-1">{lecture.title}</CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {lecture.description}
              </CardDescription>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">강사: {lecture.instructor}</p>
                <p className="font-bold">₩{lecture.price.toLocaleString()}</p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link href={`/lectures/${lecture.id}`} className="w-full">
                <Button variant="outline" className="w-full">자세히 보기</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
