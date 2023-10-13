import { ChanContact } from './ChanContact/ChanContact';
import { UnbanButton } from './UnbanButton';

interface BannedContactProps {
  userID: string;
  username: string;
  chanID: string;
  displayButtons: boolean;
}

export function BannedContact({
  userID,
  username,
  chanID,
  displayButtons
}: BannedContactProps) {
  const buttons = () => <UnbanButton userID={userID} chanID={chanID} />;
  return (
    <ChanContact key={userID} username={username} url="starwatcher.jpg">
      {displayButtons ? buttons() : null}
    </ChanContact>
  );
}
