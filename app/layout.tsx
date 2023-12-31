import SiteHeader from '@/components/site-header'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Toaster } from "@/components/ui/toaster"


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ECommerce',
  description: 'ECommerce Client',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
          )}
        >
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <Toaster />
          </div>
        </body>
      </html>
    </>
  )
}
