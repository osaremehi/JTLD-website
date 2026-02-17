import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatBot from "@/components/ChatBot";
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
  title: {
    default: "JTLD Consulting Inc | Business Consulting & Technology Services",
    template: "%s | JTLD Consulting Inc",
  },
  description:
    "JTLD Consulting Inc delivers strategic business consulting, managed IT services, AI solutions, data analytics, and cloud infrastructure to drive measurable results.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://jtldinc.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "JTLD Consulting Inc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('jtld-theme');var d=s==='dark'||(s!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "JTLD Consulting Inc",
              url: "https://jtldinc.com",
              logo: "https://jtldinc.com/logo.svg",
              description:
                "Canadian business consulting and technology services firm delivering strategic consulting, managed IT, AI solutions, data analytics, and cloud infrastructure.",
              foundingDate: "2015",
              areaServed: "CA",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+1-416-555-1234",
                  contactType: "sales",
                  email: "info@jtldinc.com",
                  areaServed: "CA",
                },
              ],
              address: [
                {
                  "@type": "PostalAddress",
                  streetAddress: "100 King Street West, Suite 5600",
                  addressLocality: "Toronto",
                  addressRegion: "ON",
                  addressCountry: "CA",
                },
                {
                  "@type": "PostalAddress",
                  streetAddress: "525 8th Avenue SW, Suite 2500",
                  addressLocality: "Calgary",
                  addressRegion: "AB",
                  addressCountry: "CA",
                },
                {
                  "@type": "PostalAddress",
                  streetAddress: "1055 West Georgia Street, Suite 1500",
                  addressLocality: "Vancouver",
                  addressRegion: "BC",
                  addressCountry: "CA",
                },
              ],
              sameAs: [],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <ChatBot />
        </ThemeProvider>
      </body>
    </html>
  );
}
