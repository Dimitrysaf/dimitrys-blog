import React from 'react';
import Container from './Container';
import Link from 'next/link';
import SearchButton from './SearchButton';
import Menu from './Menu';

const AppBar: React.FC = () => {
  return (
    <header className="app-bar">
      <Container>
        <div className="flex items-center justify-between h-[70px]">
          <Link href="/">
            <h1 className="text-2xl font-bold">
              <div className="leading-tight">Το Ιστολόγιο</div>
              <div className="font-['Times_New_Roman',_serif] leading-tight text-sm">του Δημήτρη</div>
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <SearchButton />
            <Menu />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default AppBar;