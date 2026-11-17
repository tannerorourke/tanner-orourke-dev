import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Newsreader, Roboto_Flex } from "next/font/google";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ViewTransitions } from "next-view-transitions";

import AppProvider from "@/components/providers/AppProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

import { content } from "@/lib/content/content";
import { lightTheme, darkTheme } from "@/lib/theme/theme.css";
import './global.css';
import './global.styles.css';
import 'katex/dist/katex.min.css';


const robotoFlex = Roboto_Flex({
  style: "normal",
  variable: "--font-display",
  subsets: ["latin"]
});

const newsreader = Newsreader({
  style: "normal",
  variable: "--font-serif",
  subsets: ["latin"]
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"]
});

// -- the production domain on every Vercel build, so preview builds never canonicalize to themselves
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tanner O\'Rourke — ML Engineer & Interpretability Researcher",
    template: "%s · Tanner O\'Rourke",
  },
  description: "Tanner O\'Rourke | ML Engineer & Researcher, Evaluation & Interpretability | MS in AI from UT Austin. Work in evaluation infrastructure, mechanistic interpretability, manifold analysis, and time-series modeling.",
  applicationName: "Tanner O\'Rourke Portfolio",
  authors: [{ name: "Tanner O\'Rourke", url: SITE_URL }],
  creator: "Tanner O\'Rourke",
  publisher: "Tanner O\'Rourke",

  manifest: "/manifest.webmanifest",

  openGraph: {
    type: "website",
    siteName: "Tanner O'Rourke",
    title: "Tanner O'Rourke - ML Engineer & Interpretability Researcher",
    description: "ML engineer and mechanistic-interpretability researcher. MS in AI, UT Austin.",
    url: SITE_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSV
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-video-preview": 60,
      "max-image-preview": "large",
    },
  },
};


export default async function RootLayout({ 
  children,
}: Readonly<{ 
  children: React.ReactNode; 
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const theme = themeCookie === "dark" ? "dark" : "light";
  const themeClass = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ViewTransitions>
      <html
        lang="en"
        className={`${themeClass} ${robotoFlex.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
        data-theme={theme}
      >
        <body>
          <ThemeProvider initialTheme={theme} hasCookie={!!themeCookie}>
            <AppProvider numProjects={content.projectMeta.num}>
                {children}
                <Analytics />
                <SpeedInsights />
            </AppProvider>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
