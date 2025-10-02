import React from 'react';
import AppBar from './AppBar';
import { Toaster } from '@/components/ui/sonner';
import Footer from './Footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <AppBar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Toaster richColors />
    </div>
  );
};

export default Layout;
