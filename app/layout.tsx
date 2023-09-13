import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import { getServerSession } from "@/lib/auth";
import AppProvider from "@/components/appProvider";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import { env } from "@/lib/env.mjs";

import "./globals.css";

const font = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "逢甲大學黑客社",
    template: "%s | 逢甲大學黑客社",
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
        <AppProvider session={session}>{children}</AppProvider>
        <Toaster />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${env.GA_TRACKING_ID}`} />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${env.GA_TRACKING_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
