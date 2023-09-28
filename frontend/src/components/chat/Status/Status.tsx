interface StatusProps {
  position: 'start' | 'center' | 'end';
  severity: 'ok' | 'warn' | 'err';
  message: string;
  onClick: () => void;
}

const colors = Object.freeze({
  ok: 'bg-green-300',
  warn: 'bg-yellow-500',
  err: 'bg-red-500'
});

/**
 * Status components
 */
export default function Status({
  position = 'center',
  severity = 'ok',
  message = 'Connecting',
  onClick
}: StatusProps) {
  return (
    <button
      type="button"
      aria-label="Connect button"
      className={`ml-10 flex h-5 w-full flex-shrink-0 items-center justify-${position} gap-5 bg-transparent`}
      onClick={onClick}
    >
      <span className={`h-4 w-4 rounded-full ${colors[severity]}`} />
      <p className="flex pt-1 text-base font-bold text-white ">{message}</p>
    </button>
  );
}
