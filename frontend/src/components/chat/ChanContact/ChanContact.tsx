import { Tooltip } from 'react-tooltip';
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
            <MdAdminPanelSettings className="removeAdmin h-6 w-6 text-pong-blue-100" />
          </button>
          <Tooltip
            disableStyleInjection
            className="z-50 flex flex-col rounded border-pong-blue-100 bg-pong-blue-500 bg-opacity-100 p-2 text-pong-white text-opacity-100 "
            anchorSelect=".removeAdmin"
            clickable
            place="bottom"
          >
            <p className="font-semibold">Remove admin</p>
          </Tooltip>

          <button className="rounded-full" type="button" onClick={kickUser}>
            <GiBootKick className="kickUser h-6 w-6 text-pong-blue-100" />
          </button>
          <Tooltip
            disableStyleInjection
            className="z-50 flex flex-col rounded border-pong-blue-100 bg-pong-blue-500 bg-opacity-100 p-2 text-pong-white text-opacity-100 "
            anchorSelect=".kickUser"
            clickable
            place="bottom"
          >
            <p className="font-semibold">Kick user</p>
          </Tooltip>
          <button className="rounded-full" type="button" onClick={banUser}>
            <FaBan className="banUser h-6 w-6 text-pong-blue-100" />
          </button>
          <Tooltip
            disableStyleInjection
            className="z-50 flex flex-col rounded border-pong-blue-100 bg-pong-blue-500 bg-opacity-100 p-2 text-pong-white text-opacity-100 "
            anchorSelect=".banUser"
            clickable
            place="bottom"
          >
            <p className="font-semibold">Ban user</p>
          </Tooltip>
        </div>
      );
    }
    return (
      <div className="flex flex-row gap-1">
        <button className="rounded-full" type="button" onClick={addAdmin}>
          <MdOutlineAdminPanelSettings className="addAdmin h-6 w-6 text-pong-blue-100" />
        </button>
        <Tooltip
          disableStyleInjection
          className="z-50 flex flex-col rounded border-pong-blue-100 bg-pong-blue-500 bg-opacity-100 p-2 text-pong-white text-opacity-100 "
          anchorSelect=".addAdmin"
          clickable
          place="bottom"
        >
          <p className="font-semibold">Add admin</p>
        </Tooltip>
        <button className="rounded-full" type="button" onClick={kickUser}>
          <GiBootKick className="kickUser h-6 w-6 text-pong-blue-100" />
        </button>
        <Tooltip
          disableStyleInjection
          className="z-50 flex flex-col rounded border-pong-blue-100 bg-pong-blue-500 bg-opacity-100 p-2 text-pong-white text-opacity-100 "
          anchorSelect=".kickUser"
          clickable
          place="bottom"
        >
          <p className="font-semibold">Kick user</p>
        </Tooltip>
        <button className="rounded-full" type="button" onClick={banUser}>
          <FaBan className="banUser h-6 w-6 text-pong-blue-100" />
        </button>
        <Tooltip
          disableStyleInjection
          className="z-50 flex flex-col rounded border-pong-blue-100 bg-pong-blue-500 bg-opacity-100 p-2 text-pong-white text-opacity-100 "
          anchorSelect=".banUser"
          clickable
          place="bottom"
        >
          <p className="font-semibold">Ban user</p>
        </Tooltip>
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
