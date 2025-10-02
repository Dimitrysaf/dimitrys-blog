import React from 'react';
import AppBar from './AppBar';
import { Toaster } from '@/components/ui/sonner';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AppBar />
      <main>{children}</main>
      <Toaster richColors />
    </div>
  );
};

export default Layout;
