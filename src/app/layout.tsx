import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Fairway Planner – Golf Trip Planning Made Easy",
  description:
    "Plan your perfect golf trip. Get course recommendations, coordinate your group, manage lodging, and handle everything from tee time to check-out.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
