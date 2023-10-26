import { ReactNode } from 'react';

interface PongDivProps {
  children: ReactNode;
}

export function PongDiv({ children }: PongDivProps) {
  return <div className="absolute flex flex-col gap-5">{children}</div>;
}
