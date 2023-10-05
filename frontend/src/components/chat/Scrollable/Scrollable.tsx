import { UIEventHandler } from 'react';

interface ScrollableProps {
  children: React.ReactNode;
  onScroll?: UIEventHandler;
}

export function Scrollable({ children, onScroll }: ScrollableProps) {
  return (
    <div
      onScroll={onScroll}
      className="hide-scrollbar h-[758px] max-h-[90vh] shrink-0 flex-col-reverse items-center justify-end overflow-y-scroll"
    >
      {children}
    </div>
  );
}
