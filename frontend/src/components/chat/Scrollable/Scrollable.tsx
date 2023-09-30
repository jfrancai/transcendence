interface ScrollableProps {
  children: React.ReactNode;
}

export function Scrollable({ children }: ScrollableProps) {
  return (
    <div className="hide-scrollbar h-[758px] max-h-[90vh] shrink-0 flex-col-reverse items-center justify-end overflow-y-scroll">
      {children}
    </div>
  );
}
