import React from 'react';
import AppBar from './AppBar';
import { Toaster } from '@/components/ui/sonner';
import Footer from './Footer';
import { useRouter } from 'next/router';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen">
      <AppBar />
      <main className="flex-grow">
        {isDashboard ? (
          <SidebarProvider>
            <AppSidebar style={{ top: '70px' }}/>
            <SidebarInset>
              {children}
            </SidebarInset>
          </SidebarProvider>
        ) : (
          children
        )}
      </main>
      <Footer />
      <Toaster richColors />
    </div>
  );
};

export default Layout;
