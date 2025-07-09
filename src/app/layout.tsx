import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';

export const metadata: Metadata = {
  title: 'RupeeRoute - Personal Finance Tracker',
  description: 'Track your income, expenses, and budgets with ease.',
  icons: {
    icon: '/favicon.ico',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <Logo />
            </SidebarHeader>
            <SidebarContent>
              <MainNav />
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <div className="flex h-full flex-col">
              <header className="sticky top-0 z-10 flex h-16 items-center justify-end gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
                <UserNav />
              </header>
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
