interface SectionTitleProps {
  title: string;
}

export function SectionTitle({ title }: SectionTitleProps) {
  return <p className="block text-sm font-bold text-pong-white">{title}</p>;
}

interface SectionProps {
  children: React.ReactNode;
}

export function Section({ children }: SectionProps) {
  return <div className="flex w-full flex-col gap-1 px-5">{children}</div>;
}
