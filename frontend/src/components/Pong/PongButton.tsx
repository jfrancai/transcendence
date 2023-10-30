import { MouseEventHandler, ReactNode } from 'react';

interface PongButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler | undefined;
}

export function BluePongButton({ children, onClick }: PongButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded bg-blue-pong-4 px-4 py-2 font-bold text-white hover:bg-blue-pong-3"
    >
      {children}
    </button>
  );
}

export function RedPongButton({ children, onClick }: PongButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
    >
      {children}
    </button>
  );
}
