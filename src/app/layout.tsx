import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI PostgreSQL Tester",
  description: "A modern PostgreSQL query interface with AI-powered query generation developed by Nikhilesh Rana",
  keywords: [
    "PostgreSQL",
    "SQL",
    "Database",
    "Query Tool",
    "AI",
    "SQL Generator",
    "Database Management",
  ],
  authors: [
    {
      name: "Nikhilesh Rana",
      url: "https://github.com/REPOSITORY/postgres-manipulator",
    },
  ],
  creator: "Nikhilesh Rana",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://postgres-manipulator.vercel.app",
    title: "PostgreSQL Manipulator",
    description: "A modern PostgreSQL query interface with AI-powered query generation",
    siteName: "https://ai-postgresql-tester.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
    title: "PostgreSQL Manipulator",
    description: "A modern PostgreSQL query interface with AI-powered query generation",
    creator: "@postgres_manipulator",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
