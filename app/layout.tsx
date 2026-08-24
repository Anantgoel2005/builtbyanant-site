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
  title: "Anant Goel — Computer Vision & Systems Engineer",
  description: "Computer-vision pipelines, security tools, and local-first products built by Anant Goel.",
  openGraph: {
    title: "Anant Goel — Computer Vision & Systems Engineer",
    description: "Computer-vision pipelines, security tools, and local-first products.",
    url: "https://builtbyanant.site",
    siteName: "Anant Goel",
    images: [{ url: "/og.png", width: 1733, height: 907, alt: "Anant Goel — Intelligent systems, real-world impact." }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Anant Goel — Computer Vision & Systems Engineer", description: "Computer-vision pipelines, security tools, and local-first products.", images: ["/og.png"] },
  keywords: ["Anant Goel", "applied AI", "computer vision", "security engineering", "full-stack systems"],
  authors: [{ name: "Anant Goel", url: "https://builtbyanant.site" }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
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
