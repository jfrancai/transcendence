import { MouseEventHandler } from 'react';
import { Tooltip } from 'react-tooltip';

interface AdminButtonProps {
  children: React.ReactNode;
  onClick?: MouseEventHandler | undefined;
  anchorSelect?: string;
  info: string;
}

export function AdminButton({
  children,
  onClick,
  anchorSelect,
  info
}: AdminButtonProps) {
  return (
    <div>
      <button className="rounded-full" type="button" onClick={onClick}>
        {children}
      </button>
      <Tooltip
        disableStyleInjection
        className="z-50 flex flex-col rounded border-pong-blue-100 bg-pong-blue-500 bg-opacity-100 p-2 text-pong-white text-opacity-100 "
        anchorSelect={`.${anchorSelect}`}
        clickable
        place="bottom"
      >
        <p className="font-semibold">{info}</p>
      </Tooltip>
    </div>
  );
}
