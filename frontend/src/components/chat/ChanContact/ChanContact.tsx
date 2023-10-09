import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

interface ButtonListProps {
  isCreator: boolean;
  isAdmin: boolean;
  addAdmin: () => any;
}

function ButtonList({ isCreator, isAdmin, addAdmin }: ButtonListProps) {
  if (isCreator || isAdmin) {
    return (
      <button className="rounded-full" type="button" onClick={addAdmin}>
        <MdOutlineAdminPanelSettings className="h-6 w-6 text-pong-blue-100" />
      </button>
    );
  }
  return null;
}

interface ChanContactProps {
  username: string;
  url: string;
  addAdmin: () => any;
  isCreator: boolean;
  isAdmin: boolean;
}

export function ChanContact({
  username,
  url,
  addAdmin,
  isCreator,
  isAdmin
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
        <ButtonList
          isCreator={isCreator}
          isAdmin={isAdmin}
          addAdmin={addAdmin}
        />
      </div>
      <hr className="border-pong-blue-700" />
    </>
  );
}
