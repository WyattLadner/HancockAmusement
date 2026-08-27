import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://hancockamusement.com"),
  title: {
    default:
      "Hancock Amusement — Amusement Equipment, ATMs & Leagues | South MS & SE Louisiana",
    template: "%s | Hancock Amusement",
  },
  description:
    "Pool tables, dartboards, jukeboxes, arcade and ATM placement for bars and venues across South Mississippi and Southeast Louisiana. Family owned.",
  openGraph: {
    title: "Hancock Amusement — Games That Keep Your Bar Busy",
    description:
      "Amusement equipment and ATMs for bars and venues in South Mississippi and Southeast Louisiana. Family owned.",
    images: ["/images/og-image.jpg"],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable}`}>
      <body className="bg-ink text-chalk font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-red focus:text-ink focus:px-4 focus:py-2 focus:rounded-md"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
