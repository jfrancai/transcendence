interface ListHeaderProps {
  children: React.ReactNode;
}

export function ListHeader({ children: title }: ListHeaderProps) {
  return <p className="pl-2 font-semibold text-pong-blue-100">{title}</p>;
}
