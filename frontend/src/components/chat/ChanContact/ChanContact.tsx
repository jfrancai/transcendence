import {
  MdAdminPanelSettings,
  MdOutlineAdminPanelSettings
} from 'react-icons/md';
import { GiBootKick } from 'react-icons/gi';
import { FaBan } from 'react-icons/fa';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

interface ButtonListProps {
  isCreator: boolean;
  isAdmin: boolean;
  adminSection: boolean;
  addAdmin: () => any;
  removeAdmin: () => any;
  kickUser: () => any;
  banUser: () => any;
}

function ButtonList({
  isCreator,
  isAdmin,
  adminSection,
  addAdmin,
  removeAdmin,
  kickUser,
  banUser
}: ButtonListProps) {
  if (isCreator || isAdmin) {
    if (adminSection) {
      return (
        <div className="flex flex-row gap-1">
          <button className="rounded-full" type="button" onClick={removeAdmin}>
            <MdAdminPanelSettings className="h-6 w-6 text-pong-blue-100" />
          </button>
          <button className="rounded-full" type="button" onClick={kickUser}>
            <GiBootKick className="h-6 w-6 text-pong-blue-100" />
          </button>
          <button className="rounded-full" type="button" onClick={banUser}>
            <FaBan className="h-6 w-6 text-pong-blue-100" />
          </button>
        </div>
      );
    }
    return (
      <div className="flex flex-row gap-1">
        <button className="rounded-full" type="button" onClick={addAdmin}>
          <MdOutlineAdminPanelSettings className="h-6 w-6 text-pong-blue-100" />
        </button>
        <button className="rounded-full" type="button" onClick={kickUser}>
          <GiBootKick className="h-6 w-6 text-pong-blue-100" />
        </button>
        <button className="rounded-full" type="button" onClick={banUser}>
          <FaBan className="h-6 w-6 text-pong-blue-100" />
        </button>
      </div>
    );
  }
  return null;
}

interface ChanContactProps {
  username: string;
  url: string;
  addAdmin: () => any;
  removeAdmin: () => any;
  kickUser: () => any;
  banUser: () => any;
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
  adminSection,
  kickUser,
  banUser
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
          kickUser={kickUser}
          banUser={banUser}
        />
      </div>
      <hr className="border-pong-blue-700" />
    </>
  );
}
