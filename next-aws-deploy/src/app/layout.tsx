import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js AWS Deploy",
  description: "A simple Next.js application deployed to AWS EC2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
