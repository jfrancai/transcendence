import { UIEventHandler } from 'react';

interface ScrollableProps {
  children: React.ReactNode;
  onScroll?: UIEventHandler;
  width?: number | undefined;
}

export function Scrollable({
  children,
  onScroll,
  width = undefined
}: ScrollableProps) {
  return (
    <div className={`flex ${width ? `w-[${width}px]` : 'w-auto'}`}>
      <div
        onScroll={onScroll}
        className="no-scrollbar h-[758px] max-h-[90vh] w-full shrink-0 flex-col-reverse items-center justify-end overflow-y-scroll"
      >
        <div className="no-scrollbar mt-28">{children}</div>
      </div>
    </div>
  );
}
