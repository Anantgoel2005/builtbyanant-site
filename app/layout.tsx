import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://builtbyanant.site"),
  title: "Anant Goel — Intelligent Systems Engineer",
  description: "Applied AI, computer vision, security engineering, and full-stack systems built by Anant Goel.",
  openGraph: {
    title: "Anant Goel — Intelligent Systems Engineer",
    description: "Intelligent systems. Real-world impact.",
    url: "https://builtbyanant.site",
    siteName: "Anant Goel",
    images: [{ url: "/og.png", width: 1733, height: 907, alt: "Anant Goel — Intelligent systems, real-world impact." }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Anant Goel — Intelligent Systems Engineer", description: "Intelligent systems. Real-world impact.", images: ["/og.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
