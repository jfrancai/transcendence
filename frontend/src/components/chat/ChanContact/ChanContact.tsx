import { LegacyRef, MouseEventHandler } from 'react';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

interface ChanContactProps {
  children?: React.ReactNode;
  username: string;
  url: string;
  onContextMenu?: MouseEventHandler | undefined;
  innerRef?: LegacyRef<any> | undefined;
  hideUsername?: boolean;
}

export function ChanContact({
  children: buttons,
  username,
  url,
  onContextMenu,
  innerRef,
  hideUsername
}: ChanContactProps) {
  return (
    <>
      <div
        ref={innerRef}
        onContextMenu={onContextMenu}
        className={`mx-2 my-1 flex flex-shrink-0 items-center justify-between rounded p-3 text-left ${
          hideUsername ? 'bg-pong-blue-500' : ''
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          <ProfilePicture size="xs" url={url} />
          {hideUsername ? null : (
            <p className="semibold max-w-[200px] break-all text-base text-pong-white">
              {username}
            </p>
          )}
        </div>
        <div className="flex flex-row gap-3">{buttons}</div>
      </div>
      <hr className="border-pong-blue-700" />
    </>
  );
}
