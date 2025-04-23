import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className={cn("mx-auto w-full max-w-screen-md px-4 py-8 md:px-6 md:py-12", className)}>
      {children}
    </div>
  );
};

export default Container;
