

"use client";

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { useState, useEffect } from 'react';
import { LoginDialog } from '@/components/login-dialog';
import { WelcomeDialog } from '@/components/welcome-dialog';
import { TransactionsProvider } from '@/context/transactions-context';
import { SubscriptionProvider } from '@/context/subscription-context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup' | 'loading'>('loading');

  useEffect(() => {
    // This effect runs only on the client, after hydration
    const user = localStorage.getItem('rupee-route-user');
    setAuthView(user ? 'login' : 'signup');
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setAuthView('loading'); 
  };
  
  const handleLogout = () => {
    localStorage.removeItem("rupee-route-user");
    localStorage.removeItem("rupee-route-password");
    localStorage.removeItem("rupee-route-phone");
    localStorage.removeItem("rupee-route-transactions");
    localStorage.removeItem("favoriteCategories");
    localStorage.removeItem("rupee-route-subscribed");
    window.location.reload();
  };

  const renderAuthScreen = () => {
    if (authView === 'loading') {
      return null; 
    }
    
    if (authView === 'login') {
      return <LoginDialog onLoginSuccess={handleAuthSuccess} onSwitchToSignUp={() => setAuthView('signup')} />;
    } else {
      return <WelcomeDialog onSetupSuccess={handleAuthSuccess} onSwitchToLogin={() => setAuthView('login')} />;
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        {!isAuthenticated ? (
          renderAuthScreen()
        ) : (
          <TransactionsProvider>
            <SubscriptionProvider>
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
                      <UserNav onLogout={handleLogout} />
                    </header>
                    {children}
                  </div>
                </SidebarInset>
              </SidebarProvider>
            </SubscriptionProvider>
          </TransactionsProvider>
        )}
        <Toaster />
      </body>
    </html>
  );
}
