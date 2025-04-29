import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const notoSansKr = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "레버리지캠프",
  description: "신자동의 레버리지캠프에 오신 것을 환영합니다",
  keywords: "신자동, 해외구매대행, 신우성, 챗gpt, chatGPT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        notoSansKr.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <div className="pt-16">
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">{children}</main>
            </div>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
