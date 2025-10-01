import React from 'react';
import Container from './Container';
import Link from 'next/link';

const AppBar: React.FC = () => {
  return (
    <header className="app-bar">
      <Container>
        <div className="flex items-center justify-between h-[70px]">
          <Link href="/">
            <h1 className="text-2xl font-bold">
              <div className="leading-tight">Το Ιστορλόγιο</div>
              <div className="font-['Times_New_Roman',_serif] leading-tight text-sm">του Δημήτρη</div>
            </h1>
          </Link>
        </div>
      </Container>
    </header>
  );
};

export default AppBar;
