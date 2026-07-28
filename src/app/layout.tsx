import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nutropx Lab | Cognitive Fitness Platform",
  description:
    "Train your brain daily with cognitive exercises, track your Cognitive Fitness Score personal wellness benchmark, and build consistent mental habits with Nutropx Lab.",
  appleWebApp: {
    capable: true,
    title: "Brain Lab",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF6B2C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
