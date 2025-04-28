import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

/**
 * 메인 레이아웃 컴포넌트
 * 헤더와 푸터를 포함한 기본 레이아웃을 제공합니다.
 */
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
