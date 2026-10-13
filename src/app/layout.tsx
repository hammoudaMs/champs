import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces, Noto_Sans_Arabic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { I18nProvider } from "@/i18n/i18n-provider";
import { VENUE } from "@/lib/venue";
import "./globals.css";

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const arabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://champs-olive.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${VENUE.name} — Self-service`,
    template: `%s · ${VENUE.name}`,
  },
  description:
    "Commandez depuis votre table. La carte de Café Champ's, sans file d'attente. Prix en DT TTC.",
  applicationName: VENUE.name,
  appleWebApp: {
    capable: true,
    title: VENUE.name,
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "fr_TN",
    url: siteUrl,
    siteName: VENUE.name,
    title: `${VENUE.name} — Self-service`,
    description: "Commandez depuis votre table. Carte café, cocktails et desserts.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: VENUE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${VENUE.name} — Self-service`,
    description: "Commandez depuis votre table chez Café Champ's.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-icon",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2F3B2A",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${body.variable} ${display.variable} ${arabic.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-ink-text">
        <I18nProvider>{children}</I18nProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
