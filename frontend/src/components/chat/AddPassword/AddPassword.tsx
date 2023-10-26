interface UpdateChannelProps {
  handler: () => any;
  label: string;
  disabled?: boolean;
  display: boolean;
}

export function UpdateChannel({
  display,
  handler,
  label,
  disabled
}: UpdateChannelProps) {
  if (display) {
    return (
      <button
        onClick={disabled ? () => {} : handler}
        type="button"
        className={`configButton mx-2 rounded ${
          disabled
            ? 'bg-pong-blue-800 text-pong-blue-100'
            : 'bg-pong-blue-600 text-pong-white hover:bg-pong-blue-500'
        } px-4 py-2 shadow `}
      >
        {label}
      </button>
    );
  }
  return null;
}
