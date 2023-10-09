import {
  MdAdminPanelSettings,
  MdOutlineAdminPanelSettings
} from 'react-icons/md';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

interface ButtonListProps {
  isCreator: boolean;
  isAdmin: boolean;
  adminSection: boolean;
  addAdmin: () => any;
  removeAdmin: () => any;
}

function ButtonList({
  isCreator,
  isAdmin,
  adminSection,
  addAdmin,
  removeAdmin
}: ButtonListProps) {
  if (isCreator || isAdmin) {
    if (adminSection) {
      return (
        <button className="rounded-full" type="button" onClick={removeAdmin}>
          <MdAdminPanelSettings className="h-6 w-6 text-pong-blue-100" />
        </button>
      );
    }
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
  removeAdmin: () => any;
  isCreator: boolean;
  isAdmin: boolean;
  adminSection: boolean;
}

export function ChanContact({
  username,
  url,
  addAdmin,
  removeAdmin,
  isCreator,
  isAdmin,
  adminSection
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
          removeAdmin={removeAdmin}
          adminSection={adminSection}
        />
      </div>
      <hr className="border-pong-blue-700" />
    </>
  );
}
