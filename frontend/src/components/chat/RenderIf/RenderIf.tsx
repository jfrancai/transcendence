interface RenderIfProps {
  some: boolean[];
  children: React.ReactNode;
}
function RenderIf({ children, some }: RenderIfProps) {
  return some.some((c) => c) ? children : null;
}

export default RenderIf;
