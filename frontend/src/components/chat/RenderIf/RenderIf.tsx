interface RenderIfProps {
  conditions: boolean[];
  children: React.ReactNode;
}
function RenderIf({ children, conditions }: RenderIfProps) {
  return conditions.some((c) => c) ? children : null;
}

export default RenderIf;
