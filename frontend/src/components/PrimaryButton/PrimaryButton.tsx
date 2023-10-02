interface PrimaryButtonProps {
  onClick?: (...args: any) => any;
  submit?: boolean;
  children: React.ReactNode;
}
export function PrimaryButton({
  children,
  onClick,
  submit = false
}: PrimaryButtonProps) {
  return (
    <button
      type={submit ? 'submit' : 'button'}
      onClick={onClick}
      className="flex rounded-xl bg-pong-purple-100 px-5 py-2 text-pong-white
        hover:bg-pong-purple-200"
    >
      {children}
    </button>
  );
}
