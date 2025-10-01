import React from 'react';
import AppBar from './AppBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AppBar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
