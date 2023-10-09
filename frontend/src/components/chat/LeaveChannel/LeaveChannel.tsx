import { Tooltip } from 'react-tooltip';

interface LeaveChannelProps {
  handler: () => any;
  label: string;
  disabled: boolean;
  display: boolean;
}

export function LeaveChannel({
  display,
  handler,
  label,
  disabled
}: LeaveChannelProps) {
  if (display) {
    return (
      <>
        <button
          onClick={disabled ? () => {} : handler}
          type="button"
          className={`deleteButton mx-2 rounded ${
            disabled
              ? 'bg-pong-blue-800 text-pong-blue-100'
              : 'bg-red-500 text-pong-white hover:bg-red-600'
          } px-4 py-2 shadow `}
        >
          {label}
        </button>
        <Tooltip
          disableStyleInjection
          className={`z-50 flex flex-col rounded border-pong-blue-100 bg-pong-blue-500 bg-opacity-100 p-2 text-pong-white text-opacity-100 ${
            !disabled && 'hidden'
          }`}
          anchorSelect=".deleteButton"
          clickable
          place="bottom"
        >
          <p className="font-semibold">The channel needs to be empty</p>
        </Tooltip>
      </>
    );
  }
  return null;
}
