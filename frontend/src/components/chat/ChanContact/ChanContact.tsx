import ProfilePicture from '../ProfilePicture/ProfilePicture';

interface ChanContactProps {
  children?: React.ReactNode;
  username: string;
  url: string;
}

export function ChanContact({
  children: buttons,
  username,
  url
}: ChanContactProps) {
  return (
    <>
      <div className="mx-2 my-1 flex flex-shrink-0 items-center justify-between p-3 text-left">
        <div className="flex items-center justify-center gap-3">
          <ProfilePicture size="xs" url={url} />
          <p className="semibold max-w-[200px] break-all text-base text-pong-white">
            {username}
          </p>
        </div>
        <div className="flex flex-row gap-1">{buttons}</div>
      </div>
      <hr className="border-pong-blue-700" />
    </>
  );
}
