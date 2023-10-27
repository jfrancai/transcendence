import { ReactNode } from 'react';

interface PongDivProps {
  children: ReactNode;
  className?: string;
}

export function PongDiv({ children, className }: PongDivProps) {
  return (
    <div
      className={`${className} absolute flex flex-col items-center justify-center gap-5`}
    >
      {children}
    </div>
  );
}
