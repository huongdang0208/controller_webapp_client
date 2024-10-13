"use client";
// import { metadata } from "./metadata";
import localFont from "next/font/local";
import "./globals.css";
import { ApolloClientProvider } from "./lib/apollo-client/providers";
import ReduxProvider from "./lib/redux/redux-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>{'Harmony Hub'}</title>
        <meta name="description" content={'Remote controlling hub'} />
        {/* Add other metadata tags here */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ApolloClientProvider>{children}</ApolloClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
