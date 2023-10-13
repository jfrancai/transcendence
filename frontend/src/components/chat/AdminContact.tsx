import { BanButton } from './BanButton';
import { ChanContact } from './ChanContact/ChanContact';
import { KickButton } from './KickButton';
import { ToggleAdmin } from './ToggleAdmin';

interface AdminContactProps {
  username: string;
  userID: string;
  chanID: string;
  toggleAdmin: boolean;
}

export function AdminContact({
  username,
  userID,
  chanID,
  toggleAdmin
}: AdminContactProps) {
  return (
    <ChanContact key={userID} username={username} url="starwatcher.jpg">
      <ToggleAdmin toggle={toggleAdmin} userID={userID} chanID={chanID} />
      <KickButton userID={userID} chanID={chanID} />
      <BanButton userID={userID} chanID={chanID} />
    </ChanContact>
  );
}
