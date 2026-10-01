import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Great_Vibes, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: "400",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Nuestra Boda — Ervin & Sindy",
  description: "Invitación digital a la boda de Ervin y Sindy",
};

export const viewport = {
  themeColor: "#FCFBF9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${cormorant.variable} ${jakarta.variable} ${greatVibes.variable} font-sans bg-cream-50 text-ink antialiased overflow-x-hidden selection:bg-sage-200 selection:text-sage-900`}
        id="bodyRoot"
      >
        {children}
      </body>
    </html>
  );
}
