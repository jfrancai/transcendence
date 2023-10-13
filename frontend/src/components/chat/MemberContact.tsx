import { AddAdminButton } from './AddAdminButton';
import { BanButton } from './BanButton';
import { ChanContact } from './ChanContact/ChanContact';
import { KickButton } from './KickButton';

interface MemberContactProps {
  username: string;
  userID: string;
  chanID: string;
  displayButtons: boolean;
}

export function MemberContact({
  username,
  userID,
  chanID,
  displayButtons
}: MemberContactProps) {
  const buttons = () => (
    <>
      <AddAdminButton userID={userID} chanID={chanID} />
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
