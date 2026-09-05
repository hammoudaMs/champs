import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Noto_Sans_Arabic, Outfit } from "next/font/google";
import { I18nProvider } from "@/i18n/i18n-provider";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const arabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Café Champ's — Self-service",
  description:
    "Commandez depuis votre table. La carte de Café Champ's, sans file d'attente.",
  applicationName: "Café Champ's",
  appleWebApp: {
    capable: true,
    title: "Café Champ's",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070605",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${outfit.variable} ${cormorant.variable} ${greatVibes.variable} ${arabic.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-cream">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
