import ProfilePicture from '../ProfilePicture/ProfilePicture';
import { BanButton } from '../BanButton';
import { KickButton } from '../KickButton';
import { AddAdminButton } from '../AddAdminButton';
import { RemoveAdminButton } from '../RemoveAdminButton';
import { UnbanButton } from '../UnbanButton';
import { ToggleAdmin } from '../ToggleAdmin';

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
  if (isBanned) {
    return (
      <div className="flex flex-row gap-1">
        <UnbanButton userID={userID} chanID={chanID} />
      </div>
    );
  }
  if (isCreator || isAdmin) {
    return (
      <div className="flex flex-row gap-1">
        <ToggleAdmin toggle={adminSection} userID={userID} chanID={chanID} />
        <KickButton userID={userID} chanID={chanID} />
        <BanButton userID={userID} chanID={chanID} />
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
