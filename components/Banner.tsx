import React from 'react';
import Container from './Container'; // Assuming a Container component exists

const Banner = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background text-foreground h-[300px] border-b-4 border-border flex items-center">
      <Container>{children}</Container>
    </div>
  );
};

export default Banner;