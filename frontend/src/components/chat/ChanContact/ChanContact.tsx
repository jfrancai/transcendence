import { Tooltip } from 'react-tooltip';
import {
  MdAdminPanelSettings,
  MdOutlineAdminPanelSettings
} from 'react-icons/md';
import { GiBootKick } from 'react-icons/gi';
import { FaBan } from 'react-icons/fa';
import { AiFillLock } from 'react-icons/ai';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import { useSocketContext } from '../../../contexts/socket';

interface ButtonListProps {
  userID: string;
  chanID: string;
  isCreator: boolean;
  isAdmin: boolean;
  adminSection: boolean;
  isBanned: boolean;
}

function ButtonList({
  userID,
  chanID,
  isCreator,
  isAdmin,
  adminSection,
  isBanned
}: ButtonListProps) {
  const { socket } = useSocketContext();
  const addAdmin = () => {
    socket.emit('channelAddAdmin', {
      usersID: [userID],
      chanID
    });
  };

  const removeAdmin = () => {
    socket.emit('channelRemoveAdmin', {
      usersID: [userID],
      chanID
    });
  };

  const kickUser = () => {
    socket.emit('channelRestrict', {
      userID,
      chanID,
      restrictType: 'KICK',
      reason: 'You have been kick'
    });
  };

  const banUser = () => {
    socket.emit('channelRestrict', {
      userID,
      chanID,
      restrictType: 'BAN',
      reason: 'You have been ban'
    });
  };

  const unbanUser = () => {
    socket.emit('channelRestrict', {
      userID,
      chanID,
      restrictType: 'UNBAN',
      reason: 'You have been unban'
    });
  };
  if (isBanned) {
    return (
      <>
        <button className="rounded-full" type="button" onClick={unbanUser}>
          <AiFillLock className="unbanUser h-6 w-6 text-pong-blue-100" />
        </button>
        <Tooltip
          disableStyleInjection
          className="z-50 flex flex-col rounded border-pong-blue-100 bg-pong-blue-500 bg-opacity-100 p-2 text-pong-white text-opacity-100 "
          anchorSelect=".unbanUser"
          clickable
          place="bottom"
        >
          <p className="font-semibold">Unban user</p>
        </Tooltip>
      </>
    );
  }
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
  userID: string;
  chanID: string;
  url: string;
  isCreator: boolean;
  isAdmin: boolean;
  adminSection: boolean;
  isBanned: boolean;
}

export function ChanContact({
  username,
  userID,
  chanID,
  url,
  isCreator,
  isAdmin,
  adminSection,
  isBanned
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
          userID={userID}
          chanID={chanID}
          isCreator={isCreator}
          isAdmin={isAdmin}
          adminSection={adminSection}
          isBanned={isBanned}
        />
      </div>
      <hr className="border-pong-blue-700" />
    </>
  );
}
