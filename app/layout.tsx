import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { WebSocketProvider } from "@/components/ws-context-provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Concord",
  description: "Concord chat web app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  return (
    <html lang="en">
     <SessionProvider session={session}>
      <WebSocketProvider>
          <body className={inter.className}>
            <SpeedInsights />
            {children}
            <Toaster/>
          </body>
        </WebSocketProvider>  
     </SessionProvider>
    </html>
  );
}
