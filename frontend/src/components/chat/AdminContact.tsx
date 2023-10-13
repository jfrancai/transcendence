import { BanButton } from './BanButton';
import { ChanContact } from './ChanContact/ChanContact';
import { KickButton } from './KickButton';
import { RemoveAdminButton } from './RemoveAdminButton';

interface AdminContactProps {
  username: string;
  userID: string;
  chanID: string;
  displayButtons: boolean;
}

export function AdminContact({
  username,
  userID,
  chanID,
  displayButtons
}: AdminContactProps) {
  const buttons = () => (
    <>
      <RemoveAdminButton userID={userID} chanID={chanID} />
      <KickButton userID={userID} chanID={chanID} />
      <BanButton userID={userID} chanID={chanID} />
    </>
  );
  return (
    <ChanContact key={userID} username={username} url="starwatcher.jpg">
      {displayButtons ? buttons() : null}
    </ChanContact>
  );
}
