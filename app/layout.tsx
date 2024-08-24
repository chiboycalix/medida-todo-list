"use client"
import { ToastProvider } from '@/components/ToastContainer';
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { Suspense } from 'react'
import Loader from '@/components/Loader';
import { PerformanceMonitor } from '@/components/PerformanceMonitor'
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            <Suspense fallback={<Loader />}>
              <PerformanceMonitor />
              {children}
            </Suspense>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
