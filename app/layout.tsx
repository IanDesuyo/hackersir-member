import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import { getServerSession } from "@/lib/auth";
import AppProvider from "@/components/appProvider";
import Nav from "@/components/nav";

import "./globals.css";

const font = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "黑客社社員系統",
    template: "%s | 黑客社社員系統",
  },
  colorScheme: "dark",
  themeColor: "#0a0a0a",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession();

  return (
    <html lang="en" className={font.className}>
      <body className="dark">
        <AppProvider session={session}>
          <div className="min-h-screen">
            <header className="sticky top-0 z-40 w-full border-b bg-background">
              <Nav />
            </header>
            <div className="container pt-4">{children}</div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
